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

import { styled } from '@twilio/flex-ui';
import { ButtonBase } from '@material-ui/core';

import { Box, Column, Flex, FontOpenSans, Row } from './HrmStyles';

export const ReferrableResourcesContainer = styled(Flex)`
  margin: 20px;
  max-width: 800px;
  width: 100%;
`;
ReferrableResourcesContainer.displayName = 'ReferrableResourcesContainer';

export const ResourceTitle = styled('p')`
  color: #192b33;
  font-family: Inter, sans-serif;
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
`;
ResourceTitle.displayName = 'ResourceTitle';

export const ViewResourceArea = styled('div')`
  width: 100%;
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  overflow-y: auto;
`;
ViewResourceArea.displayName = 'ViewResourceArea';

export const ResourceAttributesContainer = styled(Row)`
  align-items: start;
`;
ResourceAttributesContainer.displayName = 'ResourceAttributesContainer';

export const ResourceAttributesColumn = styled(Column)`
  flex: 1;
  margin: 5px;
`;

export const ResourceAttributeDescription = styled(FontOpenSans)`
  color: #8b8b8b;
  font-size: 14px;
  line-height: 20px;
`;
ResourceAttributeDescription.displayName = 'ResourceAttributeDescription';

export const ResourceAttributeContent = styled(FontOpenSans)`
  color: #192b33;
  font-size: 14px;
`;
ResourceAttributeContent.displayName = 'ResourceAttributeContent';

export const ResourceCategoriesContainer = styled(Row)`
  flex-wrap: wrap;
`;
ResourceCategoriesContainer.displayName = 'ResourceCategoriesContainer';

export const ResourcesSearchArea = styled('div')`
  margin: 10px;
  max-width: 800px;
  width: 100%;
  padding: 10px;
  overflow-y: auto;
`;
ViewResourceArea.displayName = 'ViewResourceArea';

export const ResourcesSearchFormArea = styled('div')`
  width: 100%;
  background-color: white;
  padding: 20px;
`;

export const ResourcesSearchFormContainer = styled(Column)`
  width: 100%;
  background-color: white;
  justify-content: space-between;
  max-width: 800px;
`;

export const ResourcesSearchSubmitButton = styled(ButtonBase)``;
ResourcesSearchSubmitButton.displayName = 'ResourcesSearchSubmitButton';

export const ResourcesSearchTitle = styled(FontOpenSans)`
  font-family: Inter-Bold, serif;
  font-size: 24px;
  line-height: 32px;
  font-weight: 800;
  display: inline-block;
  color: #192b33;
`;
ResourcesSearchTitle.displayName = 'ResourcesSearchTitle';

export const ResourcesSearchResultsHeader = styled(Box)`
  box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.1);
  padding-top: 10px;
  padding-bottom: 10px;
`;
ResourcesSearchResultsHeader.displayName = 'ResourcesSearchResultsHeader';

export const ResourcesSearchResultsDescription = styled(FontOpenSans)`
  font-size: 13px;
  line-height: 21px;
  color: #192b33;
`;
ResourcesSearchResultsDescription.displayName = 'ResourcesSearchResultsDescription';
