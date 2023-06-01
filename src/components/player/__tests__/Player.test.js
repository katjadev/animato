import React from 'react'
import { render, screen } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import Player from '../Player'

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => {
  const defaultContextValue = {
    state: {
      isPlaying: false,
      isRepeatMode: false,
      currentTime: 0,
    },
    actions: {
      setCurrentTime: jest.fn(),
      stopPlaying: jest.fn(),
      startPlaying: jest.fn(),
      toggleRepeatMode: jest.fn(),
    },
  }

  return {
    useEditorState: jest.fn(() => defaultContextValue),
  }
})

const TEST_SVG = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" role="image">
  <rect id="test-element-1" />
  <circle id="test-element-2" data-title="custom-title" />
  <circle />
  <animate xlink:href="#test-element-1" data-title="color" id="test-color-animation" attributeName="fill" values="#02122e; #2f61a6; #8be0f9; #8be0f9; #02122e" keyTimes="0; 0.25; 0.5; 0.75; 1" dur="10s"/>
  <animateTransform xlink:href="#test-element-2" data-title="scale" id="test-scale-animation" attributeName="transform" type="scale" values="0.5; 1.5; 0.5" keyTimes="0; 0.5; 1" dur="10s"/>
</svg>`

jest.mock('@animato/context/ProjectContext/ProjectContextProvider', () => {
  const defaultContextValue = {
    state: { data: TEST_SVG, duration: 10 },
    actions: {},
  }

  return {
    useProjectState: jest.fn(() => defaultContextValue),
  }
})

describe('Player', () => {
  it('renders PlayerSVG with correct props', () => {
    render(<Player />)

    const svg = screen.getByRole('image')
    expect(svg).toBeInTheDocument()
  })

  it('starts playing animation and sets timeout when isPlaying is true', () => {
    const mockUnpauseAnimation = jest.fn()
    HTMLDivElement.prototype.querySelector = jest.fn().mockReturnValue({ 
      unpauseAnimations: mockUnpauseAnimation,
      querySelectorAll: jest.fn().mockReturnValue([]),
    })
    jest.spyOn(global, 'setTimeout')
    useEditorState.mockImplementation(() => ({
      state: {
        isPlaying: true,
        isRepeatMode: false,
        currentTime: 0,
      },
      actions: {},
    }))

    render(<Player />)

    expect(mockUnpauseAnimation).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  it('pauses animation and clears timeout when isPlaying is false', () => {
    const mockPauseAnimation = jest.fn()
    HTMLDivElement.prototype.querySelector = jest.fn()
      .mockReturnValue({ 
        pauseAnimations: mockPauseAnimation,
        querySelectorAll: jest.fn().mockReturnValue([]),
      })

    jest.spyOn(global, 'clearTimeout')

    useEditorState.mockImplementation(() => ({
      state: {
        isPlaying: false,
        isRepeatMode: false,
        currentTime: 0,
      },
      actions: {},
    }))

    render(<Player />)

    expect(mockPauseAnimation).toHaveBeenCalledTimes(1)
    expect(clearTimeout).toHaveBeenCalledTimes(1)
  })

  it('sets current time and updates isPlaying when duration is reached and not in repeat mode', () => {
    const mockSetCurrentTime = jest.fn()
    const mockStopPlaying = jest.fn()
    HTMLDivElement.prototype.querySelector = jest.fn()
      .mockReturnValue({ 
        querySelectorAll: jest.fn().mockReturnValue([]),
      })

    useEditorState.mockImplementation(() => ({
      state: {
        isPlaying: true,
        isRepeatMode: false,
        currentTime: 0,
      },
      actions: {
        setCurrentTime: mockSetCurrentTime,
        stopPlaying: mockStopPlaying,
      },
    }))

    jest.useFakeTimers()

    render(<Player />)

    jest.advanceTimersByTime(10101)

    expect(mockSetCurrentTime).toHaveBeenLastCalledWith({ value: 0 })
    expect(mockStopPlaying).toHaveBeenCalledTimes(1)
  })

  it('resets current time and continues playing when duration is reached and in repeat mode', () => {
    const mockSetCurrentTime = jest.fn()
    const mockStopPlaying = jest.fn()
    HTMLDivElement.prototype.querySelector = jest.fn()
      .mockReturnValue({ 
        querySelectorAll: jest.fn().mockReturnValue([]),
      })

    useEditorState.mockImplementation(() => ({
      state: {
        isPlaying: true,
        isRepeatMode: true,
        currentTime: 0,
      },
      actions: {
        setCurrentTime: mockSetCurrentTime,
        stopPlaying: mockStopPlaying,
      },
    }))

    jest.useFakeTimers()

    render(<Player />)

    jest.advanceTimersByTime(10101)

    expect(mockSetCurrentTime).toHaveBeenCalledWith({ value: 0 })
    expect(mockStopPlaying).toHaveBeenCalledTimes(0)
  })

  it('updates animation current time', () => {
    const mockSetCurrentTime = jest.fn()
    HTMLDivElement.prototype.querySelector = jest.fn()
      .mockReturnValue({ 
        setCurrentTime: mockSetCurrentTime,
        querySelectorAll: jest.fn().mockReturnValue([]),
      })

    useEditorState.mockImplementation(() => ({
      state: {
        isPlaying: false,
        isRepeatMode: true,
        currentTime: 300,
      },
      actions: {},
    }))

    render(<Player />)

    expect(mockSetCurrentTime).toHaveBeenCalledWith(0.3)
  })
})
