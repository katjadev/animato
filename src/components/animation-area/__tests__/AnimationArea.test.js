import React from 'react'
import { render } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'
import AnimationElement from '@animato/components/animation-element/AnimationElement'
import AnimationKeyframes from '@animato/components/animation-keyframes/AnimationKeyframes'
import AnimationArea from '../AnimationArea'

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn(),
}))

const TEST_ID_1 = 'test-id-1'
const TEST_ID_2 = 'test-id-2'
const TEST_ANIMATIONS = [
  {
    id: TEST_ID_1,
    title: 'Animation Group 1',
    animations: [
      { id: 1, title: 'Animation 1', keyframes: [] },
      { id: 2, title: 'Animation 2', keyframes: [] },
    ],
  },
  {
    id: TEST_ID_2,
    title: 'Animation Group 2',
    animations: [
      { id: 3, title: 'Animation 3', keyframes: [] },
    ],
  },
]
jest.mock('@animato/context/ProjectContext/ProjectContextProvider', () => ({
  useProjectState: jest.fn(),
}))
useProjectState.mockReturnValue({
  animations: TEST_ANIMATIONS,
})

jest.mock('@animato/components/animation-element/AnimationElement', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@animato/components/animation-keyframes/AnimationKeyframes', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const translations = {
  expand: 'Expand',
  collapse: 'Collapse',
}

describe('AnimationArea', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the animation elements and keyframes for each animation group', () => {
    useEditorState.mockReturnValue({ 
      state: { hoveredElementId: null, collapsedAnimations: [] },
      actions: {},
    })
    AnimationElement.mockImplementation(() => <div data-testid="mock-animation-element" />)
    AnimationKeyframes.mockImplementation(() => <div data-testid="mock-animation-keyframes" />)

    render(
      <AnimationArea
        animations={TEST_ANIMATIONS}
        translations={translations}
      />
    )

    expect(AnimationElement).toHaveBeenCalledTimes(2)
    expect(AnimationElement.mock.calls[0][0].element).toEqual(TEST_ANIMATIONS[0])
    expect(AnimationElement.mock.calls[0][0].translations).toBe(translations)
    expect(AnimationElement.mock.calls[1][0].element).toEqual(TEST_ANIMATIONS[1])
    expect(AnimationElement.mock.calls[1][0].translations).toBe(translations)

    expect(AnimationKeyframes).toHaveBeenCalledTimes(2)
    expect(AnimationKeyframes.mock.calls[0][0].element).toEqual(TEST_ANIMATIONS[0])
    expect(AnimationKeyframes.mock.calls[1][0].element).toEqual(TEST_ANIMATIONS[1])
  })
})
