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

import { getPermissionsForContact, PermissionActions } from '../../permissions';
import { Contact, Profile } from '../../types/types';
import ContactPreview from '../search/ContactPreview';
import * as profileStateTypes from '../../states/profile/types';
import ProfileRelationships from './ProfileRelationships';

type OwnProps = {
  profileId: Profile['id'];
};

const ProfileContacts: React.FC<OwnProps> = ({ profileId }) => {
  const renderItem = (contact: Contact) => {
    const { can } = getPermissionsForContact(contact.twilioWorkerId);
    const handleViewDetails = () => {
      // load contact modal? or page?
    };

    return (
      <ContactPreview
        key={`ContactPreview-${contact.id}`}
        contact={contact}
        handleViewDetails={() => can(PermissionActions.VIEW_CONTACT) && handleViewDetails}
      />
    );
  };

  return (
    <ProfileRelationships
      profileId={profileId}
      type={'contacts' as profileStateTypes.ProfileRelationships}
      renderItem={renderItem}
    />
  );
};

export default ProfileContacts;
