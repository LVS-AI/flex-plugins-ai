import { isFuture } from 'date-fns';
import { DefinitionVersion, FormDefinition, FormInputType } from 'hrm-form-definitions';

import { channelTypes } from '../../states/DomainConstants';
import { mapChannelForInsights } from '../../utils/mappers';
import { splitDate } from '../../utils/helpers';
import type { CounselorsList } from '../../states/configuration/types';

const defaultChannelOptions = [{ value: '', label: '' }].concat(
  Object.values(channelTypes).map(s => ({
    label: mapChannelForInsights(s),
    value: s,
  })),
);

export const createContactlessTaskTabDefinition = ({
  counselorsList,
  helplineInformation,
  definition,
}: {
  counselorsList: CounselorsList;
  helplineInformation: DefinitionVersion['helplineInformation'];
  definition: DefinitionVersion['tabbedForms']['ContactlessTaskTab'];
}): FormDefinition => {
  const counsellorOptions = [
    { label: '', value: '' },
    ...counselorsList.map(c => ({ label: c.fullName, value: c.sid })),
  ];

  const helplineLabel = helplineInformation.label;
  const mapHelplineEntriesToOptions = ({ value, label }) => ({ value, label });
  const helplineOptions = helplineInformation.helplines.map(mapHelplineEntriesToOptions);
  const defaultHelplineOption = (
    helplineInformation.helplines.find(helpline => helpline.default) || helplineInformation.helplines[0]
  ).value;

  const channelOptions = definition.offlineChannels
    ? defaultChannelOptions.concat(definition.offlineChannels.map(c => ({ value: c, label: c })))
    : defaultChannelOptions;

  return [
    {
      name: 'channel',
      type: FormInputType.Select,
      label: 'Channel',
      options: channelOptions,
      required: { value: true, message: 'RequiredFieldError' },
    },
    {
      name: 'createdOnBehalfOf',
      type: FormInputType.Select,
      label: 'Counsellor',
      options: counsellorOptions,
      // defaultOption: workerSid,
      required: { value: true, message: 'RequiredFieldError' },
    },
    {
      name: 'date',
      type: FormInputType.DateInput,
      label: 'Date of Contact',
      initializeWithCurrent: true,
      required: { value: true, message: 'RequiredFieldError' },
      validate: date => {
        const [y, m, d] = splitDate(date);
        const inputDate = new Date(y, m - 1, d);

        // Date is lesser than Unix epoch (00:00:00 UTC on 1 January 1970)
        if (inputDate.getTime() < 0) return 'DateCantBeLesserThanEpoch';

        // Date is greater than "today"
        if (isFuture(inputDate)) return 'DateCantBeGreaterThanToday';

        return null;
      },
    },
    {
      name: 'time',
      type: FormInputType.TimeInput,
      label: 'Time of Contact',
      initializeWithCurrent: true,
      required: { value: true, message: 'RequiredFieldError' },
    },
    {
      name: 'helpline',
      label: helplineLabel,
      type: FormInputType.Select,
      defaultOption: defaultHelplineOption,
      options: helplineOptions,
      required: { value: true, message: 'RequiredFieldError' },
    },
  ];
};
