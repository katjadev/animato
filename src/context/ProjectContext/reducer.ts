import { v4 as uuidv4 } from 'uuid'
import { Action, AnimationGroup, ElementTreeNode } from '@animato/types'
import { actionTypes } from './actions'
import updateElementById from '@animato/utils/updateElement'
import generateProjectData from '@animato/utils/generateProjectData'
import parseProjectData from '@animato/utils/parseProjectData'

export type HistoryItem = {
  id: string;
  title: string;
  data: string;
}

export type ProjectState = {
  id: string;
  title: string;
  data: string;
  elements: ElementTreeNode[];
  animations: AnimationGroup[];
  duration: number;
  saving: boolean;
  savingError: boolean;
  undoableHistory: HistoryItem[];
  redoableHistory: HistoryItem[];
}

export const initialProjectState: ProjectState = {
  id: '',
  title: '',
  data: '',
  elements: [],
  animations: [],
  duration: 0,
  saving: false,
  savingError: false,
  undoableHistory: [],
  redoableHistory: [],
}

export const projectReducer = (state: ProjectState, action: Action) => {
  switch (action.type) {
    case actionTypes.RENAME_PROJECT:
      return {
        ...state,
        title: action.payload!.title,
        undoableHistory: [...state.undoableHistory, { id: uuidv4(), title: state.title, data: state.data }],
      }
    case actionTypes.UNDO: {
      const undoItem = state.undoableHistory[state.undoableHistory.length - 1]
      const { elements, animations, duration } = parseProjectData(undoItem.data)

      return {
        ...state,
        title: undoItem.title,
        data: undoItem.data,
        elements,
        animations,
        duration,
        undoableHistory: state.undoableHistory.filter(item => item.id !== undoItem.id),
        redoableHistory: [...state.redoableHistory, { id: uuidv4(), title: state.title, data: state.data }],
      }
    }
    case actionTypes.REDO: {
      const redoItem = state.redoableHistory[state.redoableHistory.length - 1]
      const { elements, animations, duration } = parseProjectData(redoItem.data)
      
      return {
        ...state,
        title: redoItem.title,
        data: redoItem.data,
        elements,
        animations,
        duration,
        undoableHistory: [...state.undoableHistory, { id: uuidv4(), title: state.title, data: state.data }],
        redoableHistory: state.redoableHistory.filter(item => item.id !== redoItem.id),
      }
    }
    case actionTypes.SAVING_START:
      return {
        ...state,
        saving: true,
        savingError: false,
      }
    case actionTypes.SAVING_SUCCESS:
      return {
        ...state,
        saving: false,
        savingError: false,
      }
    case actionTypes.SAVING_ERROR:
      return {
        ...state,
        saving: false,
        savingError: true,
      }
    case actionTypes.RENAME_ELEMENT: {
      const elements = updateElementById(state.elements, action.payload?.id, { title: action.payload?.value })
      const data = generateProjectData(state.data, elements)

      return {
        ...state,
        elements: elements,
        data,
        undoableHistory: [...state.undoableHistory, { id: uuidv4(), title: state.title, data: state.data }],
      }
    }
    case actionTypes.IMPORT_SVG:
      const { elements, animations, duration } = parseProjectData(action.payload!.data)

      return {
        ...state,
        data: action.payload!.data,
        elements,
        animations,
        duration,
        undoableHistory: [...state.undoableHistory, { id: uuidv4(), title: state.title, data: state.data }],
      }
    default:
      return state
  }
}
