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

import { omit } from 'lodash';

import * as t from './types';
import { SearchResultReferences } from './types';
import { REMOVE_CONTACT_STATE, RemoveContactStateAction } from '../types';
import { Contact, SearchCaseResult, standaloneTaskSid } from '../../types/types';
import { ContactDetailsSections, ContactDetailsSectionsType } from '../../components/common/ContactDetails';
import {
  CONNECT_TO_CASE_ACTION_FULFILLED,
  ContactConnectingAction,
  ContactUpdatingAction,
  CREATE_CONTACT_ACTION_FULFILLED,
  LOAD_CONTACT_FROM_HRM_BY_TASK_ID_ACTION_FULFILLED,
  UPDATE_CONTACT_ACTION_FULFILLED,
} from '../contacts/types';
import { CaseUpdatingAction, CREATE_CASE_ACTION_FULFILLED, UPDATE_CASE_ACTION_FULFILLED } from '../case/types';

type PreviousContacts = {
  contacts?: t.DetailedSearchContactsResult;
  cases?: SearchCaseResult;
};

type TaskEntry = {
  form: t.SearchFormValues;
  detailsExpanded: {
    [key in ContactDetailsSectionsType]: boolean;
  };
  searchContactsResult: t.DetailedSearchContactsResult;
  searchCasesResult: SearchResultReferences;
  previousContacts?: PreviousContacts;
  isRequesting: boolean;
  isRequestingCases: boolean;
  error: any;
  casesError: any;
  caseRefreshRequired: boolean;
  contactRefreshRequired: boolean;
  searchExistingCaseStatus: boolean;
};

type SearchState = {
  tasks: {
    [taskId: string]: TaskEntry;
  };
};

export const newTaskEntry: TaskEntry = {
  form: {
    firstName: '',
    lastName: '',
    counselor: { label: '', value: '' },
    phoneNumber: '',
    dateFrom: '',
    dateTo: '',
    contactNumber: '',
  },
  detailsExpanded: {
    [ContactDetailsSections.GENERAL_DETAILS]: true,
    [ContactDetailsSections.CALLER_INFORMATION]: false,
    [ContactDetailsSections.CHILD_INFORMATION]: false,
    [ContactDetailsSections.ISSUE_CATEGORIZATION]: false,
    [ContactDetailsSections.CONTACT_SUMMARY]: false,
    [ContactDetailsSections.TRANSCRIPT]: false,
    [ContactDetailsSections.EXTERNAL_REPORT]: false,
    [ContactDetailsSections.RECORDING]: false,
  },
  searchContactsResult: { count: 0, contacts: [] },
  searchCasesResult: { count: 0, ids: [] },
  previousContacts: undefined,
  isRequesting: false,
  isRequestingCases: false,
  caseRefreshRequired: false,
  contactRefreshRequired: false,
  error: null,
  casesError: null,
  searchExistingCaseStatus: false,
};

export const initialState: SearchState = {
  tasks: {
    [standaloneTaskSid]: newTaskEntry,
  },
};

const contactUpdatingReducer = (state: SearchState, action: ContactUpdatingAction): SearchState => {
  const { contact, previousContact } = (action as any).payload as { contact: Contact; previousContact?: Contact };
  if (!contact?.taskId) return state;
  let updatedState = state;
  if (previousContact && previousContact.taskId !== contact.taskId) {
    updatedState = {
      ...state,
      tasks: omit(state.tasks, previousContact.taskId),
    };
  }
  if (state.tasks[contact.taskId] && action.type !== CREATE_CONTACT_ACTION_FULFILLED) return updatedState;

  return {
    ...updatedState,
    tasks: {
      ...updatedState.tasks,
      [contact.taskId]: newTaskEntry,
    },
  };
};

// eslint-disable-next-line complexity
export function reduce(
  startingState = initialState,
  action:
    | t.SearchActionType
    | RemoveContactStateAction
    | ContactUpdatingAction
    | ContactConnectingAction
    | CaseUpdatingAction,
): SearchState {
  let state = startingState;
  if ((<string[]>[UPDATE_CONTACT_ACTION_FULFILLED, CREATE_CONTACT_ACTION_FULFILLED]).includes(action.type)) {
    state = {
      ...state,
      tasks: Object.fromEntries(
        Object.entries(state.tasks).map(([key, value]) => [key, { ...value, contactRefreshRequired: true }]),
      ),
    };
  }
  if (
    (<string[]>[CONNECT_TO_CASE_ACTION_FULFILLED, UPDATE_CASE_ACTION_FULFILLED, CREATE_CASE_ACTION_FULFILLED]).includes(
      action.type,
    )
  ) {
    state = {
      ...state,
      tasks: Object.fromEntries(
        Object.entries(state.tasks).map(([key, value]) => [key, { ...value, caseRefreshRequired: true }]),
      ),
    };
  }
  switch (action.type) {
    case CREATE_CONTACT_ACTION_FULFILLED:
    case LOAD_CONTACT_FROM_HRM_BY_TASK_ID_ACTION_FULFILLED:
    case UPDATE_CONTACT_ACTION_FULFILLED: {
      return contactUpdatingReducer(state, action as ContactUpdatingAction);
    }
    case REMOVE_CONTACT_STATE:
      return {
        ...state,
        tasks: omit(state.tasks, action.taskId),
      };
    case t.HANDLE_SEARCH_FORM_CHANGE: {
      const task = state.tasks[action.taskId];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: { ...task, form: { ...task.form, [action.name]: action.value } },
        },
      };
    }
    case t.SEARCH_CONTACTS_REQUEST: {
      const task = state.tasks[action.taskId];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...task,
            isRequesting: true,
            contactRefreshRequired: false,
          },
        },
      };
    }
    case t.SEARCH_CONTACTS_SUCCESS: {
      const task = state.tasks[action.taskId];
      const previousContacts = action.dispatchedFromPreviousContacts
        ? { ...task.previousContacts, contacts: action.searchResult }
        : task.previousContacts;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...task,
            searchContactsResult: action.searchResult,
            previousContacts,
            isRequesting: false,
            error: null,
          },
        },
      };
    }
    case t.SEARCH_CONTACTS_FAILURE: {
      const task = state.tasks[action.taskId];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...task,
            isRequesting: false,
            error: action.error,
          },
        },
      };
    }
    case t.SEARCH_CASES_REQUEST: {
      const task = state.tasks[action.taskId];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...task,
            isRequestingCases: true,
            caseRefreshRequired: false,
          },
        },
      };
    }
    case t.SEARCH_CASES_SUCCESS: {
      const task = state.tasks[action.taskId];
      const previousContacts = action.dispatchedFromPreviousContacts
        ? { ...task.previousContacts, cases: action.searchResult }
        : task.previousContacts;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...task,
            searchCasesResult: {
              ...action.searchResult,
              ids: action.searchResult.cases.map(c => c.id),
            },
            previousContacts,
            isRequestingCases: false,
            casesError: null,
          },
        },
      };
    }
    case t.SEARCH_CASES_FAILURE: {
      const task = state.tasks[action.taskId];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...task,
            isRequestingCases: false,
            casesError: action.error,
          },
        },
      };
    }
    case t.VIEW_PREVIOUS_CONTACTS: {
      const task = state.tasks[action.taskId];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...task,
            form: {
              ...task.form,
              contactNumber: action.contactNumber,
            },
          },
        },
      };
    }
    default:
      return state;
  }
}
