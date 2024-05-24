/**
 * Copyright (C) 2021-2023 Technology Matters
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */

import { ActionFunction, ChatOrchestrator, ChatOrchestratorEvent, Manager, TaskHelper } from '@twilio/flex-ui';
import { Conversation } from '@twilio/conversations';
import type { ChatOrchestrationsEvents } from '@twilio/flex-ui/src/ChatOrchestrator';

import { adjustChatCapacity, getDefinitionVersion, sendSystemMessage } from '../services/ServerlessService';
import * as Actions from '../states/contacts/actions';
import { populateCurrentDefinitionVersion, updateDefinitionVersion } from '../states/configuration/actions';
import { clearCustomGoodbyeMessage } from '../states/dualWrite/actions';
import * as GeneralActions from '../states/actions';
import { customChannelTypes } from '../states/DomainConstants';
import * as TransferHelpers from '../transfer/transferTaskState';
import { CustomITask, FeatureFlags, isTwilioTask } from '../types/types';
import { getAseloFeatureFlags, getHrmConfig } from '../hrmConfig';
import { subscribeAlertOnConversationJoined } from '../notifications/newMessage';
import type { RootState } from '../states';
import { getNumberFromTask, getTaskLanguage } from './task';
import selectContactByTaskSid from '../states/contacts/selectContactByTaskSid';
import { newContact } from '../states/contacts/contactState';
import asyncDispatch from '../states/asyncDispatch';
import { createContactAsyncAction, newFinalizeContactAsyncAction } from '../states/contacts/saveContact';
import { handleTransferredTask } from '../transfer/setUpTransferActions';
import { prepopulateForm } from './prepopulateForm';
import { namespace } from '../states/storeNamespaces';
import { recordEvent } from '../fullStory';

type SetupObject = ReturnType<typeof getHrmConfig>;
type GetMessage = (key: string) => (key: string) => Promise<string>;
type ActionPayload = { task: ITask };

export const loadCurrentDefinitionVersion = async () => {
  const { definitionVersion } = getHrmConfig();
  const definitions = await getDefinitionVersion(definitionVersion);
  // populate current version
  Manager.getInstance().store.dispatch(populateCurrentDefinitionVersion(definitions));
  // already populate this to be consumed for data display components
  Manager.getInstance().store.dispatch(updateDefinitionVersion(definitionVersion, definitions));
};

/* eslint-enable sonarjs/prefer-single-boolean-return */
/* eslint-disable sonarjs/cognitive-complexity */

const saveEndMillis = async (payload: ActionPayload) => {
  Manager.getInstance().store.dispatch(Actions.saveEndMillis(payload.task.taskSid));
};

const fromActionFunction = (fun: ActionFunction) => async (payload: ActionPayload, original: ActionFunction) => {
  await fun(payload);
  await original(payload);
};

/**
 * Initializes an empty form (in redux store) for the task within payload
 */
const initializeContactForm = async ({ task }: ActionPayload) => {
  const { currentDefinitionVersion } = (Manager.getInstance().store.getState() as RootState)[namespace].configuration;
  const contact = {
    ...newContact(currentDefinitionVersion, task),
    number: getNumberFromTask(task),
  };
  const { workerSid } = getHrmConfig();

  await asyncDispatch(Manager.getInstance().store.dispatch)(createContactAsyncAction(contact, workerSid, task));
};

const sendMessageOfKey = (messageKey: string) => (
  setupObject: SetupObject,
  conversation: Conversation,
  getMessage: (key: string) => (key: string) => Promise<string>,
): ActionFunction => async (payload: ActionPayload) => {
  const taskLanguage = getTaskLanguage(setupObject)(payload.task);
  const message = await getMessage(messageKey)(taskLanguage);
  const res = await conversation.sendMessage(message);
  console.log(
    `Successfully sent message '${message}' from key ${messageKey} translated to ${taskLanguage}, added as index ${res}`,
  );
};

