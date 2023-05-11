import { Dispatch } from 'react'
import { Action, Project } from '@animato/types'

export const actionTypes = {
  LOAD_PROJECTS_SUCCESS: 'LOAD_PROJECTS_SUCCESS',
  LOAD_PROJECTS_FAILURE: 'LOAD_PROJECTS_FAILURE',
  DELETE_PROJECT: 'DELETE_PROJECT',
}

export const projectsActions = (dispatch: Dispatch<Action>) => ({
  loadProjectsSuccess: (projects: Project[]) => dispatch({ type: actionTypes.LOAD_PROJECTS_SUCCESS, payload: { projects } }),
  loadProjectsFailure: () => dispatch({ type: actionTypes.LOAD_PROJECTS_FAILURE }),
  deleteProject: (id: string) => dispatch({ type: actionTypes.DELETE_PROJECT, payload: { id } }),
})
