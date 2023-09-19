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

/* eslint-disable import/no-unused-modules */
import { Dispatch } from 'redux';
import { ITask } from '@twilio/flex-ui';
import { endOfDay, formatISO, startOfDay } from 'date-fns';

import * as t from './types';
import { ConfigurationState } from '../configuration/reducer';
import { SearchAPIContact } from '../../types/types';
import { searchContacts as searchContactsApiCall } from '../../services/ContactService';
import { searchCases as searchCasesApiCall } from '../../services/CaseService';
import { searchAPIContactToSearchUIContact } from './helpers';
import { updateDefinitionVersion } from '../configuration/actions';
import { getContactsMissingVersions, getCasesMissingVersions } from '../../utils/definitionVersions';
import { getNumberFromTask } from '../../utils';
import { SearchParams } from './types';

// Action creators
export const handleSearchFormChange = (taskId: string) => <K extends keyof t.SearchFormValues>(
  name: K,
  value: t.SearchFormValues[K],
): t.SearchActionType => {
  return {
    type: t.HANDLE_SEARCH_FORM_CHANGE,
    name,
    value,
    taskId,
  } as t.SearchActionType; // casting cause inference is not providing enough information, but the restrictions are made in argument types
};

export const searchContacts = (dispatch: Dispatch<any>) => (taskId: string) => async (
  searchParams: SearchParams,
  counselorsHash: ConfigurationState['counselors']['hash'],
  limit: number,
  offset: number,
  dispatchedFromPreviousContacts?: boolean,
) => {
  try {
    dispatch({ type: t.SEARCH_CONTACTS_REQUEST, taskId });

    const searchResultRaw = await searchContactsApiCall(searchParams, limit, offset);
    const contactsWithCounselorName = searchAPIContactToSearchUIContact(counselorsHash, searchResultRaw.contacts);
    const searchResult = { ...searchResultRaw, contacts: contactsWithCounselorName };

    const definitions = await getContactsMissingVersions(searchResultRaw.contacts);
    definitions.forEach(d => dispatch(updateDefinitionVersion(d.version, d.definition)));

    dispatch({ type: t.SEARCH_CONTACTS_SUCCESS, searchResult, taskId, dispatchedFromPreviousContacts });
  } catch (error) {
    dispatch({ type: t.SEARCH_CONTACTS_FAILURE, error, taskId, dispatchedFromPreviousContacts });
  }
};

export const searchCases = (dispatch: Dispatch<any>) => (taskId: string) => async (
  searchParams: any,
  counselorsHash: ConfigurationState['counselors']['hash'],
  limit: number,
  offset: number,
  dispatchedFromPreviousContacts?: boolean,
) => {
  try {
    dispatch({ type: t.SEARCH_CASES_REQUEST, taskId });

    const { dateFrom, dateTo, ...rest } = searchParams || {};

    // Adapt dateFrom and dateTo to what is expected in the search endpoint
    const searchCasesPayload = {
      ...rest,
      filters: {
        createdAt: {
          from: dateFrom ? formatISO(startOfDay(new Date(dateFrom))) : undefined,
          to: dateTo ? formatISO(endOfDay(new Date(dateTo))) : undefined,
        },
      },
    };

    const searchResult = await searchCasesApiCall(searchCasesPayload, limit, offset);

    const definitions = await getCasesMissingVersions(searchResult.cases);
    definitions.forEach(d => dispatch(updateDefinitionVersion(d.version, d.definition)));

    dispatch({ type: t.SEARCH_CASES_SUCCESS, searchResult, taskId, dispatchedFromPreviousContacts });
  } catch (error) {
    dispatch({ type: t.SEARCH_CASES_FAILURE, error, taskId });
  }
};

export const viewPreviousContacts = (dispatch: Dispatch<any>) => (task: ITask) => () => {
  const contactNumber = getNumberFromTask(task);
  const taskId = task.taskSid;

  dispatch({ type: t.VIEW_PREVIOUS_CONTACTS, taskId, contactNumber });
};

export const changeSearchPage = (taskId: string) => (page: t.SearchPagesType): t.SearchActionType => ({
  type: t.CHANGE_SEARCH_PAGE,
  page,
  taskId,
});

export const viewContactDetails = (taskId: string) => (contact: SearchAPIContact): t.SearchActionType => ({
  type: t.VIEW_CONTACT_DETAILS,
  contact,
  taskId,
});
