import { render } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import AnimationKeyframes from '../AnimationKeyframes'

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

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn().mockReturnValue({ state: {
    selectedElementIds: [], 
    collapsedAnimations: [], 
    timelineWidth: 4848,
    timelineMarks: [
      { position: 0, height: 10, title: '0s', time: 0 },
      { position: 16, height: 10, title: '1s', time: 1000 },
      { position: 32, height: 10, title: '2s', time: 2000 },
      { position: 48, height: 10, title: '3s', time: 3000 },
      { position: 64, height: 10, title: '4s', time: 4000 },
      { position: 96, height: 10, title: '5s', time: 5000 },
    ],
  } }),
}))

describe('AnimationKeyframes', () => {
  it('renders correctly', () => {
    const { container } = render(<AnimationKeyframes element={TEST_ELEMENT} />)
    
    expect(container).toMatchSnapshot()
  })

  it('renders correctly when selected', () => {
    useEditorState.mockReturnValue({ state: { selectedElementIds: [TEST_ID], collapsedAnimations: [], timelineMarks: [] } })

    const { container } = render(<AnimationKeyframes element={TEST_ELEMENT} />)

    expect(container).toMatchSnapshot()
  })
})
