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

import { DefinitionVersion } from 'hrm-form-definitions';

import { CaseSectionApi } from './api';
import { DocumentEntry } from '../../../types/types';
import { upsertCaseSectionItemUsingSectionName } from './update';
import { getMostRecentSectionItem, getSectionItemById } from './get';
import { getWorkingCopy, setWorkingCopy } from './workingCopy';

const SECTION_PROPERTY = 'documents';

export const documentSectionApi: CaseSectionApi<DocumentEntry> = {
  label: 'Document',
  toForm: (input: DocumentEntry) => {
    const { document, ...caseItemEntry } = { ...input, form: input.document };
    return caseItemEntry;
  },
  upsertCaseSectionItemFromForm: upsertCaseSectionItemUsingSectionName(SECTION_PROPERTY, 'document'),
  getSectionFormDefinition: (definitionVersions: DefinitionVersion) => definitionVersions.caseForms.DocumentForm,
  getSectionLayoutDefinition: (definitionVersions: DefinitionVersion) =>
    definitionVersions.layoutVersion.case.documents,
  getMostRecentSectionItem: getMostRecentSectionItem(SECTION_PROPERTY),
  getSectionItemById: getSectionItemById(SECTION_PROPERTY),
  getWorkingCopy: getWorkingCopy(SECTION_PROPERTY),
  updateWorkingCopy: setWorkingCopy(SECTION_PROPERTY),
};
