import { render } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import ElementTreeItem from '../ElementTreeItem'

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn().mockReturnValue({
    state: {
      collapsedElements: [],
    },
    actions: {},
  })
}))

const translations = {
  expand: 'Expand',
  collapse: 'Collapse',
}

const TEST_ID = 'test-id'
const testElement = {
  id: 'test-id',
  title: 'test-element',
  element: document.createElement('rect'),
  children: [],
}

describe('ElementTreeItem', () => {
  it('renders correctly for a leaf element', () => {
    const { container } = render(
      <ElementTreeItem
        level={0}
        element={testElement}
        translations={translations}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders correctly for a parent element', () => {
    const { container } = render(
      <ElementTreeItem
        level={0}
        element={{
          ...testElement,
          children: [{
            id: 'test-child-id',
            title: 'test-child-element',
            element: document.createElement('path'),
            children: [],
          }],
        }}
        translations={translations}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders correctly for a collapsed parent element', () => {
    const TEST_ID = 'test-id'
    useEditorState.mockReturnValue({
      state: {
        collapsedElements: [TEST_ID],
      },
      actions: {},
    })

    const { container } = render(
      <ElementTreeItem
        level={0}
        element={{
          ...testElement,
          children: [{
            id: 'test-child-id',
            title: 'test-child-element',
            element: document.createElement('path'),
            children: [],
          }],
        }}
        translations={translations}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
