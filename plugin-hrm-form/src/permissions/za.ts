export const canEditCaseSummary = (isSupervisor: boolean, isCreator: boolean, isCaseOpen: boolean) =>
  isSupervisor || (isCreator && isCaseOpen);

export const canReopenCase = (isSupervisor: boolean, isCreator: boolean, isCaseOpen: boolean) => isSupervisor;

export const canEditNote = (isSupervisor: boolean, isCreator: boolean, isCaseOpen: boolean) =>
  isSupervisor || (isCreator && isCaseOpen);

/**
 * For now, all the other actions are the same, and can use the below permission.
 */
export const canEditGenericField = (isSupervisor: boolean, isCreator: boolean, isCaseOpen: boolean) =>
  isSupervisor || (isCreator && isCaseOpen);
