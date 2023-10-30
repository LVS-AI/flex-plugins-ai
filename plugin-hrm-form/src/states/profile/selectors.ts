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

import { RootState } from '..';
import { namespace, profileBase } from '../storeNamespaces';
import * as t from './types';

export const selectProfileById = (state: RootState, profileId: t.Profile['id']) =>
  state[namespace][profileBase].profiles[profileId];

export const selectProfilePropertyById = <T extends keyof t.Profile>(
  state: RootState,
  profileId: t.Profile['id'],
  property: T,
): t.Profile[T] | undefined => selectProfileById(state, profileId)?.data?.[property];

export const selectIdentifierByIdentifier = (state: RootState, identifier: t.Identifier['identifier']) =>
  Object.values(state[namespace][profileBase].identifiers).find(entry => entry.data?.identifier === identifier);

export const selectAllProfileFlags = (state: RootState) => state[namespace][profileBase].profileFlags;
