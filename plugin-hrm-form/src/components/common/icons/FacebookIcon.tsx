/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

type Props = {
  width: string;
  height: string;
  color?: string;
};
/* eslint-disable react/prop-types */
const FacebookIcon: React.FC<Props> = ({ width, height, color }) => {
  return (
    <svg width={width} height={height} fill={color} viewBox="0 0 52 52">
      <path
        fill={color}
        stroke="none"
        strokeWidth="1"
        fillRule="evenodd"
        d="M34.094,8.688h4.756V0.005h-8.643c-0.721-0.03-9.51-0.198-11.788,8.489c-0.033,0.091-0.761,2.157-0.761,6.983l-7.903,0.024   v9.107l7.913-0.023v24.021h12.087v-24h8v-9.131h-8v-2.873C29.755,10.816,30.508,8.688,34.094,8.688z M35.755,17.474v5.131h-8v24   h-8.087V22.579l-7.913,0.023v-5.107l7.934-0.023l-0.021-1.017c-0.104-5.112,0.625-7.262,0.658-7.365   c1.966-7.482,9.473-7.106,9.795-7.086l6.729,0.002v4.683h-2.756c-4.673,0-6.338,3.054-6.338,5.912v4.873L35.755,17.474   L35.755,17.474z"
      />
    </svg>
  );
};

FacebookIcon.displayName = 'WebchatIcon';
FacebookIcon.defaultProps = {
  color: '#1DA1F2',
};
export default FacebookIcon;
