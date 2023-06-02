import { Dispatch } from 'react'
import { Action } from '@animato/types'

export const actionTypes = {
  START_PLAYING: 'START_PLAYING',
  STOP_PLAYING: 'STOP_PLAYING',
  TOGGLE_REPEAT_MODE: 'TOGGLE_REPEAT_MODE',
  HOVER_ELEMENT: 'HOVER_ELEMENT',
  TOGGLE_ELEMENT: 'TOGGLE_ELEMENT',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_TIMELINE_WIDTH: 'SET_TIMELINE_WIDTH',
  SET_SCROLL_POSITION: 'SET_SCROLL_POSITION',
  SET_ZOOM: 'SET_ZOOM',
  COLLAPSE_ELEMENT: 'COLLAPSE_ELEMENT',
  EXPAND_ELEMENT: 'EXPAND_ELEMENT',
  COLLAPSE_ANIMATION: 'COLLAPSE_ANIMATION',
  EXPAND_ANIMATION: 'EXPAND_ANIMATION',
}

export const editorActions = (dispatch: Dispatch<Action>) => (
  {
    startPlaying: () => dispatch({ type: actionTypes.START_PLAYING }),
    stopPlaying: () => dispatch({ type: actionTypes.STOP_PLAYING }),
    toggleRepeatMode: () => dispatch({ type: actionTypes.TOGGLE_REPEAT_MODE }),
    hoverElement: (payload: { id: string | null }) => dispatch({ type: actionTypes.HOVER_ELEMENT, payload }),
    toggleElement: (payload: { id: string, multiple?: boolean }) => dispatch({ type: actionTypes.TOGGLE_ELEMENT, payload }),
    setCurrentTime: (payload: { value: number }) => dispatch({ type: actionTypes.SET_CURRENT_TIME, payload }),
    setTimelineWidth: (payload: { width: number }) => dispatch({ type: actionTypes.SET_TIMELINE_WIDTH, payload }),
    setScrollPosition: (payload: { value: number }) => dispatch({ type: actionTypes.SET_SCROLL_POSITION, payload }),
    setZoom: (payload: { value: number }) => dispatch({ type: actionTypes.SET_ZOOM, payload }),
    collapseElement: (payload: { id: string }) => dispatch({ type: actionTypes.COLLAPSE_ELEMENT, payload }),
    expandElement: (payload: { id: string }) => dispatch({ type: actionTypes.EXPAND_ELEMENT, payload }),
    collapseAnimation: (payload: { id: string }) => dispatch({ type: actionTypes.COLLAPSE_ANIMATION, payload }),
    expandAnimation: (payload: { id: string }) => dispatch({ type: actionTypes.EXPAND_ANIMATION, payload }),
  }
)
