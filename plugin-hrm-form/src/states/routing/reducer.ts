import { omit } from 'lodash';

import { AppRoutes, RoutingActionType, CHANGE_ROUTE } from './types';
import { GeneralActionType, INITIALIZE_CONTACT_STATE, RECREATE_CONTACT_STATE, REMOVE_CONTACT_STATE } from '../types';

export type RoutingState = {
  tasks: {
    [taskId: string]: AppRoutes;
  };
};

const initialState: RoutingState = {
  tasks: {},
};

const newTaskEntry = {
  route: 'select-call-type',
};

export function reduce(state = initialState, action: RoutingActionType | GeneralActionType) {
  switch (action.type) {
    case INITIALIZE_CONTACT_STATE: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: newTaskEntry,
        },
      };
    }
    case RECREATE_CONTACT_STATE: {
      if (state.tasks[action.taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: newTaskEntry,
        },
      };
    }
    case REMOVE_CONTACT_STATE:
      return {
        ...state,
        tasks: omit(state.tasks, action.taskId),
      };
    case CHANGE_ROUTE: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: action.routing,
        },
      };
    }
    default:
      return state;
  }
}
