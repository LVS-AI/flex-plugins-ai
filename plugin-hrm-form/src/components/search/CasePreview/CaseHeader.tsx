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

/* eslint-disable react/prop-types */
import React from 'react';
import { format } from 'date-fns';
import { Template } from '@twilio/flex-ui';
import { CheckCircleOutlineOutlined, CreateNewFolderOutlined, FolderOutlined } from '@material-ui/icons';

import {
  SubtitleLabel,
  SubtitleValue,
  StyledLink,
  PreviewHeaderText,
  PreviewRow,
  SummaryText,
  PreviewActionButton,
} from '../../../styles/search';
import { Flex } from '../../../styles/HrmStyles';
import { getTemplateStrings } from '../../../hrmConfig';

type OwnProps = {
  caseId: number;
  contactLabel?: string;
  createdAt: Date;
  updatedAt?: Date;
  followUpDate?: Date;
  isOrphanedCase: boolean;
  status: string;
  statusLabel: string;
  onClickViewCase: () => void;
  showConnectButton: boolean;
  onClickConnectToTaskContact: () => void;
  isConnectedToTaskContact: boolean;
};

type Props = OwnProps;

const CaseHeader: React.FC<Props> = ({
  caseId,
  contactLabel,
  createdAt,
  updatedAt,
  followUpDate,
  isOrphanedCase,
  status,
  statusLabel,
  onClickViewCase,
  isConnectedToTaskContact,
  onClickConnectToTaskContact,
  showConnectButton,
}) => {
  const strings = getTemplateStrings();

  return (
    <div>
      <PreviewRow>
        <Flex justifyContent="space-between" width="100%">
          <Flex alignItems="center" style={{ minWidth: 'fit-content' }}>
            {!isOrphanedCase && (
              <Flex marginRight="10px">
                <FolderOutlined style={{ color: '#192b33' }} />
              </Flex>
            )}
            <StyledLink underline={true} style={{ minWidth: 'inherit', marginInlineEnd: 10 }} onClick={onClickViewCase}>
              <PreviewHeaderText style={{ textDecoration: 'underline' }}>#{caseId}</PreviewHeaderText>
            </StyledLink>
            <PreviewHeaderText>{isOrphanedCase ? strings['CaseHeader-Voided'] : `${contactLabel}`}</PreviewHeaderText>
          </Flex>
          {showConnectButton && (
            <Flex style={{ minWidth: 'fit-content' }}>
              <PreviewActionButton
                disabled={isConnectedToTaskContact}
                onClick={onClickConnectToTaskContact}
                secondary="true"
              >
                {!isConnectedToTaskContact && <CreateNewFolderOutlined />}
                {isConnectedToTaskContact && <CheckCircleOutlineOutlined />}
                <div style={{ width: 10 }} />
                <Template
                  code={
                    isConnectedToTaskContact ? 'CaseHeader-TaskContactConnected' : 'CaseHeader-ConnectToTaskContact'
                  }
                />
              </PreviewActionButton>
            </Flex>
          )}
        </Flex>
      </PreviewRow>
      <PreviewRow>
        <Flex justifyContent="space-between" width="100%">
          <Flex style={{ minWidth: 'fit-content' }}>
            <SubtitleLabel>
              <Template code="CaseHeader-Opened" />:
            </SubtitleLabel>
            <SubtitleValue>{format(createdAt, 'MMM d, yyyy')}</SubtitleValue>
            {updatedAt && (
              <>
                <SubtitleLabel>
                  <Template code={status === 'closed' || isOrphanedCase ? 'CaseHeader-Closed' : 'CaseHeader-Updated'} />
                  :
                </SubtitleLabel>
                <SubtitleValue>{format(updatedAt, 'MMM d, yyyy')}</SubtitleValue>
              </>
            )}
            {followUpDate && (
              <>
                <SubtitleLabel>
                  <Template code="CaseHeader-FollowUpDate" />:
                </SubtitleLabel>
                <SubtitleValue>{format(followUpDate, 'MMM d, yyyy')}</SubtitleValue>
              </>
            )}
          </Flex>
          <Flex style={{ minWidth: 'fit-content' }}>
            <SummaryText style={{ fontWeight: 400 }}>{statusLabel}</SummaryText>
          </Flex>
        </Flex>
      </PreviewRow>
    </div>
  );
};

CaseHeader.displayName = 'CaseHeader';

export default CaseHeader;
