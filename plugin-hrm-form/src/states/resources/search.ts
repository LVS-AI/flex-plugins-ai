import { createAction, createAsyncAction, createReducer } from 'redux-promise-middleware-actions';

import { ReferrableResource, searchResources } from '../../services/ResourceService';

export type SearchSettings = Partial<ReferrableResourceSearchState['parameters']>;

export type ReferrableResourceResult = ReferrableResource;

export enum ResourceSearchStatus {
  NotSearched,
  ResultPending,
  ResultReceived,
  Error,
}

export type ReferrableResourceSearchState = {
  // eslint-disable-next-line prettier/prettier
  parameters: {
    omniSearchTerm: string;
    filters: Record<string, any>;
    limit: number;
  };
  currentPage: number;
  suggesters: Record<string, string[]>;
  results: ReferrableResourceResult[];
  status: ResourceSearchStatus;
  error?: Error;
};

export const initialState: ReferrableResourceSearchState = {
  parameters: {
    filters: {},
    omniSearchTerm: '',
    limit: 5,
  },
  currentPage: 0,
  suggesters: {},
  status: ResourceSearchStatus.NotSearched,
  results: [],
};

export const CHANGE_SEARCH_RESULT_PAGE_ACTION = 'resource-action/change-search-result-page';

export const changeResultPageAction = createAction(CHANGE_SEARCH_RESULT_PAGE_ACTION, (page: number) => ({
  page,
}));

export const UPDATE_SEARCH_FORM_ACTION = 'resource-action/update-search-form';

export const updateSearchFormAction = createAction(
  UPDATE_SEARCH_FORM_ACTION,
  (parameters: SearchSettings) => parameters,
);

export const RETURN_TO_SEARCH_FORM_ACTION = 'resource-action/return-to-search-form';

export const returnToSearchFormAction = createAction(RETURN_TO_SEARCH_FORM_ACTION);

export const SEARCH_ACTION = 'resource-action/search';

export const searchResourceAsyncAction = createAsyncAction(
  SEARCH_ACTION,
  async (parameters: SearchSettings, page: number) => {
    const { limit, omniSearchTerm } = parameters;
    const [nameSubstring, ...ids] = omniSearchTerm.split(';');
    const start = page * limit;
    return { ...(await searchResources({ nameSubstring, ids }, start, limit)), start };
  },
  ({ limit }: SearchSettings, page: number, newSearch: boolean = true) => ({ newSearch, start: page * limit }),
  // { promiseTypeDelimiter: '/' }, // Doesn't work :-(
);

export const resourceSearchReducer = createReducer(initialState, handleAction => [
  handleAction(searchResourceAsyncAction.pending as typeof searchResourceAsyncAction, (state, action) => {
    return {
      ...state,
      results: action.meta.newSearch ? [] : state.results,
      status: ResourceSearchStatus.ResultPending,
    };
  }),
  handleAction(searchResourceAsyncAction.fulfilled, (state, { payload }) => {
    // If total number of results changes for any reason, assume result set is stale & clear it out
    const fullResults =
      payload.totalCount === state.results.length ? state.results : new Array(payload.totalCount).fill(null);
    fullResults.splice(payload.start, payload.results.length, ...payload.results);
    return {
      ...state,
      status: ResourceSearchStatus.ResultReceived,
      results: fullResults,
    };
  }),
  handleAction(searchResourceAsyncAction.rejected, (state, { payload }) => {
    return {
      ...state,
      status: ResourceSearchStatus.Error,
      error: payload,
    };
  }),
  handleAction(updateSearchFormAction, (state, { payload }) => {
    return {
      ...state,
      parameters: { ...state.parameters, ...payload },
    };
  }),
  handleAction(changeResultPageAction, (state, { payload: { page } }) => {
    return {
      ...state,
      currentPage: page,
    };
  }),
  handleAction(returnToSearchFormAction, state => {
    return {
      ...state,
      status: ResourceSearchStatus.NotSearched,
      currentPage: 0,
    };
  }),
]);

export const getCurrentPageResults = ({ results, currentPage, parameters: { limit } }: ReferrableResourceSearchState) =>
  results.slice(currentPage * limit, (currentPage + 1) * limit);

export const getPageCount = ({ results, parameters: { limit } }: ReferrableResourceSearchState) =>
  Math.ceil(results.length / limit);
