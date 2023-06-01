import { Action, ScrollPosition, TimelineMark } from '@animato/types'
import { MAX_ZOOM, REM_TO_PX_COEFFICIENT, TIMELINE_PADDING } from '@animato/constants'
import generateTimelineMarks from '@animato/utils/generateTimelineMarks'
import { actionTypes } from './actions'

export type EditorState = {
  isPlaying: boolean;
  isRepeatMode: boolean;
  hoveredElementId: string | null;
  selectedElementIds: string[];
  currentTime: number;
  timelineWidth: number;
  scrollPosition: ScrollPosition;
  zoom: number;
  timelineMarks: TimelineMark[];
  collapsedElements: string[];
  collapsedAnimations: string[];
}

const timelinePaddingPx = TIMELINE_PADDING * REM_TO_PX_COEFFICIENT
const timelineMarks = generateTimelineMarks(MAX_ZOOM)
const markSize = timelineMarks[1].position - timelineMarks[0].position
const timelineWidth = timelineMarks.length * markSize + 2 * timelinePaddingPx

export const initialEditorState: EditorState = {
  isPlaying: false,
  isRepeatMode: false,
  hoveredElementId: null,
  selectedElementIds: [],
  currentTime: 0,
  timelineWidth,
  scrollPosition: { top: 0, left: 0 },
  zoom: MAX_ZOOM,
  timelineMarks,
  collapsedElements: [],
  collapsedAnimations: [],
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
    case actionTypes.HOVER_ELEMENT:
      return {
        ...state,
        hoveredElementId: action.payload!.id,
      }
    case actionTypes.SELECT_ELEMENT:
      return {
        ...state,
        selectedElementIds: [...state.selectedElementIds, action.payload!.id],
      }
    case actionTypes.DESELECT_ELEMENT:
      return {
        ...state,
        selectedElementIds: state.selectedElementIds.filter(id => id !== action.payload!.id),
      }
    case actionTypes.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload!.value,
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
      const zoom = action.payload!.value
      const timelineMarks = generateTimelineMarks(zoom)
      const markSize = timelineMarks[1].position - timelineMarks[0].position
      const timelineWidth = timelineMarks.length * markSize + 2 * timelinePaddingPx
      return {
        ...state,
        zoom,
        timelineMarks,
        timelineWidth,
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
    case actionTypes.COLLAPSE_ANIMATION:
      return {
        ...state,
        collapsedAnimations: [...state.collapsedAnimations, action.payload!.id],
      }
    case actionTypes.EXPAND_ANIMATION:
      return {
        ...state,
        collapsedAnimations: state.collapsedAnimations.filter(id => id !== action.payload!.id),
      }
    default:
      return state
  }
}
