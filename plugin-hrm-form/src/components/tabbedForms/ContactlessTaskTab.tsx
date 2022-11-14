/* eslint-disable react/prop-types */
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FieldError, useFormContext } from 'react-hook-form';
import { isFuture } from 'date-fns';
import { get } from 'lodash';
import { useFlexSelector } from '@twilio/flex-ui';
import type { DefinitionVersion } from 'hrm-form-definitions';

import { createFormFromDefinition, disperseInputs } from '../common/forms/formGenerators';
import { updateForm } from '../../states/contacts/actions';
import { Container, ColumnarBlock, TwoColumnLayout, TabbedFormTabContainer } from '../../styles/HrmStyles';
import { configurationBase, namespace, RootState } from '../../states';
import { selectWorkerSid } from '../../states/selectors/flexSelectors';
import type { TaskEntry } from '../../states/contacts/reducer';
import { createContactlessTaskTabDefinition } from './ContactlessTaskTabDefinition';
import { splitDate, splitTime } from '../../utils/helpers';
import type { OfflineContactTask } from '../../types/types';
import useFocus from '../../utils/useFocus';

type OwnProps = {
  task: OfflineContactTask;
  display: boolean;
  helplineInformation: DefinitionVersion['helplineInformation'];
  definition: DefinitionVersion['tabbedForms']['ContactlessTaskTab'];
  initialValues: TaskEntry['contactlessTask'];
  autoFocus: boolean;
};

// eslint-disable-next-line no-use-before-define
type Props = OwnProps & ConnectedProps<typeof connector>;

const ContactlessTaskTab: React.FC<Props> = ({
  dispatch,
  display,
  task,
  helplineInformation,
  definition,
  initialValues,
  counselorsList,
  autoFocus,
}) => {
  const shouldFocusFirstElement = display && autoFocus;
  const firstElementRef = useFocus(shouldFocusFirstElement);

  const [initialForm] = React.useState(initialValues); // grab initial values in first render only. This value should never change or will ruin the memoization below

  const { getValues, register, setError, setValue, watch, errors } = useFormContext();

  const workerSid = useFlexSelector(selectWorkerSid);

  const contactlessTaskForm = React.useMemo(() => {
    const updateCallBack = () => {
      const { isFutureAux, ...rest } = getValues().contactlessTask;
      dispatch(updateForm(task.taskSid, 'contactlessTask', rest));
    };

    const formDefinition = createContactlessTaskTabDefinition({ counselorsList, helplineInformation, definition });

    // If no createdOnBehalfOf comming from state, we want the current counselor to be the default
    const createdOnBehalfOf = initialForm.createdOnBehalfOf || workerSid;
    const init = { ...initialForm, createdOnBehalfOf };

    const tab = createFormFromDefinition(formDefinition)(['contactlessTask'])(init, firstElementRef)(updateCallBack);

    return disperseInputs(5)(tab);
  }, [
    workerSid,
    counselorsList,
    helplineInformation,
    definition,
    initialForm,
    firstElementRef,
    getValues,
    dispatch,
    task.taskSid,
  ]);

  // Add invisible field that errors if date + time are future (triggered by validaiton)
  React.useEffect(() => {
    register('contactlessTask.isFutureAux', {
      validate: () => {
        const { contactlessTask } = getValues();
        const { date, time } = contactlessTask;
        if (date && time) {
          const [y, m, d] = splitDate(date);
          const [mm, hh] = splitTime(time);
          if (isFuture(new Date(y, m - 1, d, mm, hh))) {
            return 'TimeCantBeGreaterThanNow'; // return non-null to generate an error, using the localized error key
          }
        }

        return null;
      },
    });
  }, [getValues, register, setError]);

  // Replicate error in time if there is error in isFutureAux
  const isFutureError: FieldError = get(errors, 'contactlessTask.isFutureAux');
  React.useEffect(() => {
    if (isFutureError) setError('contactlessTask.time', { message: isFutureError.message, type: 'isFutureAux' });
  }, [isFutureError, setError]);

  const time = watch('contactlessTask.time');
  // Set isFutureAux (triggered by time onChange) so it's revalidated (this makes sense after 1st submission attempt)
  React.useEffect(() => {
    setValue('contactlessTask.isFutureAux', time, { shouldValidate: true });
  }, [setValue, time]);

  return (
    <Container>
      <TwoColumnLayout>
        <ColumnarBlock>{contactlessTaskForm}</ColumnarBlock>
        <ColumnarBlock />
      </TwoColumnLayout>
    </Container>
  );
};

ContactlessTaskTab.displayName = 'ContactlessTaskTab';

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  counselorsList: state[namespace][configurationBase].counselors.list,
});

const connector = connect(mapStateToProps);
const connected = connector(ContactlessTaskTab);

export default connected;
