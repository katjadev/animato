import { Dispatch } from 'react'
import { Action } from '@animato/types'

export const actionTypes = {
  RENAME_PROJECT: 'RENAME_PROJECT',
  UNDO: 'UNDO',
  REDO: 'REDO',
}

export const projectActions = (dispatch: Dispatch<Action>) => (
  {
    renameProject: (payload: { title: string }) => dispatch({ type: actionTypes.RENAME_PROJECT, payload }),
    undo: () => dispatch({ type: actionTypes.UNDO }),
    redo: () => dispatch({ type: actionTypes.REDO }),
  }
)
