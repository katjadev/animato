import { Action, ScrollPosition, TimelineMark } from '@animato/types'
import { actionTypes } from './actions'
import { MAX_ZOOM } from '@animato/constants';
import generateTimelineMarks from '@animato/utils/generateTimelineMarks';

export type EditorState = {
  isPlaying: boolean;
  isRepeatMode: boolean;
  selectedElementId: string | null;
  currentTime: number;
  timelineWidth: number;
  scrollPosition: ScrollPosition;
  zoom: number;
  timelineMarks: TimelineMark[];
  collapsedElements: string[];
}

export const initialEditorState: EditorState = {
  isPlaying: false,
  isRepeatMode: false,
  selectedElementId: null,
  currentTime: 0,
  timelineWidth: 0,
  scrollPosition: { top: 0, left: 0 },
  zoom: MAX_ZOOM,
  timelineMarks: generateTimelineMarks(MAX_ZOOM),
  collapsedElements: [],
}

export const editorReducer = (state: EditorState, action: Action) => {
  switch (action.type) {
    case actionTypes.START_PLAYING:
      return {
        ...state,
        isPlaying: true,
      }
    case actionTypes.STOP_PLAYING:
      return {
        ...state,
        isPlaying: false,
      }
    case actionTypes.TOGGLE_REPEAT_MODE:
      return {
        ...state,
        isRepeatMode: !state.isRepeatMode,
      }
    case actionTypes.SELECT_ELEMENT:
      return {
        ...state,
        selectedElementId: action.payload!.id,
      }
    case actionTypes.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload!.time,
      }
    case actionTypes.SET_TIMELINE_WIDTH:
      return {
        ...state,
        timelineWidth: action.payload!.width,
      }
    case actionTypes.SET_SCROLL_POSITION:
      return {
        ...state,
        scrollPosition: action.payload!.value,
      }
    case actionTypes.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload!.value,
      }
    case actionTypes.COLLAPSE_ELEMENT:
      return {
        ...state,
        collapsedElements: [...state.collapsedElements, action.payload!.id],
      }
    case actionTypes.EXPAND_ELEMENT:
      return {
        ...state,
        collapsedElements: state.collapsedElements.filter(id => id !== action.payload!.id),
      }
    default:
      return state
  }
}
