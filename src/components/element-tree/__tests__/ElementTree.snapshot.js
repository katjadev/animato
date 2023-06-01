import React from 'react'
import { render } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import ElementTree from '../ElementTree'

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn(() => ({
    state: { collapsedElements: [], selectedElementIds: [] },
  })),
}))

const TEST_ID = 'test-id'

jest.mock('@animato/context/ProjectContext/ProjectContextProvider', () => ({
  useProjectState: jest.fn(() => ({
    state: { elements: [
      {
        id: 'test-id',
        tagName: 'rect',
        title: 'Element 1',
        children: [
          {
            id: 'element2',
            tagName: 'path',
            title: 'Element 2',
            children: [],
          },
        ],
      },
    ] },
  })),
}))

const translations = {
  expand: 'Expand',
  collapse: 'Collapse',
  elements: 'Elements',
}

describe('ElementTree', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ElementTree translations={translations} />
    )

    expect(container).toMatchSnapshot()
  })

  it('renders correctly with collapsed elements', () => {
    useEditorState.mockReturnValue({
      state: { collapsedElements: [TEST_ID], selectedElementIds: [] },
      actions: {},
    })

    const { container } = render(
      <ElementTree translations={translations} />
    )

    expect(container).toMatchSnapshot()
  })
})
