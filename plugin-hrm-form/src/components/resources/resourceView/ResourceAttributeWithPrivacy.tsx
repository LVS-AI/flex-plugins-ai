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
import WarningIcon from '@material-ui/icons/Warning';
import { Template } from '@twilio/flex-ui';

import {
  PrivateResourceAttribute,
  ResourceAttributeContent,
  ResourceAttributeDescription,
} from '../../../styles/ReferrableResources';
import ResourceAttribute from './ResourceAttribute';

type Props = {
  isPrivate: boolean;
  description?: string;
};

const ResourceAttributeWithPrivacy: React.FC<Props> = ({ isPrivate, description, children }) => {
  const renderPrivateResourceAttribute = () => (
    <>
      <ResourceAttributeDescription>
        <Template code={description} />
      </ResourceAttributeDescription>
      <PrivateResourceAttribute>
        <span style={{ fontWeight: 'bold', fontSize: '10px' }}>
          <WarningIcon style={{ color: '#f6ca4a', paddingRight: '4px', paddingTop: '6px' }} />
          <Template code="Resources-View-PrivateInformationWarning" />
        </span>
        <ResourceAttributeContent>
          {children || <Template code="Resources-View-MissingProperty" />}
        </ResourceAttributeContent>
      </PrivateResourceAttribute>
    </>
  );

  const renderPublicResourceAttribute = () => (
    <ResourceAttribute description={description} isExpandable={false}>
      {children}
    </ResourceAttribute>
  );

  return isPrivate ? renderPrivateResourceAttribute() : renderPublicResourceAttribute();
};
ResourceAttributeWithPrivacy.displayName = 'ResourceAttributeWithPrivacy';

// eslint-disable-next-line import/no-unused-modules
export default ResourceAttributeWithPrivacy;
