import { render } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import AnimationElement from '../AnimationElement'

const translations = {
  expand: 'Expand',
  collapse: 'Collapse',
}

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn(() => ({
    state: { collapsedAnimations: [], selectedElementIds: [] },
  })),
}))

const TEST_ID = 'test-id'
const TEST_ELEMENT = {
  id: TEST_ID,
  title: 'Animation Group',
  animations: [
    { id: 1, title: 'Animation 1' },
    { id: 2, title: 'Animation 2' },
  ],
}

describe('AnimationElement', () => {
  it('renders correctly', () => {
    const { container } = render(
      <AnimationElement 
        element={TEST_ELEMENT} 
        translations={translations}
      />
    )
    
    expect(container).toMatchSnapshot()
  })

  it('enders correctly when selected', () => {
    useEditorState.mockReturnValue({
      state: { collapsedAnimations: [], selectedElementIds: [TEST_ID] },
      actions: {},
    })

    const { container } = render(
      <AnimationElement 
        element={TEST_ELEMENT} 
        translations={translations}
      />
    )

    expect(container).toMatchSnapshot()
  })
})
