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
import { styled, Button, IconButton } from '@twilio/flex-ui';
import { withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import BlockOutlinedIcon from '@material-ui/icons/BlockOutlined';

import { FontOpenSans } from '../../styles/HrmStyles';
import HrmTheme from '../../styles/HrmTheme';

export const DetailsWrapper = styled(FontOpenSans)`
  margin-top: 10px;
  padding: 5px 20px 10px 20px;
  min-width: 400px;
  box-sizing: border-box;
  background-color: #ffffff;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
  border-radius: 4px;
`;
DetailsWrapper.displayName = 'DetailsWrapper';

export const ProfileSectionWrapper = styled('div')`
  padding: 5px 0 10px 5px;
`;
ProfileSectionWrapper.displayName = 'ProfileSectionWrapper';

// TODO: refactor to HrmStyles
export const ProfileSectionSubtitle = styled(FontOpenSans)`
  color: ${HrmTheme.colors.categoryTextColor};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.67px;
  line-height: 12px;
  text-transform: uppercase;
  margin: 15px 0 5px;
`;
ProfileSectionSubtitle.displayName = 'ProfileSectionSubtitle';

type ButtonProps = {
  onClick: () => void;
};

export const ProfileSectionEditButton = styled(Button)<ButtonProps>`
  width: 40px;
  height: 30px;
  border-radius: 4px;
  color: ${HrmTheme.colors.categoryTextColor};
  background-color: ${HrmTheme.colors.secondaryButtonColor};
  font-size: 14px;
  box-shadow: none;
  border: none;
  margin-left: auto;

  :focus,
  :active {
    outline: auto;
    box-shadow: none;
    border: none;
  }
`;
ProfileSectionEditButton.displayName = 'ProfileSectionEditButton';

type ColorProps = {
  fillColor?: string;
  isBlocked?: boolean;
};

export const FlagPill = styled('div')<ColorProps>`
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  white-space: nowrap;
  margin: 5px 4px 5px 1px;
  padding: 4px 12px;
  background-color: ${props => (props.isBlocked ? `#FCF4F4` : '#F5EEF4')};
  border: ${props => (props.isBlocked ? `2px dashed #D61F1F` : '2px solid #F5EEF4')};
  border-color: ${props => (props.isBlocked ? `#D61F1F` : 'none')};
  color: ${props => (props.isBlocked ? `#D61F1F` : '#192B33')};
  text-transform: capitalize;
`;
FlagPill.displayName = 'FlagPill';

export const StyledBlockOutlinedIcon = withStyles({
  root: { width: '1rem', height: '1rem', fontSize: 'smaller', marginRight: '7px' },
})(BlockOutlinedIcon);

export const StyledFlagEditList = styled('div')`
  background-color: #f9fafb;
  border-radius: 5px;
  align-items: center;
  &:focus-within {
    outline: 3px solid rgb(0, 95, 204);
  }
`;
StyledFlagEditList.displayName = 'StyledFlagEditList';

export const DisassociateButton = styled(IconButton)`
  height: 1rem;
  width: 1rem;
  padding: 4px;
  margin-left: 12px;
  background-color: #d61f1f;
  :hover {
    background-color: #4a0b0b;
  }
`;
DisassociateButton.displayName = 'DisassociateButton';

export const CloseIconButton = withStyles({
  root: {
    width: '1rem',
    height: '1rem',
    cursor: 'pointer',
    color: '#fff',
    '&:hover': {
      color: '#fff',
    },
  },
})(CloseIcon);

export const SectionText = styled('p')`
  font-size: 12px;
  line-height: 15px;
  padding: 5px 5px 5px 15px;
  margin: 5px 0 10px 0;
  height: 150%;
  width: 100%;
  background-color: rgba(246, 246, 246, 0.49);
  border: none;
  border-radius: 2px;
  box-sizing: border-box;
  overflow: hidden;
  flex-grow: 1;
  font-family: 'Open Sans';
  box-sizing: border-box;
  opacity: 0.5;
  :focus {
    outline: none;
  }
`;
SectionText.displayName = 'SectionText';

type StyledTextProps = {
  hasContent?: boolean;
};

export const SectionContentText = styled('div')<StyledTextProps>`
  font-size: 12px;
  line-height: 15px;
  padding: 5px 5px 5px 15px;
  margin: 20px 0;
  height: 100%;
  width: 100%;
  background-color: rgba(246, 246, 246, 0.49);
  border: none;
  border-radius: 2px;
  box-sizing: border-box;
  overflow: hidden;
  flex-grow: 1;
  font-family: 'Open Sans';
  font-weight: 400;
  box-sizing: border-box;
  white-space: pre-wrap;
  opacity: ${props => (props.hasContent ? 1 : 0.5)};
  :focus {
    outline: none;
  }
`;
SectionContentText.displayName = 'SectionContentText';

export const ProfileFlagsView = styled('button')`
  background-color: ${HrmTheme.colors.inputBackgroundColor};
  display: flex;
  border: none;
  border-radius: 5px;
  align-items: center;
  align-self: center;
  align-content: center;
  width: -webkit-fill-available;
  :focus {
    background-color: ${HrmTheme.colors.inputBackgroundColor};
    box-shadow: none;
    border: 1px solid rgba(0, 59, 129, 0.37);
  }
`;
ProfileFlagsView.displayName = 'ProfileFlagsView';
