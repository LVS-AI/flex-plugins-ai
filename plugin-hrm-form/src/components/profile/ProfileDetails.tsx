import React from 'react';

import { Profile } from '../../types/types';

type OwnProps = {
  profileId: Profile['id'];
};

type Props = OwnProps;

const ProfileDetails: React.FC<Props> = ({ profileId }) => {
  return <div>Details</div>;
};

export default ProfileDetails;
