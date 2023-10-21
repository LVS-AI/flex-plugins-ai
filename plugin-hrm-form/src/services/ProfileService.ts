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

import { fetchHrmApi } from './fetchHrmApi';

export const getProfileByIdentifier = (identifier: string) => fetchHrmApi(`/profiles/identifier/${identifier}`);

const getProfileById = (id: string) => fetchHrmApi(`/profiles/${id}`);

export const getProfileContacts = (id: string, offset: number, limit: number) =>
  fetchHrmApi(`/profiles/${id}/contacts?offset=${offset}&limit=${limit}&legacyFormat=false`);

export const getProfileCases = (id: string, offset: number, limit: number) =>
  fetchHrmApi(`/profiles/${id}/cases?offset=${offset}&limit=${limit}&legacyFormat=false`);