const sendSystemMessageOfKey = (messageKey: string) => (
  setupObject: SetupObject,
  getMessage: (key: string) => (key: string) => Promise<string>,
) => async (payload: ActionPayload) => {
  const taskLanguage = getTaskLanguage(setupObject)(payload.task);
  const message = await getMessage(messageKey)(taskLanguage);
  await sendSystemMessage({ taskSid: payload.task.taskSid, message, from: 'Bot' });
};

const sendSystemCustomGoodbyeMessage = (customGoodbyeMessage: string) => () => async (payload: ActionPayload) => {
  const { taskSid } = payload.task;
  Manager.getInstance().store.dispatch(clearCustomGoodbyeMessage(taskSid));
  await sendSystemMessage({ taskSid, message: customGoodbyeMessage, from: 'Bot' });
};

const sendWelcomeMessage = sendMessageOfKey('WelcomeMsg');
const sendGoodbyeMessage = (taskSid: string) => {
  const { enable_dual_write: enableDualWrite } = getAseloFeatureFlags();

  const customGoodbyeMessage =
    enableDualWrite &&
    (Manager.getInstance().store.getState() as RootState)['plugin-hrm-form'].dualWrite.tasks[taskSid]
      ?.customGoodbyeMessage;
  return customGoodbyeMessage
    ? sendSystemCustomGoodbyeMessage(customGoodbyeMessage)
    : sendSystemMessageOfKey('GoodbyeMsg');
};

const sendWelcomeMessageOnConversationJoined = async (
  setupObject: SetupObject,
  getMessage: GetMessage,
  payload: ActionPayload,
) => {
  const manager = Manager.getInstance();
  try {
    const trySendWelcomeMessage = async (convo: Conversation, ms: number, retries: number) => {
      setTimeout(async () => {
        try {
          const convoState = manager.store.getState().flex.chat.conversations[convo.sid];
          if (!convoState) {
            console.warn(
              `Conversation ${convo.sid}, which should be for task ${payload.task.taskSid} not found in redux store.`,
            );
            return;
          }
          /* 
              if channel is not ready, wait 200ms and retry
              isLoadingParticipants always resolves last so we want to make sure that it resolved before checking for other conditions 
            */
          if (convoState.isLoadingParticipants) {
            if (retries < 10) await trySendWelcomeMessage(convo, 200, retries + 1);
            if (convoState.isLoadingConversation || convoState.isLoadingMessages) {
              if (retries < 10) await trySendWelcomeMessage(convo, 200, retries + 1);
              else console.error('Failed to send welcome message: max retries reached.');
            }
          } else {
            sendWelcomeMessage(setupObject, convo, getMessage)(payload);
          }
        } catch (error) {
          // We want to try again when the internet connection is terribly poor
          if (retries < 10) {
            await trySendWelcomeMessage(convo, 200, retries + 1);
          } else {
            console.error('Failed to send welcome message: max retries reached due to error.', error);
          }
        }
      }, ms);
    };
    // Ignore event payload as we already have everything we want in afterAcceptTask arguments. Start at 0ms as many users are able to send the message right away
    manager.conversationsClient.once('conversationJoined', async (c: Conversation) => trySendWelcomeMessage(c, 0, 0));
  } catch (error) {
    console.error('Failed to send welcome message:', error);
  }
};

export const afterAcceptTask = (featureFlags: FeatureFlags, setupObject: SetupObject, getMessage: GetMessage) => async (
  payload: ActionPayload,
) => {
  const { task } = payload;
  if (TaskHelper.isChatBasedTask(task)) {
    subscribeAlertOnConversationJoined(task);
  }

  // If this is the first counsellor that gets the task, say hi
  if (TaskHelper.isChatBasedTask(task) && !TransferHelpers.hasTransferStarted(task)) {
    await sendWelcomeMessageOnConversationJoined(setupObject, getMessage, payload);
  }

  await initializeContactForm(payload);
  if (getAseloFeatureFlags().enable_transfers && TransferHelpers.hasTransferStarted(task)) {
    await handleTransferredTask(task);
  } else {
    await prepopulateForm(task);
  }
};

export const hangupCall = fromActionFunction(saveEndMillis);

