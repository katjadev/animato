import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import Timeline from '../Timeline'

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn(),
}))

const defaultState = {
  isRepeatMode: false,
  currentTime: 0,
  scrollPosition: {
    left: 0,
    top: 0,
  },
  zoom: 1,
  timelineWidth: 4848,
  timelineMarks: [
    { position: 0, height: 10, title: '0s', time: 0 },
    { position: 16, height: 10, title: '1s', time: 1000 },
    { position: 32, height: 10, title: '2s', time: 2000 },
    { position: 48, height: 10, title: '3s', time: 3000 },
    { position: 64, height: 10, title: '4s', time: 4000 },
    { position: 96, height: 10, title: '5s', time: 5000 },
  ],
}

const translations = {}

describe('Timeline', () => {
  beforeEach(() => {
    useEditorState.mockReturnValue({
      state: defaultState,
      actions: {
        setZoom: jest.fn(),
        setCurrentTime: jest.fn(),
      },
    })
  })

  it('renders correctly', () => {
    render(<Timeline duration={0} translations={translations} />)

    expect(screen.getByText('0s')).toBeInTheDocument()
    expect(screen.getByText('1s')).toBeInTheDocument()
    expect(screen.getByText('2s')).toBeInTheDocument()
  })

  it('calls setZoom with decreased value when wheel event occurs with deltaY > 0', () => {
    const mockSetZoom = jest.fn()
    useEditorState.mockReturnValue({
      state: { ...defaultState, zoom: 60 },
      actions: { setZoom: mockSetZoom },
    })

    render(<Timeline duration={0} translations={translations} />)

    const timeline = screen.getByTestId('timeline')
    fireEvent.wheel(timeline, { deltaY: 1 })

    expect(mockSetZoom).toHaveBeenCalledWith({ value: 59 })
  })

  it('calls setZoom with increased value when wheel event occurs with deltaY < 0', () => {
    const mockSetZoom = jest.fn()
    useEditorState.mockReturnValue({
      state: { ...defaultState, zoom: 30 },
      actions: { setZoom: mockSetZoom },
    })

    render(<Timeline duration={0} translations={translations} />)

    const timeline = screen.getByTestId('timeline')
    fireEvent.wheel(timeline, { deltaY: -1 })

    expect(mockSetZoom).toHaveBeenCalledWith({ value: 31 })
  })

  it('calls setCurrentTime when clicked on the timeline', () => {
    const mockSetCurrentTime = jest.fn()
    useEditorState.mockReturnValue({
      state: defaultState,
      actions: { setCurrentTime: mockSetCurrentTime },
    })

    render(<Timeline duration={0} translations={translations} />)

    const timeline = screen.getByTestId('timeline')
    fireEvent.click(timeline, { clientX: 35 + 16 }) // 16 = timeline padding

    expect(mockSetCurrentTime).toHaveBeenCalledWith({ value: 2000 })
  })

  it('calls setCurrentTime when timeline pointer is moved', () => {
    const mockSetCurrentTime = jest.fn()
    useEditorState.mockReturnValue({
      state: defaultState,
      actions: { setCurrentTime: mockSetCurrentTime },
    })

    render(<Timeline duration={0} translations={translations} />)

    const pointer = screen.getByRole('slider')
    fireEvent.keyDown(pointer, { key: 'ArrowRight' })

    expect(mockSetCurrentTime).toHaveBeenCalledWith({ value: 1000 })
  })

  it('adds the correct name to the duration mark when isRepeatMode is true', () => {
    useEditorState.mockReturnValue({
      state: { ...defaultState, isRepeatMode: true },
      actions: {},
    })

    render(<Timeline duration={0} translations={translations} />)

    const durationMark = screen.getByTestId('timeline-duration-mark')

    expect(durationMark).toHaveClass('repeatMode')
  })
})
