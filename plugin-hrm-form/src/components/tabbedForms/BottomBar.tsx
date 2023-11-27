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
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Template } from '@twilio/flex-ui';
import { CircularProgress } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/CreateNewFolderOutlined';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { DefinitionVersionId } from 'hrm-form-definitions';

import {
  Box,
  BottomButtonBar,
  StyledNextStepButton,
  AddedToCaseButton,
  SaveAndEndContactButton,
} from '../../styles/HrmStyles';
import * as RoutingActions from '../../states/routing/actions';
import { completeTask } from '../../services/formSubmissionHelpers';
import { hasTaskControl } from '../../utils/transfer';
import { RootState } from '../../states';
import { isNonDataCallType } from '../../states/validationRules';
import { recordBackendError } from '../../fullStory';
import { Case, CustomITask, Contact } from '../../types/types';
import { getAseloFeatureFlags, getHrmConfig, getTemplateStrings } from '../../hrmConfig';
import { createCaseAsyncAction } from '../../states/case/saveCase';
import { getUnsavedContact } from '../../states/contacts/getUnsavedContact';
import { submitContactFormAsyncAction } from '../../states/contacts/saveContact';
import { ContactMetadata } from '../../states/contacts/types';
import { connectedCaseBase, contactFormsBase, namespace } from '../../states/storeNamespaces';
import { AppRoutes } from '../../states/routing/types';
import AddNewCaseDropdown from './AddNewCaseDropdown';
import asyncDispatch from '../../states/asyncDispatch';

type BottomBarProps = {
  handleSubmitIfValid: (handleSubmit: () => Promise<void>) => () => void;
  optionalButtons?: { onClick: () => void; label: string }[];
  showNextButton: boolean;
  showSubmitButton: boolean;
  nextTab: () => void;
  task: CustomITask;
  contactId: string;
  saveUpdates: () => Promise<void>;
};

const BottomBar: React.FC<
  BottomBarProps & ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>
