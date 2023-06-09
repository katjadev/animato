import { Dispatch } from 'react'
import { Action } from '@animato/types'

export const actionTypes = {
  SAVING_START: 'SAVING_START',
  SAVING_SUCCESS: 'SAVING_SUCCESS',
  SAVING_ERROR: 'SAVING_ERROR',
  RENAME_PROJECT: 'RENAME_PROJECT',
  UNDO: 'UNDO',
  REDO: 'REDO',
  RENAME_ELEMENT: 'RENAME_ELEMENT',
  IMPORT_SVG: 'IMPORT_SVG',
}

export const projectActions = (dispatch: Dispatch<Action>) => (
  {
    renameProject: (payload: { title: string }) => dispatch({ type: actionTypes.RENAME_PROJECT, payload }),
    undo: () => dispatch({ type: actionTypes.UNDO }),
    redo: () => dispatch({ type: actionTypes.REDO }),
    savingStart: () => dispatch({ type: actionTypes.SAVING_START }),
    savingSuccess: () => dispatch({ type: actionTypes.SAVING_SUCCESS }),
    savingError: () => dispatch({ type: actionTypes.SAVING_ERROR }),
    renameElement: (payload: { id: string; value: string }) => dispatch({ type: actionTypes.RENAME_ELEMENT, payload }),
    importSvg: (payload: { data: string }) => dispatch({ type: actionTypes.IMPORT_SVG, payload }),
  }
)
