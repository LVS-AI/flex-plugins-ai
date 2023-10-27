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

import * as t from './types';
import { loadIdentifierReducer, shouldUseLoadIdentifierReducer } from './loadIdentifier';
import { loadProfileReducer, shouldUseLoadProfileReducer } from './loadProfile';
import { profileFlagsReducer, shouldUseProfileFlagsReducer } from './profileFlags';
import { loadRelationshipsReducer, shouldUseLoadRelationshipsReducer } from './loadRelationships';

const reducers = [
  {
    shouldUseReducer: shouldUseLoadIdentifierReducer,
    reducer: loadIdentifierReducer,
  },
  {
    shouldUseReducer: shouldUseLoadProfileReducer,
    reducer: loadProfileReducer,
  },
  {
    shouldUseReducer: shouldUseProfileFlagsReducer,
    reducer: profileFlagsReducer,
  },
  {
    shouldUseReducer: shouldUseLoadRelationshipsReducer,
    reducer: loadRelationshipsReducer,
  },
];

export function reduce(state = t.initialState, action: t.ProfileActions): t.ProfileState {
  const reducer = reducers.find(r => r.shouldUseReducer(action));
  if (reducer) {
    return reducer.reducer(t.initialState)(state, action);
  }

  return state;
}
