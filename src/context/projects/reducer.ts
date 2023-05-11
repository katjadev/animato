import { Action } from '@animato/types';
import { ProjectsState } from './ProjectsContext';
import { actionTypes } from './actions';

export const projectsState = {
  projects: [],
  loading: true,
  error: false,
};

export const projectsReducer = (state: ProjectsState, action: Action) => {
  switch (action.type) {
    case actionTypes.LOAD_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: action.payload!.projects,
        error: false,
        loading: false,
      };
    case actionTypes.LOAD_PROJECTS_FAILURE:
      return {
        ...state,
        projects: [],
        error: true,
        loading: false,
      };
    case actionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload!.id),
      };
    default:
      return state;
  }
};