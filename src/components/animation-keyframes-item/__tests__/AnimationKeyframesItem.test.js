import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import AnimationKeyframesItem from '../AnimationKeyframesItem'

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn(() => ({
    state: { timelineMarks: [] },
    actions: { setCurrentTime: jest.fn() },
  })),
}))

describe('AnimationKeyframesItem', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('calls setCurrentTime when the keyframe button is clicked', () => {
    const keyframe = { time: 1000 }
    const prevKeyframe = { time: 500 }

    const setCurrentTimeMock = jest.fn()
    useEditorState.mockImplementation(() => ({
      state: { timelineMarks: [] },
      actions: { setCurrentTime: setCurrentTimeMock },
    }))

    const { getByLabelText } = render(
      <AnimationKeyframesItem 
        keyframe={keyframe} 
        prevKeyframe={prevKeyframe} 
      />
    )

    const keyframeButton = getByLabelText(`Keyframe: ${keyframe.time} milliseconds`)
    fireEvent.click(keyframeButton)

    expect(setCurrentTimeMock).toHaveBeenCalledWith({ value: keyframe.time })
  })
})
