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
import { Table, TableCell, TableRow, withStyles } from '@material-ui/core';

import { Absolute, FontOpenSans, Flex } from '../HrmStyles';
import HrmTheme from '../HrmTheme';

export const CaseListContainer = styled(Absolute)`
  height: 100%;
  width: 1280px;
  background-color: #f6f6f6;
`;
CaseListContainer.displayName = 'CaseListContainer';

export const CenteredContainer = styled(CaseListContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
CenteredContainer.displayName = 'CenteredContainer';

export const TableContainer = styled(Flex)`
  border-left: 15px solid ${HrmTheme.colors.base2};
  border-right: 10px solid ${HrmTheme.colors.base2};
`;
TableContainer.displayName = 'TableContainer';

export const CLTable = withStyles({
  root: {
    borderCollapse: 'separate',
    borderSpacing: '0 5px',
    '&:focus': {
      outline: 'none',
    },
  },
})(Table);
CLTable.displayName = 'CLTable';

export const CLTableRow = withStyles({
  root: {
    height: 85,
    background: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(127, 134, 155, 0.07)',
    borderRadius: 4,
    boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.06)',
    '&:hover': {
      outline: 'auto',
      outlineColor: '#000',
    },
  },
})(TableRow);
CLTableRow.displayName = 'CLTableRow';

export const CLHeaderTableCell = withStyles(theme => ({
  root: {
    borderBottom: 0,
    textTransform: 'none',
    overflow: 'hidden',
    padding: '0 0 0 10px',
  },
  body: {
    verticalAlign: 'top',
    paddingTop: 8,
  },
}))(TableCell);
CLHeaderTableCell.displayName = 'CLHeaderTableCell';

export const CLTableCell = withStyles({
  root: {
    borderBottom: 0,
    textTransform: 'none',
    overflow: 'hidden',
    paddingLeft: '10px',
  },
  body: {
    verticalAlign: 'top',
    paddingTop: 8,
  },
})(TableCell);
CLTableCell.displayName = 'CLTableCell';

export const CLNumberCell = withStyles({
  body: {
    paddingLeft: '10px !important',
  },
})(CLTableCell);
CLNumberCell.displayName = 'CLNumberCell';

export const CLNamesCell = withStyles({
  body: {
    paddingRight: 10,
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
  },
})(CLTableCell);
CLNamesCell.displayName = 'CLNamesCell';

export const CLSummaryCell = withStyles({
  body: {
    paddingRight: 20,
  },
})(CLTableCell);
CLSummaryCell.displayName = 'CLSummaryCell';

export const CLTableHeaderFont = styled(FontOpenSans)`
  font-weight: 600;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 0;
  padding: 0 2px;
  align-items: right;
`;
CLTableHeaderFont.displayName = 'CLTableHeaderFont';

export const CLTableBodyFont = styled(FontOpenSans)`
  color: #192b33;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  max-height: ${() => 85 - 12 /* 85px of cell height - 12px of padding*/}px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
CLTableBodyFont.displayName = 'CLTableBodyFont';

export const CLTableSummaryFont = styled(CLTableBodyFont)`
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`;
CLTableSummaryFont.displayName = 'CLTableSummaryFont';

export const CLCaseNumberContainer = styled('div')`
  display: inline-block;
  padding: 0 6px;
`;
CLCaseNumberContainer.displayName = 'CLCaseNumberContainer';

export const CLCaseIDButton = styled('button')`
  color: #1876d1;
  text-decoration: underline;
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding: 2px 0px;
  font-family: 'Open Sans';
  &:focus {
    outline: auto;
    outline-color: black;
  }
`;
CLCaseIDButton.displayName = 'CLCaseIDButton';

type PaginationButtonProps = {
  highlight?: Boolean;
};

export const PaginationButton = styled('button')<PaginationButtonProps>`
  background-color: ${props => (props.highlight ? '#1976D2' : 'transparent')};
  box-shadow: ${props => (props.highlight ? '0 1px 1px 0 rgba(0, 0, 0, 0.06)' : '0')};
  border-radius: 4px;
  padding: 6px 10px;
  margin: 0 2px;
  border: none;
  &:focus {
    outline: auto;
  }
`;
PaginationButton.displayName = 'PaginationButton';

export const PaginationChevron = styled(PaginationButton)`
  margin: 0;
  padding: 7px 3px;
`;
PaginationChevron.displayName = 'PaginationChevron';

type ButtonTextProps = {
  highlight?: Boolean;
};

export const ButtonText = styled(FontOpenSans)<ButtonTextProps>`
  font-size: 13px;
  color: ${props => (props.highlight ? '#ffffff' : '#666c7c')};
  font-weight: ${props => (props.highlight ? 700 : 600)};
`;
ButtonText.displayName = 'ButtonText';

export const SomethingWentWrongText = styled(FontOpenSans)`
  color: ${HrmTheme.colors.errorColor};
  font-size: 20px;
`;
SomethingWentWrongText.displayName = 'SomethingWentWrongText';

const FiltersContainer = styled(Flex)`
  margin-left: 15px;
  margin-right: 10px;
  padding: 10px;
  font-size: 13px;
  box-shadow: 0 1px 2px 0 rgba(25, 43, 51, 0.1);
`;
FiltersContainer.displayName = 'FiltersContainer';
