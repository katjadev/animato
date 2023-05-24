import { render, screen } from '@testing-library/react'
import { useEditorState } from '@animato/components/editor/EditorContextProvider'
import AnimationKeyframesItem from '@animato/components/animation-keyframes-item/AnimationKeyframesItem'
import AnimationKeyframes from '../AnimationKeyframes'

jest.mock('@animato/components/editor/EditorContextProvider', () => ({
  useEditorState: jest.fn(),
}))

jest.mock('@animato/components/animation-keyframes-item/AnimationKeyframesItem', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const TEST_ID = 'test-id'
const TEST_ELEMENT = {
  id: TEST_ID,
  title: 'test',
  animations: [
    { 
      id: '1', 
      keyframes: [
        { time: 0 }, 
        { time: 1000 },
        { time: 2000 },
      ],
    },
  ],
}

describe('AnimationKeyframes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders AnimationKeyframesItem for each keyframe', () => {
    useEditorState.mockReturnValue({ state: { collapsedAnimations: [] } })
    AnimationKeyframesItem.mockImplementation(() => <div data-testid="mock-animation-keyframes-item" />)

    render(<AnimationKeyframes element={TEST_ELEMENT} selected={false} />)

    expect(AnimationKeyframesItem).toHaveBeenCalledTimes(3)
    expect(screen.getAllByTestId('mock-animation-keyframes-item')).toHaveLength(3)
  })

  it('renders AnimationKeyframesItem with prevKeyframe prop', () => {
    useEditorState.mockReturnValue({ state: { collapsedAnimations: [] } })
    AnimationKeyframesItem.mockImplementation(() => <div data-testid="mock-animation-keyframes-item" />)

    render(<AnimationKeyframes element={TEST_ELEMENT} selected={false} />)

    expect(AnimationKeyframesItem).toHaveBeenCalledTimes(3)
    expect(AnimationKeyframesItem.mock.calls[0][0].prevKeyframe).toBeUndefined()
    expect(AnimationKeyframesItem.mock.calls[1][0].prevKeyframe).toEqual({ time: 0 })
    expect(AnimationKeyframesItem.mock.calls[2][0].prevKeyframe).toEqual({ time: 1000 })
  })

  it('renders collapsed keyframes when isCollapsed is true', () => {
    useEditorState.mockReturnValue({ state: { collapsedAnimations: [TEST_ID] } })

    render(<AnimationKeyframes element={TEST_ELEMENT} selected={false} />)

    expect(screen.queryByTestId('mock-animation-keyframes-item')).toBeNull()
  })
})