> = ({
  showNextButton,
  showSubmitButton,
  handleSubmitIfValid,
  optionalButtons,
  contact,
  metadata,
  task,
  openModal,
  nextTab,
  caseForm,
  createCaseAsyncAction,
  submitContactFormAsyncAction,
  saveUpdates,
  savedContact,
}) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const strings = getTemplateStrings();

  const handleDropdown = () => {
    setDropdown(previous => !previous);
  };

  const isAddedToCase = savedContact?.caseId !== null;

  const handleOpenNewCase = async () => {
    const { workerSid, definitionVersion } = getHrmConfig();

    if (!hasTaskControl(task)) return;

    try {
      await saveUpdates();
      await createCaseAsyncAction(contact, workerSid, definitionVersion);
      openModal({ route: 'case', subroute: 'home', isCreating: true });
    } catch (error) {
      recordBackendError('Open New Case', error);
      window.alert(strings['Error-Backend']);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || !hasTaskControl(task)) return;

    setSubmitting(true);

    try {
      await submitContactFormAsyncAction(task, contact, metadata, caseForm as Case);
      await completeTask(task, contact);
    } catch (error) {
      if (window.confirm(strings['Error-ContinueWithoutRecording'])) {
        recordBackendError('Submit Contact Form TASK COMPLETED WITHOUT RECORDING', error);
        await completeTask(task, contact);
      } else {
        recordBackendError('Submit Contact Form', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const showBottomBar = showNextButton || showSubmitButton;
  const featureFlags = getAseloFeatureFlags();

  if (!showBottomBar) return null;

  const openSearchModal = () => {
    openModal({ route: 'search', subroute: 'form', action: 'select-case' });
  };

  return (
    <>
      <BottomButtonBar
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropdown(false);
          }
        }}
      >
        {optionalButtons &&
          optionalButtons.map((i, index) => (
            <Box key={`optional-button-${index}`} marginRight="15px">
              <StyledNextStepButton
                type="button"
                roundCorners
                secondary="true"
                onClick={i.onClick}
                disabled={isSubmitting}
              >
                <Template code={i.label} />
              </StyledNextStepButton>
            </Box>
          ))}

        {showNextButton && (
          <StyledNextStepButton type="button" roundCorners={true} onClick={nextTab}>
            <Template code="BottomBar-Next" />
          </StyledNextStepButton>
        )}
        {showSubmitButton && (
          <>
            {featureFlags.enable_case_management && (
              <AddNewCaseDropdown
                handleNewCaseType={handleOpenNewCase}
                handleExistingCaseType={openSearchModal}
                dropdown={dropdown}
              />
            )}
            {isAddedToCase
              ? featureFlags.enable_case_management && (
                  <Box marginRight="25px">
                    <AddedToCaseButton>
                      <Template code="BottomBar-AddedToCase" />
                    </AddedToCaseButton>
                  </Box>
                )
              : featureFlags.enable_case_management &&
                !isNonDataCallType(contact.rawJson.callType) && (
                  <Box marginRight="15px">
                    <StyledNextStepButton
                      type="button"
                      roundCorners
                      secondary="true"
                      onClick={handleDropdown}
                      data-fs-id="Contact-SaveAndAddToCase-Button"
                      data-testid="BottomBar-SaveAndAddToCase-Button"
                    >
                      <FolderIcon style={{ fontSize: '16px', marginRight: '10px', width: '24px', height: '24px' }} />
                      <Template code="BottomBar-AddContactToNewCase" />
                      {dropdown && (
                        <KeyboardArrowUpIcon
                          style={{ fontSize: '20px', marginLeft: '10px', width: '24px', height: '24px' }}
                        />
                      )}
                      {!dropdown && (
                        <KeyboardArrowDownIcon
                          style={{ fontSize: '20px', marginLeft: '10px', width: '24px', height: '24px' }}
                        />
                      )}
                    </StyledNextStepButton>
                  </Box>
                )}
            <SaveAndEndContactButton
              roundCorners={true}
              onClick={handleSubmitIfValid(handleSubmit)}
              disabled={isSubmitting}
              data-fs-id="Contact-SaveContact-Button"
              data-testid="BottomBar-SaveContact-Button"
            >
              <span style={{ visibility: isSubmitting ? 'hidden' : 'inherit' }}>
                <Template code="BottomBar-SaveAndEnd" />
              </span>
              {isSubmitting ? <CircularProgress size={12} style={{ position: 'absolute' }} /> : null}
            </SaveAndEndContactButton>
          </>
        )}
      </BottomButtonBar>
    </>
  );
};

BottomBar.displayName = 'BottomBar';

const mapStateToProps = (state: RootState, ownProps: BottomBarProps) => {
  const { draftContact, savedContact, metadata } =
    state[namespace][contactFormsBase].existingContacts[ownProps.contactId] ?? {};
  const caseForm = state[namespace][connectedCaseBase].tasks[ownProps.task.taskSid]?.connectedCase || {};
  return {
    contact: getUnsavedContact(savedContact, draftContact),
    metadata,
    caseForm,
    savedContact,
  };
};

const mapDispatchToProps = (dispatch, { task }: BottomBarProps) => {
  return {
    changeRoute: (route: AppRoutes) => dispatch(RoutingActions.changeRoute(route, task.taskSid)),
    openModal: (route: AppRoutes) => dispatch(RoutingActions.newOpenModalAction(route, task.taskSid)),
    createCaseAsyncAction: async (contact, workerSid: string, definitionVersion: DefinitionVersionId) => {
      // Deliberately using dispatch rather than asyncDispatch here, because we still handle the error from where the action is dispatched.
      // TODO: Rework error handling to be based on redux state set by the _REJECTED action
      await asyncDispatch(dispatch)(createCaseAsyncAction(contact, task.taskSid, workerSid, definitionVersion));
    },
    submitContactFormAsyncAction: (task: CustomITask, contact: Contact, metadata: ContactMetadata, caseForm: Case) =>
      // Deliberately using dispatch rather than asyncDispatch here, because we still handle the error from where the action is dispatched.
      // TODO: Rework error handling to be based on redux state set by the _REJECTED action
      dispatch(submitContactFormAsyncAction(task, contact, metadata, caseForm)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
