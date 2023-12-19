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
import { connect } from 'react-redux';
import { Template } from '@twilio/flex-ui';

import selectContactByTaskSid from '../../states/contacts/selectContactByTaskSid';
import asyncDispatch from '../../states/asyncDispatch';
import { removeFromCaseAsyncAction } from '../../states/contacts/saveContact';
import { newOpenModalAction } from '../../states/routing/actions';
import type { Case } from '../../types/types';
import { BannerContainer, Text, CaseLink, BannerActionLink } from './styles';
import InfoIcon from './InfoIcon';
import { showRemovedFromCaseBannerAction } from '../../states/case/caseBanners';
import selectCaseByCaseId from '../../states/case/selectCaseStateByCaseId';
import { RootState } from '../../states';
import { contactFormsBase, namespace } from '../../states/storeNamespaces';
import { setRemovedCaseId } from '../../states/contacts/actions';

type OwnProps = {
  taskId: string;
  contactId?: string;
  caseId?: string;
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootState, { taskId, contactId }: OwnProps) => {
  const offlineSavedContact = selectContactByTaskSid(state, taskId)?.savedContact;
  const existingSavedContact = state[namespace][contactFormsBase].existingContacts[contactId]?.savedContact;
  const connectedCase = selectCaseByCaseId(state, offlineSavedContact?.caseId || existingSavedContact?.caseId)
    ?.connectedCase;
  const caseId = offlineSavedContact?.caseId || existingSavedContact?.caseId;
  return {
    contact: offlineSavedContact || existingSavedContact,
    connectedCase,
    caseId,
    existingSavedContact,
  };
};

const mapDispatchToProps = (dispatch, { taskId }: OwnProps) => ({
  viewCaseDetails: ({ id }: Case) => {
    dispatch(newOpenModalAction({ route: 'case', subroute: 'home', caseId: id, isCreating: false }, taskId));
  },
  removeContactFromCase: async (contactId: string) => {
    await asyncDispatch(dispatch)(removeFromCaseAsyncAction(contactId));
    dispatch(showRemovedFromCaseBannerAction(contactId));
  },
  saveRemovedCaseId: (contactId: string, caseId: string) => dispatch(setRemovedCaseId(contactId, caseId)),
});

const ContactAddedToCaseBanner: React.FC<Props> = ({
  connectedCase,
  contact,
  viewCaseDetails,
  removeContactFromCase,
  caseId,
  saveRemovedCaseId,
  existingSavedContact,
}) => {
  if (connectedCase === undefined) return null;

  const handleRemoveContactFromCase = () => {
    if (existingSavedContact) {
      saveRemovedCaseId(existingSavedContact.id, existingSavedContact.caseId);
    }
    removeContactFromCase(contact.id);
  };

  return (
    <BannerContainer color="blue">
      <InfoIcon color="#001489" />
      <Text>
        <Template code="CaseMerging-ContactAddedTo" />
      </Text>
      <CaseLink type="button" onClick={() => viewCaseDetails(connectedCase)}>
        <Template code="Case-CaseNumber" />
        {caseId}
      </CaseLink>
      <BannerActionLink type="button" onClick={handleRemoveContactFromCase}>
        <Template code="CaseMerging-RemoveFromCase" />
      </BannerActionLink>
    </BannerContainer>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
const connected = connector(ContactAddedToCaseBanner);

export default connected;
