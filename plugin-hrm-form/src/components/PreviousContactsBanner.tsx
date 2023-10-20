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
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Template } from '@twilio/flex-ui';

import { getProfileByIdentifier } from '../services/ProfileService';
import {
  viewPreviousContacts as viewPreviousContactsAction,
  searchContacts as searchContactsAction,
  searchCases as searchCasesAction,
} from '../states/search/actions';
import * as ProfileActions from '../states/profile/actions';
import { RootState } from '../states';
import { CONTACTS_PER_PAGE, CASES_PER_PAGE } from './search/SearchResults';
import { YellowBanner } from '../styles/previousContactsBanner';
import { Bold } from '../styles/HrmStyles';
import { StyledLink } from '../styles/search';
import { ChannelTypes, channelTypes } from '../states/DomainConstants';
import { changeRoute as changeRouteAction } from '../states/routing/actions';
import { getFormattedNumberFromTask, getNumberFromTask, getContactValueTemplate } from '../utils';
import { getPermissionsForViewingIdentifiers, PermissionActions } from '../permissions';
import { CustomITask, isTwilioTask } from '../types/types';
import { configurationBase, contactFormsBase, namespace, searchContactsBase } from '../states/storeNamespaces';

type OwnProps = {
  task: CustomITask;
  enableClientProfiles?: boolean;
};

// eslint-disable-next-line no-use-before-define
type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PreviousContactsBanner: React.FC<Props> = ({
  task,
  enableClientProfiles,
  previousContacts,
  viewPreviousContacts,
  searchContacts,
  searchCases,
  changeRoute,
  editContactFormOpen,
  addProfileState,
  setCurrentProfile,
}) => {
  let localizedSourceFromTask: { [channelType in ChannelTypes]: string };
  let contactIdentifier: string;
  if (isTwilioTask(task)) {
    localizedSourceFromTask = {
      [channelTypes.web]: `${getContactValueTemplate(task)}`,
      [channelTypes.voice]: 'PreviousContacts-PhoneNumber',
      [channelTypes.sms]: 'PreviousContacts-PhoneNumber',
      [channelTypes.whatsapp]: 'PreviousContacts-WhatsappNumber',
      [channelTypes.facebook]: 'PreviousContacts-FacebookUser',
      [channelTypes.twitter]: 'PreviousContacts-TwitterUser',
      [channelTypes.instagram]: 'PreviousContacts-InstagramUser',
      [channelTypes.line]: 'PreviousContacts-LineUser',
    };
    contactIdentifier = getFormattedNumberFromTask(task);
  }

  const [identifierData, setIdentifierData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfileByIdentifier(contactIdentifier);
        setIdentifierData(data);

        const profile = data?.profiles?.[0];
        const profileId = profile?.id;

        if (!profileId) return;
        addProfileState(profileId, profile);
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };
    if (enableClientProfiles && contactIdentifier) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactIdentifier]);

  const { canView } = getPermissionsForViewingIdentifiers();
  const maskIdentifiers = !canView(PermissionActions.VIEW_IDENTIFIERS);

  const performSearch = () => {
    if (!isTwilioTask(task)) return;
    const contactNumber = getNumberFromTask(task);
    const isTraceableNumber = ![null, undefined, '', 'Anonymous'].includes(contactNumber);

    if (isTraceableNumber) {
      const searchParams = { contactNumber };
      searchContacts(searchParams, CONTACTS_PER_PAGE, 0, true);
      searchCases(searchParams, CASES_PER_PAGE, 0, true);
    }
  };

  useEffect(() => {
    if (previousContacts !== undefined) return;

    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousContacts]);

  const contactsCount = identifierData?.profiles?.[0]?.contactsCount || previousContacts?.contacts?.count || 0;
  const casesCount = identifierData?.profiles?.[0]?.casesCount || previousContacts?.cases?.count || 0;

  const shouldDisplayBanner = contactsCount > 0 || casesCount > 0;
  if (!shouldDisplayBanner) return null;

  const handleClickViewRecords = async () => {
    if (enableClientProfiles) {
      setCurrentProfile(identifierData?.profiles?.[0]?.id);
    } else {
      viewPreviousContacts();
    }

    const subroute = enableClientProfiles ? 'profile' : 'search';
    changeRoute({ route: 'tabbed-forms', subroute });
  };

  return (
    <div className={editContactFormOpen ? 'editingContact' : ''}>
      {' '}
      f
      <YellowBanner data-testid="PreviousContacts-Container" className="hiddenWhenEditingContact">
        <pre>
          <Template code="PreviousContacts-ThereAre" />
          &nbsp;
          {contactsCount === 1 ? (
            <Bold>
              {contactsCount} <Template code="PreviousContacts-PreviousContact" />
            </Bold>
          ) : (
            <Bold>
              {contactsCount} <Template code="PreviousContacts-PreviousContacts" />
            </Bold>
          )}
          &nbsp;
          <Template code="PreviousContacts-And" />
          &nbsp;
          {casesCount === 1 ? (
            <Bold>
              {casesCount} <Template code="PreviousContacts-Case" />
            </Bold>
          ) : (
            <Bold>
              {casesCount} <Template code="PreviousContacts-Cases" />
            </Bold>
          )}
          &nbsp;
          <Template code="PreviousContacts-From" />
          &nbsp;
          <Template code={localizedSourceFromTask[task.channelType]} />
          &nbsp;
          {maskIdentifiers ? (
            <Bold>
              <Template code="MaskIdentifiers" />
            </Bold>
          ) : (
            <Bold>{contactIdentifier}</Bold>
          )}
          .&nbsp;
        </pre>
        <StyledLink underline data-testid="PreviousContacts-ViewRecords" onClick={handleClickViewRecords}>
          <Template code="PreviousContacts-ViewRecords" />
        </StyledLink>
      </YellowBanner>
    </div>
  );
};

PreviousContactsBanner.displayName = 'PreviousContactsBanner';

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const searchContactsState = state[namespace][searchContactsBase];
  const taskId = ownProps.task.taskSid;
  const taskSearchState = searchContactsState.tasks[taskId];
  const { counselors } = state[namespace][configurationBase];
  const editContactFormOpen = state[namespace][contactFormsBase].editingContact;

  return {
    previousContacts: taskSearchState.previousContacts,
    counselorsHash: counselors.hash,
    editContactFormOpen,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { task } = ownProps;
  const taskId = task.taskSid;

  return {
    viewPreviousContacts: viewPreviousContactsAction(dispatch)(task),
    searchContacts: searchContactsAction(dispatch)(taskId),
    searchCases: searchCasesAction(dispatch)(taskId),
    changeRoute: routing => dispatch(changeRouteAction(routing, taskId)),
    addProfileState: ProfileActions.addProfileState(dispatch),
    setCurrentProfile: ProfileActions.setCurrentProfile(dispatch),
  };
};

export const UnconnectedPreviousContactsBanner = PreviousContactsBanner;
export default connect(mapStateToProps, mapDispatchToProps)(PreviousContactsBanner);
