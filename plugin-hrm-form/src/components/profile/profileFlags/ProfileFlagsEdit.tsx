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

import React, { useState } from 'react';
import { Select } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';

import ProfileFlagsList from './ProfileFlagsList';
import { StyledMenuItem, StyledSelect, TextField } from '../../../styles/HrmStyles';
import { CustomITask, Profile, ProfileFlag } from '../../../types/types';
import { useProfileFlags } from '../../../states/profile/hooks';

type OwnProps = {
  profileId: Profile['id'];
  task: CustomITask;
};

type Props = OwnProps;

const ProfileFlagsEdit: React.FC<Props> = (props: Props) => {
  const { profileId } = props;
  const { allProfileFlags, profileFlags, associateProfileFlag } = useProfileFlags(profileId);

  const [open, setOpen] = useState(false);

  const availableFlags = allProfileFlags.filter(flag => !profileFlags.find(f => f.id === flag.id));
  const renderValue = () => <ProfileFlagsList {...props} enableDisassociate={true} />;
  const handleOpen = () => {
    if (availableFlags.length) setOpen(true);
  };
  const getIconComponent = () =>
    availableFlags.length ? <ArrowDropDown onClick={handleOpen} /> : <ArrowDropDown style={{ visibility: 'hidden' }} />;

  return (
    <Select
      open={open}
      onOpen={handleOpen}
      onClose={() => setOpen(false)}
      IconComponent={getIconComponent}
      value="false"
      renderValue={renderValue}
    >
      {availableFlags.map((flag: ProfileFlag) => (
        <StyledMenuItem key={flag.id} onClick={() => associateProfileFlag(flag.id)}>
          {flag.name}
        </StyledMenuItem>
      ))}
    </Select>
  );
};

export default ProfileFlagsEdit;
