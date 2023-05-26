import React from 'react'
import { render } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import ElementTree from '../ElementTree'

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn(() => ({
    state: { collapsedElements: [] },
  })),
}))

const translations = {
  expand: 'Expand',
  collapse: 'Collapse',
  elements: 'Elements',
}

const TEST_ID = 'test-id'

const elements = [
  {
    id: TEST_ID,
    element: document.createElement('rect'),
    title: 'Element 1',
    children: [
      {
        id: 'element2',
        element: document.createElement('path'),
        title: 'Element 2',
        children: [],
      },
    ],
  },
]

describe('ElementTree', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ElementTree elements={elements} translations={translations} />
    )

    expect(container).toMatchSnapshot()
  })

  it('renders correctly with collapsed elements', () => {
    useEditorState.mockReturnValue({
      state: { collapsedElements: [TEST_ID] },
      actions: {},
    })

    const { container } = render(
      <ElementTree elements={elements} translations={translations} />
    )

    expect(container).toMatchSnapshot()
  })
})
