import { v4 as uuidv4 } from 'uuid'
import { Action } from '@animato/types'
import { actionTypes } from './actions'

export type HistoryItem = {
  id: string;
  title: string;
  data: string;
}

export type ProjectState = {
  id: string;
  title: string;
  data: string;
  undoableHistory: HistoryItem[];
  redoableHistory: HistoryItem[];
}

export const initialProjectState: ProjectState = {
  id: '',
  title: '',
  data: '',
  undoableHistory: [],
  redoableHistory: []
}

export const projectReducer = (state: ProjectState, action: Action) => {
  switch (action.type) {
    case actionTypes.RENAME_PROJECT:
      return {
        ...state,
        title: action.payload!.title,
        undoableHistory: [...state.undoableHistory, { id: uuidv4(), title: state.title, data: state.data }],
      }
    case actionTypes.UNDO:
      const undoItem = state.undoableHistory[state.undoableHistory.length - 1]
      return {
        ...state,
        title: undoItem.title,
        data: undoItem.data,
        undoableHistory: state.undoableHistory.filter(item => item.id !== undoItem.id),
        redoableHistory: [...state.redoableHistory, undoItem],
      }
    case actionTypes.REDO:
      const redoItem = state.redoableHistory[state.redoableHistory.length - 1]
      return {
        ...state,
        title: redoItem.title,
        data: redoItem.data,
        undoableHistory: [...state.undoableHistory, redoItem],
        redoableHistory: state.redoableHistory.filter(item => item.id !== redoItem.id),
      }
    default:
      return state
  }
}
