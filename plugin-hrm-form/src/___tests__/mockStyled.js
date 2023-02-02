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

/*
 * File used to populate test's scope with mocked styled components
 * Should be imported before the components making use of the styled
 */

jest.mock('../styles/HrmStyles', () => ({
  Box: 'Box',
  Flex: 'Flex',
  Absolute: 'Absolute',
  TabbedFormsContainer: 'TabbedFormsContainer',
  Container: 'Container',
  ErrorText: 'ErrorText',
  CategoryTitle: 'CategoryTitle',
  CategorySubtitleSection: 'CategorySubtitleSection',
  CategoryRequiredText: 'CategoryRequiredText',
  StyledInput: 'StyledInput',
  TextField: 'TextField',
  StyledLabel: 'StyledLabel',
  StyledSelect: 'StyledSelect',
  StyledMenuItem: 'StyledMenuItem',
  StyledNextStepButton: 'StyledNextStepButton',
  CheckboxField: 'CheckboxField',
  StyledCheckboxLabel: 'StyledCheckboxLabel',
  StyledCategoryCheckboxLabel: 'StyledCategoryCheckboxLabel',
  BottomButtonBar: 'BottomButtonBar',
  NameFields: 'NameFields',
  ColumnarBlock: 'ColumnarBlock',
  TwoColumnLayout: 'TwoColumnLayout',
  CategoryCheckboxField: 'CategoryCheckboxField',
  StyledCategoryCheckbox: 'StyledCategoryCheckbox',
  ToggleViewButton: 'ToggleViewButton',
  CategoriesWrapper: 'CategoriesWrapper',
  SubcategoriesWrapper: 'SubcategoriesWrapper',
  StyledTabs: 'StyledTabs',
  StyledTab: 'StyledTab',
  StyledSearchTab: 'StyledSearchTab',
  Row: 'Row',
  FontOpenSans: 'FontOpenSans',
  HiddenText: 'HiddenText',
  TransferStyledButton: 'TransferStyledButton',
  HeaderContainer: 'HeaderContainer',
  StyledIcon: () => 'StyledIcon',
  addHover: () => 'addHover',
  PaginationRow: 'PaginationRow',
  AddTaskIconContainer: 'AddTaskIconContainer',
  AddTaskIcon: 'AddTaskIcon',
  AddTaskContent: 'AddTaskContent',
  AddTaskText: 'AddTaskText',
  AddTaskButtonBase: 'AddTaskButtonBase',
  FormItem: 'FormItem',
  FormLabel: 'FormLabel',
  DependentSelectLabel: 'DependentSelectLabel',
  FormError: 'FormError',
  FormInput: 'FormInput',
  FormDateInput: 'FormDateInput',
  FormTimeInput: 'FormTimeInput',
  FormTextArea: 'FormTextArea',
  FormCheckBoxWrapper: 'FormCheckBoxWrapper',
  FormCheckbox: 'FormCheckbox',
  FormMixedCheckbox: 'FormMixedCheckbox',
  FormSelectWrapper: 'FormSelectWrapper',
  FormSelect: 'FormSelect',
  FormOption: 'FormOption',
  CategoryCheckbox: 'CategoryCheckbox',
  CategoryCheckboxLabel: 'CategoryCheckboxLabel',
  CategoryCheckboxField: 'CategoryCheckboxField',
  TaskCanvasOverride: 'TaskCanvasOverride',
  PopoverText: 'PopoverText',
  CannedResponsesContainer: 'CannedResponsesContainer',
  Bold: 'Bold',
  StyledBackButton: 'StyledBackButton',
  UploadFileLabel: 'UploadFileLabel',
  UploadFileFileName: 'UploadFileFileName',
}));

