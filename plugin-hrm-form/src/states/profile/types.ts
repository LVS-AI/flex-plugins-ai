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

import { Case, Contact, Identifier, Profile, ProfileFlag } from '../../types/types';
import { getProfileContacts, getProfileCases } from '../../services/ProfileService';
import { ParseFetchErrorResult } from '../parseFetchError';

export type { Case, Contact, Identifier, Profile, ProfileFlag };

// Action types
export const ADD_PROFILE_STATE = 'ADD_PROFILE_STATE';
export const INCREMENT_PAGE = 'INCREMENT_PAGE';
export const LOAD_IDENTIFIER_BY_IDENTIFIER = 'LOAD_IDENTIFIER_BY_IDENTIFIER';
export const LOAD_PROFILE = 'LOAD_PROFILE';
export const LOAD_PROFILE_FLAGS = 'LOAD_PROFILE_FLAGS';
export const LOAD_RELATIONSHIP = 'LOAD_RELATIONSHIP';

export const PROFILE_RELATIONSHIPS = {
  cases: {
    method: getProfileCases,
  },
  contacts: {
    method: getProfileContacts,
  },
} as const;

export type ProfileRelationships = keyof typeof PROFILE_RELATIONSHIPS;
export type ProfileRelationshipTypes = Case | Contact;

export type ProfileEntry = {
  cases?: {
    data?: Case[];
    errors?: ParseFetchErrorResult;
    exhausted: boolean;
    loading: boolean;
    page: number;
    loadedPage?: number;
  };
  contacts?: {
    data?: Contact[];
    error?: ParseFetchErrorResult;
    exhausted: boolean;
    loading: boolean;
    page: number;
    loadedPage?: number;
  };
  data?: Profile;
  error?: ParseFetchErrorResult;
  loading: boolean;
};

export type IdentifierEntry = {
  data?: Identifier;
  error?: ParseFetchErrorResult;
  loading: boolean;
};

export type ProfileFlagsState = {
  data?: ProfileFlag[];
  error?: ParseFetchErrorResult;
  loading: boolean;
};

export type ProfileState = {
  identifiers: {
    [identifierId: Identifier['id']]: IdentifierEntry;
  };
  profiles: {
    [profileId: Profile['id']]: ProfileEntry;
  };
  profileFlags: ProfileFlagsState;
};

type AddProfileState = { type: typeof ADD_PROFILE_STATE; profileId: Profile['id']; profile?: Profile };

export type ProfileActions = AddProfileState;

export const newProfileEntry: ProfileEntry = {
  error: undefined,
  loading: false,
  data: undefined,
  contacts: {
    exhausted: false,
    loading: false,
    page: 0,
  },
  cases: {
    exhausted: false,
    loading: false,
    page: 0,
  },
};

export const newIdentifierEntry: IdentifierEntry = {
  error: undefined,
  loading: false,
  data: undefined,
};

export const initialState: ProfileState = {
  identifiers: {},
  profiles: {},
  profileFlags: {
    loading: false,
  },
};
