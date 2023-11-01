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

/* eslint-disable react/prop-types */
import React, { Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ITask, withTaskContext } from '@twilio/flex-ui';
import { DefinitionVersion } from 'hrm-form-definitions';

import TaskView from './TaskView';
import { Absolute } from '../styles/HrmStyles';
import { populateCounselors } from '../services/ServerlessService';
import { populateCounselorsState } from '../states/configuration/actions';
import { RootState } from '../states';
import { OfflineContactTask } from '../types/types';
import getOfflineContactTaskSid from '../states/contacts/offlineContactTaskSid';
import { namespace } from '../states/storeNamespaces';
import asyncDispatch from '../states/asyncDispatch';
import { createContactAsyncAction } from '../states/contacts/saveContact';
import { getHrmConfig } from '../hrmConfig';
import { newContact } from '../states/contacts/contactState';

type OwnProps = {
  task?: ITask;
};

// eslint-disable-next-line no-use-before-define
type Props = OwnProps & ConnectedProps<typeof connector>;

const CustomCRMContainer: React.FC<Props> = ({
  selectedTaskSid,
  isAddingOfflineContact,
  task,
  populateCounselorList,
  currentOfflineContact,
  definitionVersion,
  loadOrCreateDraftOfflineContact,
}) => {
  useEffect(() => {
    const fetchPopulateCounselors = async () => {
      try {
        const counselorsList = await populateCounselors();
        populateCounselorList(counselorsList);
      } catch (err) {
        // TODO (Gian): probably we need to handle this in a nicer way
        console.error(err.message);
      }
    };

    fetchPopulateCounselors();
  }, [populateCounselorList]);

  useEffect(() => {
    if (!currentOfflineContact && definitionVersion) {
      loadOrCreateDraftOfflineContact(definitionVersion);
    }
  }, [currentOfflineContact, definitionVersion, loadOrCreateDraftOfflineContact]);

  const offlineContactTask: OfflineContactTask = {
    taskSid: getOfflineContactTaskSid(),
    channelType: 'default',
    attributes: { isContactlessTask: true, channelType: 'default' },
  };

  const renderITask = selectedTaskSid && task;
  const renderOfflineContactTask = !selectedTaskSid && isAddingOfflineContact;

  return (
    <Absolute top="0" bottom="0" left="0" right="0">
      {renderITask && <TaskView task={task} key={`controller-${selectedTaskSid}`} />}
      {renderOfflineContactTask && (
        <TaskView task={offlineContactTask} key={`controller-${getOfflineContactTaskSid()}`} />
      )}
    </Absolute>
  );
};

CustomCRMContainer.displayName = 'CustomCRMContainer';

const mapStateToProps = ({ [namespace]: { routing, activeContacts, configuration }, flex }: RootState) => {
  const { selectedTaskSid } = flex.view;
  const { isAddingOfflineContact } = routing;
  const currentOfflineContact = Object.values(activeContacts.existingContacts).find(
    contact => contact.savedContact.taskId === getOfflineContactTaskSid(),
  );

  return {
    selectedTaskSid,
    isAddingOfflineContact,
    currentOfflineContact,
    definitionVersion: configuration.currentDefinitionVersion,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    loadOrCreateDraftOfflineContact: (definition: DefinitionVersion) =>
      asyncDispatch(dispatch)(
        createContactAsyncAction(newContact(definition), getHrmConfig().workerSid, getOfflineContactTaskSid()),
      ),
    populateCounselorList: (listPayload: Awaited<ReturnType<typeof populateCounselors>>) =>
      dispatch(populateCounselorsState(listPayload)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default withTaskContext(connector(CustomCRMContainer));
