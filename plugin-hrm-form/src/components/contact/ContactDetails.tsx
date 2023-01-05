// TODO: complete this type
import React, { Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { DefinitionVersion } from 'hrm-form-definitions';

import { CustomITask } from '../../types/types';
import ContactDetailsHome from './ContactDetailsHome';
import { DetailsContext } from '../../states/contacts/contactDetails';
import { configurationBase, contactFormsBase, csamReportBase, namespace, RootState } from '../../states';
import EditContactSection from './EditContactSection';
import { getDefinitionVersion } from '../../services/ServerlessService';
import { DetailsContainer } from '../../styles/search';
import * as ConfigActions from '../../states/configuration/actions';
import { ContactDetailsSectionFormApi, contactDetailsSectionFormApi } from './contactDetailsSectionFormApi';
import ContactDetailsSectionForm from './ContactDetailsSectionForm';
import IssueCategorizationSectionForm from './IssueCategorizationSectionForm';
import { forExistingContact } from '../../states/contacts/issueCategorizationStateApi';
import { getConfig } from '../../HrmFormPlugin';
import { SearchContactDraftChanges, updateDraft } from '../../states/contacts/existingContacts';
import {
  externalReportDefinition,
  externalReportLayoutDefinition,
  transformContactFormValues,
} from '../../services/ContactService';
import { isChildTaskEntry, isCounsellorTaskEntry } from '../../states/csam-report/reducer';
import CSAMReport from '../CSAMReport/CSAMReport';
import { existingContactCSAMApi } from '../CSAMReport/csamReportApi';
import {
  newCSAMReportActionForContact,
  updateChildFormActionForContact,
  updateCounsellorFormActionForContact,
} from '../../states/csam-report/actions';
import { CSAMReportType } from '../../states/csam-report/types';
import { childInitialValues, initialValues } from '../CSAMReport/CSAMReportFormDefinition';

type OwnProps = {
  contactId: string;
  context: DetailsContext;
  handleOpenConnectDialog?: (event: any) => void;
  enableEditing?: boolean;
  showActionIcons?: boolean;
  taskSid?: CustomITask['taskSid'];
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const ContactDetails: React.FC<Props> = ({
  context,
  contactId,
  handleOpenConnectDialog,
  showActionIcons,
  definitionVersions,
  updateDefinitionVersion,
  savedContact,
  draftContact,
  addExternalReport,
  enableEditing = true,
  draftCsamReport,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const version = savedContact?.details.definitionVersion;

  const { featureFlags } = getConfig();
  /**
   * Check if the definitionVersion for this case exists in redux, and look for it if not.
   */
  React.useEffect(() => {
    const fetchDefinitionVersions = async (v: string) => {
      const definitionVersion = await getDefinitionVersion(version);
      updateDefinitionVersion(version, definitionVersion);
    };

    if (version && !definitionVersions[version]) {
      fetchDefinitionVersions(version);
    }
  }, [definitionVersions, updateDefinitionVersion, version, savedContact]);

  const definitionVersion = definitionVersions[version];

  if (!definitionVersion)
    return (
      <DetailsContainer>
        <CircularProgress size={50} />
      </DetailsContainer>
    );

  const editContactSectionElement = (
    section: ContactDetailsSectionFormApi,
    formPath: 'callerInformation' | 'childInformation' | 'caseInformation',
  ) => (
    <EditContactSection context={context} contactId={contactId} contactDetailsSectionForm={section} tabPath={formPath}>
      <ContactDetailsSectionForm
        tabPath={formPath}
        definition={section.getFormDefinition(definitionVersion)}
        layoutDefinition={section.getLayoutDefinition(definitionVersion)}
        initialValues={section.getFormValues(definitionVersion, draftContact)[formPath]}
        display={true}
        autoFocus={true}
        updateFormActionDispatcher={dispatch => values =>
          dispatch(
            updateDraft(contactId, {
              details: {
                [formPath]: transformContactFormValues(values[formPath], section.getFormDefinition(definitionVersion)),
              },
            }),
          )}
      />
    </EditContactSection>
  );

  const addExternalReportSectionElement = (formPath: 'externalReport') => (
    <EditContactSection
      context={context}
      contactId={contactId}
      tabPath="externalReport"
      externalReport={addExternalReport}
    >
      <ContactDetailsSectionForm
        tabPath="externalReport"
        definition={externalReportDefinition}
        layoutDefinition={externalReportLayoutDefinition.layout}
        initialValues={
          isChildTaskEntry(draftCsamReport) || isCounsellorTaskEntry(draftCsamReport)
            ? { reportType: draftCsamReport.reportType }
            : {}
        }
        display={true}
        autoFocus={true}
        updateFormActionDispatcher={dispatch => ({ externalReport: { reportType } }) => {
          if (reportType) {
            dispatch(
              newCSAMReportActionForContact(
                contactId,
                reportType === 'child' ? CSAMReportType.CHILD : CSAMReportType.COUNSELLOR,
              ),
            );
          }
        }}
      />
    </EditContactSection>
  );

  if (draftContact) {
    if (draftContact.overview?.categories) {
      const issueSection = contactDetailsSectionFormApi.ISSUE_CATEGORIZATION;
      return (
        <EditContactSection
          context={context}
          contactId={contactId}
          contactDetailsSectionForm={contactDetailsSectionFormApi.ISSUE_CATEGORIZATION}
          tabPath="categories"
        >
          <IssueCategorizationSectionForm
            definition={definitionVersion.tabbedForms.IssueCategorizationTab(draftContact.overview.helpline)}
            initialValue={issueSection.getFormValues(definitionVersion, draftContact).categories}
            stateApi={forExistingContact(contactId)}
            display={true}
            autoFocus={true}
          />
        </EditContactSection>
      );
    }

    const { callerInformation, caseInformation, childInformation } = draftContact.details;

    if (childInformation)
      return editContactSectionElement(contactDetailsSectionFormApi.CHILD_INFORMATION, 'childInformation');
    if (callerInformation)
      return editContactSectionElement(contactDetailsSectionFormApi.CALLER_INFORMATION, 'callerInformation');
    if (caseInformation)
      return editContactSectionElement(contactDetailsSectionFormApi.CASE_INFORMATION, 'caseInformation');
  }
  if (draftCsamReport) {
    if ((isChildTaskEntry(draftCsamReport) || isCounsellorTaskEntry(draftCsamReport)) && draftCsamReport.form) {
      return <CSAMReport api={existingContactCSAMApi(contactId)} />;
    }
    return addExternalReportSectionElement('externalReport');
  }

  return (
    <ContactDetailsHome
      context={context}
      showActionIcons={showActionIcons}
      contactId={contactId}
      handleOpenConnectDialog={handleOpenConnectDialog}
      enableEditing={enableEditing && featureFlags.enable_contact_editing}
    />
  );
};

const mapDispatchToProps = (dispatch: Dispatch<{ type: string } & Record<string, any>>, { contactId }: OwnProps) => ({
  updateDefinitionVersion: (version: string, definitionVersion: DefinitionVersion) =>
    dispatch(ConfigActions.updateDefinitionVersion(version, definitionVersion)),
});

const mapStateToProps = (state: RootState, { contactId }: OwnProps) => ({
  definitionVersions: state[namespace][configurationBase].definitionVersions,
  savedContact: state[namespace][contactFormsBase].existingContacts[contactId]?.savedContact,
  draftContact: state[namespace][contactFormsBase].existingContacts[contactId]?.draftContact,
  addExternalReport: state[namespace][contactFormsBase].externalReport,
  draftCsamReport: state[namespace][csamReportBase].contacts[contactId],
});

ContactDetails.displayName = 'ContactDetails';

const connector = connect(mapStateToProps, mapDispatchToProps);
const connected = connector(ContactDetails);

export default connected;
