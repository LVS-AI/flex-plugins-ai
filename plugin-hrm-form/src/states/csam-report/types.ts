// Action types
export const UPDATE_FORM = 'csam-report/UPDATE_FORM';
export const UPDATE_STATUS = 'csam-report/UPDATE_STATUS';
export const CLEAR_CSAM_REPORT = 'csam-report/CLEAR_CSAM_REPORT';
export const SET_CSAM_TYPE = 'SET_CSAM_TYPE';

export type CounselorCSAMReportForm = {
  webAddress: string;
  description: string;
  anonymous: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type ChildCSAMReportForm = {
  childAge: string;
  ageVerified: boolean;
};

export type CSAMReportForm = ChildCSAMReportForm | CounselorCSAMReportForm;

export type CSAMReportStatus = {
  responseCode: string;
  responseData: string;
  responseDescription: string;
};

type UpdateFormAction = {
  type: typeof UPDATE_FORM;
  form: CSAMReportForm;
  taskId: string;
};

type UpdateStatusAction = {
  type: typeof UPDATE_STATUS;
  reportStatus: CSAMReportStatus;
  taskId: string;
};

type ClearCSAMReport = {
  type: typeof CLEAR_CSAM_REPORT;
  taskId: string;
};

type SetCSAMTypeAction = { type: typeof SET_CSAM_TYPE; csamType: 'self-report' | 'counsellor-report' };

export type CSAMReportActionType = UpdateFormAction | UpdateStatusAction | ClearCSAMReport | SetCSAMTypeAction;

export const isCounselorCSAMReportForm = (c: CSAMReportForm): c is CounselorCSAMReportForm => {
  return (c as CounselorCSAMReportForm) !== null;
};
