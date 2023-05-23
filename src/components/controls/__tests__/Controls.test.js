import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { useEditorState } from '@animato/components/editor/EditorContextProvider'
import Controls from '../Controls'

jest.mock('@animato/components/editor/EditorContextProvider', () => ({
  useEditorState: jest.fn(),
}))

const translations = {
  restart: 'Restart',
  play: 'Play',
  pause: 'Pause',
  repeat: 'Repeat',
}

describe('Controls', () => {
  beforeEach(() => {
    useEditorState.mockReturnValue({
      state: {
        isPlaying: false,
        isRepeatMode: false,
        currentTime: 0,
      },
      actions: {
        setCurrentTime: jest.fn(),
        startPlaying: jest.fn(),
        stopPlaying: jest.fn(),
        toggleRepeatMode: jest.fn(),
      },
    })
  })

  it('renders correctly', () => {
    render(<Controls translations={translations} />)

    expect(screen.getByLabelText(translations.restart)).toBeInTheDocument()
    expect(screen.getByLabelText(translations.play)).toBeInTheDocument()
    expect(screen.getByLabelText(translations.repeat)).toBeInTheDocument()
  })

  it('disables restart button when currentTime is 0', () => {
    render(<Controls translations={translations} />)

    const restartButton = screen.getByLabelText(translations.restart)

    expect(restartButton).toHaveAttribute('aria-disabled', "true")
  })

  it('calls setCurrentTime with 0 when restart button is clicked', () => {
    const mockSetCurrentTime = jest.fn()
    useEditorState.mockReturnValue({
      state: {
        isPlaying: false,
        isRepeatMode: false,
        currentTime: 1000,
      },
      actions: { setCurrentTime: mockSetCurrentTime },
    })

    render(<Controls translations={translations} />)

    const restartButton = screen.getByLabelText(translations.restart)
    fireEvent.click(restartButton)

    expect(mockSetCurrentTime).toHaveBeenCalledWith({ value: 0 })
  })

  it('calls startPlaying when play button is clicked', () => {
    const mockStartPlaying = jest.fn()
    useEditorState.mockReturnValue({
      state: {
        isPlaying: false,
        isRepeatMode: false,
        currentTime: 1000,
      },
      actions: { startPlaying: mockStartPlaying },
    })

    render(<Controls translations={translations} />)

    const playButton = screen.getByLabelText(translations.play)
    fireEvent.click(playButton)

    expect(mockStartPlaying).toHaveBeenCalled()
  })

  it('calls stopPlaying when pause button is clicked', () => {
    const mockStopPlaying = jest.fn()
    useEditorState.mockReturnValue({
      state: {
        isPlaying: true,
        isRepeatMode: false,
        currentTime: 0,
      },
      actions: { stopPlaying: mockStopPlaying },
    })

    render(<Controls translations={translations} />)

    const pauseButton = screen.getByLabelText(translations.pause)
    fireEvent.click(pauseButton)

    expect(mockStopPlaying).toHaveBeenCalled()
  })

  it('calls toggleRepeatMode when repeat button is clicked', () => {
    const mockToggleRepeatMode = jest.fn()
    useEditorState.mockReturnValue({
      state: {
        isPlaying: true,
        isRepeatMode: false,
        currentTime: 0,
      },
      actions: { toggleRepeatMode: mockToggleRepeatMode },
    })

    render(<Controls translations={translations} />)

    const repeatButton = screen.getByLabelText(translations.repeat)
    fireEvent.click(repeatButton)

    expect(mockToggleRepeatMode).toHaveBeenCalled()
  })

  it('toogle className in the repeat button when isRepeat is true', () => {
    useEditorState.mockReturnValue({
      state: {
        isPlaying: false,
        isRepeatMode: true,
        currentTime: 0,
      },
      actions: {},
    })

    render(<Controls translations={translations} />)

    const repeatButton = screen.getByLabelText(translations.repeat)

    expect(repeatButton).toHaveClass('activeButton')
  })
})
