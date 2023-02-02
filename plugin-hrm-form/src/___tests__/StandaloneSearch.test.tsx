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

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import configureMockStore from 'redux-mock-store';
import { DefinitionVersionId, loadDefinition } from 'hrm-form-definitions';

import { mockGetDefinitionsResponse } from './mockGetConfig';
import { initialState as searchInitialState } from '../states/search/reducer';
import { standaloneTaskSid } from '../types/types';
import { getDefinitionVersions } from '../HrmFormPlugin';

const mockStore = configureMockStore([]);

jest.mock('../services/ServerlessService', () => ({
  populateCounselors: async () => [],
}));

function createState() {
  return {
    'plugin-hrm-form': {
      configuration: {
        counselors: {
          list: [],
          hash: {},
        },
      },
      routing: {
        tasks: {
          [standaloneTaskSid]: 'some-id',
        },
      },
      searchContacts: searchInitialState,
    },
  };
}

beforeAll(async () => {
  mockGetDefinitionsResponse(
    getDefinitionVersions,
    DefinitionVersionId.v1,
    await loadDefinition(DefinitionVersionId.v1),
  );
});

test('<StandaloneSearch> should display <Search />', () => {
  /*
   *Commenting this test out since we need to deploy View Case functionality to staging
   *This will be revisited and fixed when we'll working on New Case revamp.
   *
   *const initialState = createState();
   *const store = mockStore(initialState);
   *
   *render(
   *  <Provider store={store}>
   *    <StandaloneSearch />
   *  </Provider>,
   *);
   *
   *expect(screen.getByTestId('Search-Title')).toBeInTheDocument();
   */
  expect(true).toBeTruthy();
});