jest.mock('../styles/search', () => ({
  ConfirmContainer: 'ConfirmContainer',
  BackIcon: 'BackIcon',
  ContactWrapper: 'ContactWrapper',
  ConnectIcon: 'ConnectIcon',
  ContactButtonsWrapper: 'ContactButtonsWrapper',
  StyledLink: 'StyledLink',
  ContactTag: 'ContactTag',
  ConfirmText: 'ConfirmText',
  CancelButton: 'CancelButton',
  SilentText: 'SilentText',
  PrevNameText: 'PrevNameText',
  SummaryText: 'SummaryText',
  ShortSummaryText: 'ShortSummaryText',
  CounselorText: 'CounselorText',
  CaseFooter: 'CaseFooter',
  CaseFooterText: 'CaseFooterText',
  DateText: 'DateText',
  TagsWrapper: 'TagsWrapper',
  TagText: 'TagText',
  TagMiddleDot: 'TagMiddleDot',
  ContactDetailsIcon: () => 'ContactDetailsIcon',
  DetailsContainer: 'DetailsContainer',
  SectionTitleContainer: 'SectionTitleContainer',
  SectionTitleButton: 'SectionTitleButton',
  SectionCollapse: 'SectionCollapse',
  BackText: 'BackText',
  DetNameText: 'DetNameText',
  SectionTitleText: 'SectionTitleText',
  SectionDescriptionText: 'SectionDescriptionText',
  SectionValueText: 'SectionValueText',
  ResultsHeader: 'ResultsHeader',
  ListContainer: 'ListContainer',
  ScrollableList: 'ScrollableList',
  StyledButtonBase: 'StyledButtonBase',
  StyledFormControlLabel: 'StyledFormControlLabel',
  StyledSwitch: 'StyledSwitch',
  SwitchLabel: 'SwitchLabel',
  StyledLink: 'StyledLink',
  StyledTabs: 'StyledTabs',
  StyledResultsContainer: 'StyledResultsContainer',
  StyledResultsText: 'StyledResultsText',
  StyledTabLabel: 'StyledTabLabel',
  StyledFolderIcon: 'StyledFolderIcon',
  BoldText: 'BoldText',
  SearchResults: 'SearchResults',
  CaseHeaderContainer: 'CaseHeaderContainer',
  CaseHeaderCaseId: 'CaseHeaderCaseId',
  CaseHeaderChildName: 'CaseHeaderChildName',
  CaseSummaryContainer: 'CaseSummaryContainer',
  CaseWrapper: 'CaseWrapper',
  SearchTitle: 'SearchTitle',
  StandaloneSearchContainer: 'StandaloneSearchContainer',
  StyledCount: 'StyledCount',
  StyledContactResultsHeader: 'StyledContactResultsHeader',
  StyledCaseResultsHeader: 'StyledCaseResultsHeader',
}));

jest.mock('../styles/callTypeButtons', () => ({
  Container: 'Container',
  Label: 'Label',
  DataCallTypeButton: 'DataCallTypeButton',
  NonDataCallTypeButton: 'NonDataCallTypeButton',
  CloseTaskDialog: 'CloseTaskDialog',
  CloseTaskDialogText: 'CloseTaskDialogText',
  ConfirmButton: 'ConfirmButton',
  CancelButton: 'CancelButton',
  CloseButton: 'CloseButton',
  NonDataCallTypeDialogContainer: 'NonDataCallTypeDialogContainer',
}));

jest.mock('../styles/queuesStatus', () => ({
  Container: 'Container',
  HeaderContainer: 'HeaderContainer',
  QueuesContainer: 'QueuesContainer',
  QueueName: 'QueueName',
  ChannelColumn: 'ChannelColumn',
  ChannelBox: 'ChannelBox',
  ChannelLabel: 'ChannelLabel',
  WaitTimeLabel: 'WaitTimeLabel',
  WaitTimeValue: 'WaitTimeValue',
}));

jest.mock('../styles/case', () => ({
  CaseContainer: 'CaseContainer',
  CaseActionContainer: 'CaseActionContainer',
  CaseActionFormContainer: 'CaseActionFormContainer',
  CaseAddButton: 'CaseAddButton',
  CenteredContainer: 'CenteredContainer',
  CaseSectionFont: 'CaseSectionFont',
  ViewButton: 'ViewButton',
  CaseAddButtonFont: 'CaseAddButtonFont',
  CaseActionTitle: 'CaseActionTitle',
  CaseActionDetailFont: 'CaseActionDetailFont',
  BaseTextArea: 'BaseTextArea',
  TimelineRow: 'TimelineRow',
  TimelineDate: 'TimelineDate',
  TimelineText: 'TimelineText',
  InformationBoldText: 'InformationBoldText',
  PlaceHolderText: 'PlaceHolderText',
  TimelineIconContainer: 'TimelineIconContainer',
  CaseSummaryTextArea: 'CaseSummaryTextArea',
  RowItemContainer: 'RowItemContainer',
  NoteContainer: 'NoteContainer',
  DetailsContainer: 'DetailsContainer',
  DetailEntryText: 'DetailEntryText',
  DetailDescription: 'DetailDescription',
  DetailsHeaderChildName: 'DetailsHeaderChildName',
  DetailsHeaderCaseContainer: 'DetailsHeaderCaseContainer',
  DetailsHeaderCaseId: 'DetailsHeaderCaseId',
  DetailsHeaderOfficeName: 'DetailsHeaderOfficeName',
  StyledInputField: 'StyledInputField',
  StyledSelectWrapper: 'StyledSelectWrapper',
  StyledSelectField: 'StyledSelectField',
  TimelineFileName: 'TimelineFileName',
}));

jest.mock('../styles/previousContactsBanner', () => ({
  YellowBanner: 'YellowBanner',
}));