/**
 * Override for WrapupTask action. Sends a message before leaving (if it should) and saves the end time of the conversation
 */
export const wrapupTask = (setupObject: SetupObject, getMessage: GetMessage) =>
  fromActionFunction(async payload => {
    if (TaskHelper.isChatBasedTask(payload.task)) {
      await sendGoodbyeMessage(payload.task.taskSid)(setupObject, getMessage)(payload);
    }
    await saveEndMillis(payload);
  });

export const recordCallState = ({ task }) => {
  if (isTwilioTask(task) && TaskHelper.isCallTask(task)) {
    recordEvent('[Temporary Debug Event] Call Task State', {
      taskSid: task.taskSid,
      taskStatus: task.status,
      reservationSid: task.sid,
      isCallTask: TaskHelper.isCallTask(task),
      isChatBasedTask: TaskHelper.isChatBasedTask(task),
      taskConferenceExists: Boolean(task.conference),
      taskConferenceSid: task.conference?.conferenceSid,
      taskConferenceLiveParticipantCount: task.conference?.liveParticipantCount,
      taskConferenceLiveWorkerCount: task.conference?.liveWorkerCount,
      taskConferenceAttributes: JSON.stringify(task.attributes.conference),
      taskConversationAttributes: JSON.stringify(task.attributes.conversations),
      taskAllAttributes: JSON.stringify(task.attributes),
    });
  }
};
const decreaseChatCapacity = (featureFlags: FeatureFlags): ActionFunction => async (
  payload: ActionPayload,
): Promise<void> => {
  const { task } = payload;
  if (featureFlags.enable_manual_pulling && task.taskChannelUniqueName === 'chat') await adjustChatCapacity('decrease');
};

export const beforeCompleteTask = (featureFlags: FeatureFlags) => async (payload: ActionPayload): Promise<void> => {
  await decreaseChatCapacity(featureFlags)(payload);
};

const isAseloCustomChannelTask = (task: CustomITask) =>
  (<string[]>Object.values(customChannelTypes)).includes(task.channelType);

/**
 * This function manipulates the default chat orchetrations to allow our implementation of post surveys.
 * Since we rely on the same chat channel as the original contact for it, we don't want it to be "deactivated" by Flex.
 * Hence this function modifies the following orchestration events:
 * - task wrapup: removes DeactivateConversation
 * - task completed: removes DeactivateConversation
 */
export const excludeDeactivateConversationOrchestration = (featureFlags: FeatureFlags) => {
  // TODO: remove conditions once all accounts are updated, since we want this code to be executed in all Flex instances once CHI-2202 is implemented and in place
  if (featureFlags.backend_handled_chat_janitor || featureFlags.enable_post_survey) {
    const setExcludedDeactivateConversation = (event: keyof ChatOrchestrationsEvents) => {
      const excludeDeactivateConversation = (orchestrations: ChatOrchestratorEvent[]) =>
        orchestrations.filter(e => e !== ChatOrchestratorEvent.DeactivateConversation);

      const defaultOrchestrations = ChatOrchestrator.getOrchestrations(event);

      if (Array.isArray(defaultOrchestrations)) {
        ChatOrchestrator.setOrchestrations(event, task => {
          return isAseloCustomChannelTask(task as ITask)
            ? defaultOrchestrations
            : excludeDeactivateConversation(defaultOrchestrations);
        });
      }
    };

    setExcludedDeactivateConversation('wrapup');
    setExcludedDeactivateConversation('completed');
  }
};

export const afterCompleteTask = async ({ task }: { task: CustomITask }): Promise<void> => {
  const manager = Manager.getInstance();
  const contactState = selectContactByTaskSid(manager.store.getState() as RootState, task.taskSid);
  if (contactState) {
    const { savedContact } = contactState;
    if (savedContact) {
      manager.store.dispatch(newFinalizeContactAsyncAction(task, savedContact));
    }
    manager.store.dispatch(GeneralActions.removeContactState(task.taskSid, contactState.savedContact.id));
  }
};
