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

import {
  ActionFunction,
  ChatOrchestrator,
  ChatOrchestratorEvent,
  ITask,
  Manager,
  StateHelper,
  TaskHelper,
} from '@twilio/flex-ui';
import { Conversation } from '@twilio/conversations';
import type { ChatOrchestrationsEvents } from '@twilio/flex-ui/src/ChatOrchestrator';

import { adjustChatCapacity, getDefinitionVersion, sendSystemMessage } from '../services/ServerlessService';
import * as Actions from '../states/contacts/actions';
import { populateCurrentDefinitionVersion, updateDefinitionVersion } from '../states/configuration/actions';
import { clearCustomGoodbyeMessage } from '../states/dualWrite/actions';
import * as GeneralActions from '../states/actions';
import { customChannelTypes } from '../states/DomainConstants';
import * as TransferHelpers from './transfer';
import { CustomITask, FeatureFlags } from '../types/types';
import { getAseloFeatureFlags, getHrmConfig } from '../hrmConfig';
import { subscribeAlertOnConversationJoined } from '../notifications/newMessage';
import type { RootState } from '../states';
import { getTaskLanguage } from './task';
import findContactByTaskSid from '../states/contacts/findContactByTaskSid';
import { newContact } from '../states/contacts/contactState';
import asyncDispatch from '../states/asyncDispatch';
import { createContactAsyncAction } from '../states/contacts/saveContact';

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
export const initializeContactForm = async ({ task }: ActionPayload) => {
  const { currentDefinitionVersion } = (Manager.getInstance().store.getState() as RootState)[
    'plugin-hrm-form'
  ].configuration;
  const contact = newContact(currentDefinitionVersion, task);
  const { workerSid } = getHrmConfig();
  const taskSid = task.attributes?.transferMeta?.originalTask ?? task.taskSid;
  await asyncDispatch(Manager.getInstance().store.dispatch)(createContactAsyncAction(contact, workerSid, taskSid));
};

const sendMessageOfKey = (messageKey: string) => (
  setupObject: SetupObject,
  conversation: Conversation,
  getMessage: (key: string) => (key: string) => Promise<string>,
): ActionFunction => async (payload: ActionPayload) => {
  const taskLanguage = getTaskLanguage(setupObject)(payload.task);
  const message = await getMessage(messageKey)(taskLanguage);
  await conversation.sendMessage(message);
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

const sendWelcomeMessageOnConversationJoined = (
  setupObject: SetupObject,
  getMessage: GetMessage,
  payload: ActionPayload,
) => {
  const manager = Manager.getInstance();
  const { task } = payload;
  const trySendWelcomeMessage = (convo: Conversation, ms: number, retries: number) => {
    setTimeout(() => {
      const convoState = StateHelper.getConversationStateForTask(task);
      // if channel is not ready, wait 200ms and retry
      if (convoState.isLoadingConversation) {
        if (retries < 10) trySendWelcomeMessage(convo, 200, retries + 1);
        else console.error('Failed to send welcome message: max retries reached.');
      } else {
        sendWelcomeMessage(setupObject, convo, getMessage)(payload);
      }
    }, ms);
  };

  // Ignore event payload as we already have everything we want in afterAcceptTask arguments. Start at 0ms as many users are able to send the message right away
  manager.conversationsClient.once('conversationJoined', (c: Conversation) => trySendWelcomeMessage(c, 0, 0));
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
    sendWelcomeMessageOnConversationJoined(setupObject, getMessage, payload);
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
          return isAseloCustomChannelTask(task)
            ? defaultOrchestrations
            : excludeDeactivateConversation(defaultOrchestrations);
        });
      }
    };

    setExcludedDeactivateConversation('wrapup');
    setExcludedDeactivateConversation('completed');
  }
};

export const afterCompleteTask = (payload: ActionPayload): void => {
  const manager = Manager.getInstance();
  const contactState = findContactByTaskSid(manager.store.getState() as RootState, payload.task.taskSid);
  if (contactState) {
    manager.store.dispatch(GeneralActions.removeContactState(payload.task.taskSid, contactState.savedContact.id));
  }
};
