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

import { CaseActionType, CaseState, CaseStateEntry, SET_CONNECTED_CASE } from './types';
import { REMOVE_CONTACT_STATE, RemoveContactStateAction } from '../types';
import {
  CaseWorkingCopyActionType,
  INIT_EXISTING_CASE_SECTION_WORKING_COPY,
  INIT_NEW_CASE_SECTION_WORKING_COPY,
  INIT_CASE_SUMMARY_WORKING_COPY,
  initialiseCaseSectionWorkingCopyReducer,
  initialiseNewCaseSectionWorkingCopyReducer,
  initialiseCaseSummaryWorkingCopyReducer,
  REMOVE_CASE_SECTION_WORKING_COPY,
  REMOVE_CASE_SUMMARY_WORKING_COPY,
  removeCaseSectionWorkingCopyReducer,
  removeCaseSummaryWorkingCopyReducer,
  UPDATE_CASE_SECTION_WORKING_COPY,
  UPDATE_CASE_SUMMARY_WORKING_COPY,
  updateCaseSectionWorkingCopyReducer,
  updateCaseSummaryWorkingCopyReducer,
} from './caseWorkingCopy';
import { HrmState, RootState } from '..';
import { getAvailableCaseStatusTransitions } from './caseStatus';
import { saveCaseReducer } from './saveCase';
import { CaseListContentStateAction } from '../caseList/listContent';
import { configurationBase, namespace } from '../storeNamespaces';
import {
  ContactUpdatingAction,
  CREATE_CONTACT_ACTION_FULFILLED,
  LOAD_CONTACT_FROM_HRM_BY_TASK_ID_ACTION_FULFILLED,
} from '../contacts/types';

const initialState: CaseState = {
  tasks: {},
  cases: {},
};

const boundSaveCaseReducer = saveCaseReducer({} as RootState['plugin-hrm-form']);

const contactUpdatingReducer = (
  state: CaseState,
  { configuration }: RootState[typeof namespace],
  action: ContactUpdatingAction,
): CaseState => {
  if (
    action.type === CREATE_CONTACT_ACTION_FULFILLED ||
    action.type === LOAD_CONTACT_FROM_HRM_BY_TASK_ID_ACTION_FULFILLED
  ) {
    const { contact, contactCase } = action.payload;
    if (contactCase) {
      const caseDefinitionVersion = configuration.definitionVersions[contactCase.info.definitionVersion];
      const references = state.cases[contactCase.id]?.references ?? new Set<string>();
      references.add(`contact-${contact.id}`);
      return {
        ...state,
        cases: {
          ...state.cases,
          [contactCase.id]: {
            connectedCase: contactCase,
            caseWorkingCopy: { sections: {} },
            availableStatusTransitions: caseDefinitionVersion
              ? getAvailableCaseStatusTransitions(contactCase, caseDefinitionVersion)
              : [],
            references,
          },
        },
      };
    }
  }
  return state;
};

// eslint-disable-next-line import/no-unused-modules
export function reduce(
  inputRootState: HrmState,
  inputState = initialState,
  action:
    | CaseActionType
    | CaseWorkingCopyActionType
    | RemoveContactStateAction
    | CaseListContentStateAction
    | ContactUpdatingAction,
): CaseState {
  const rootState = boundSaveCaseReducer(inputRootState, action as any);
  const state = rootState.connectedCase;
  switch (action.type) {
    case CREATE_CONTACT_ACTION_FULFILLED:
    case LOAD_CONTACT_FROM_HRM_BY_TASK_ID_ACTION_FULFILLED:
      return contactUpdatingReducer(state, rootState, action);
    case SET_CONNECTED_CASE:
      const caseDefinitionVersion =
        rootState[configurationBase].definitionVersions[action.connectedCase?.info?.definitionVersion];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            connectedCase: action.connectedCase,
            caseWorkingCopy: { sections: {} },
            availableStatusTransitions: caseDefinitionVersion
              ? getAvailableCaseStatusTransitions(action.connectedCase, caseDefinitionVersion)
              : [],
          },
        },
      };
    case REMOVE_CONTACT_STATE: {
      const dereferencedCaseEntries = Object.entries(state.cases).map(([caseId, caseEntry]): [
        string,
        CaseStateEntry,
      ] => {
        const references = new Set(caseEntry.references);
        references.delete(`contact-${action.contactId}`);
        return [caseId, { ...caseEntry, references }];
      });
      return {
        ...state,
        cases: Object.fromEntries(
          dereferencedCaseEntries.filter(([, dereferencedCaseEntries]) => dereferencedCaseEntries.references.size),
        ),
      };
    }
    case UPDATE_CASE_SECTION_WORKING_COPY:
      return updateCaseSectionWorkingCopyReducer(state, rootState.configuration, action);
    case INIT_EXISTING_CASE_SECTION_WORKING_COPY:
      return initialiseCaseSectionWorkingCopyReducer(state, action);
    case INIT_NEW_CASE_SECTION_WORKING_COPY:
      return initialiseNewCaseSectionWorkingCopyReducer(state, action);
    case REMOVE_CASE_SECTION_WORKING_COPY:
      return removeCaseSectionWorkingCopyReducer(state, action);
    case INIT_CASE_SUMMARY_WORKING_COPY:
      return initialiseCaseSummaryWorkingCopyReducer(state, action);
    case UPDATE_CASE_SUMMARY_WORKING_COPY:
      return updateCaseSummaryWorkingCopyReducer(state, action);
    case REMOVE_CASE_SUMMARY_WORKING_COPY:
      return removeCaseSummaryWorkingCopyReducer(state, action);
    default:
      return state;
  }
}
