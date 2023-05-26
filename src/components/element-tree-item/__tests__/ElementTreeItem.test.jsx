import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import ElementTreeItem from '../ElementTreeItem'

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn(() => ({
    state: { collapsedElements: [] },
    actions: {},
  })),
}))

const translations = {
  expand: 'Expand',
  collapse: 'Collapse',
}

const TEST_ID = 'test-id'

const element = {
  id: TEST_ID,
  element: document.createElement('rect'),
  title: 'Element Title',
  children: [],
}

describe('ElementTreeItem', () => {
  test('should render element title', () => {
    const { getByText } = render(
      <ElementTreeItem element={element} level={0} translations={translations} />
    )

    const titleElement = getByText('Element Title')
    expect(titleElement).toBeInTheDocument()
  })

  test('should call selectElement when mouse enters the element', () => {
    const mockSelectElement = jest.fn()
    useEditorState.mockReturnValue({
      state: { collapsedElements: [] },
      actions: { selectElement: mockSelectElement },
    })

    const { getByText } = render(
      <ElementTreeItem element={element} level={0} translations={translations} />
    )

    const titleElement = getByText('Element Title')
    fireEvent.mouseEnter(titleElement)

    expect(mockSelectElement).toHaveBeenCalledWith({ id: TEST_ID })
  })

  test('should call selectElement when mouse leaves the element', () => {
    const mockSelectElement = jest.fn()
    useEditorState.mockReturnValue({
      state: { collapsedElements: [] },
      actions: { selectElement: mockSelectElement },
    })

    const { getByText } = render(
      <ElementTreeItem element={element} level={0} translations={translations} />
    )

    const titleElement = getByText('Element Title')
    fireEvent.mouseLeave(titleElement)

    expect(mockSelectElement).toHaveBeenCalledWith({ id: null })
  })

  test('should call selectElement when the element is focused', () => {
    const mockSelectElement = jest.fn()
    useEditorState.mockReturnValue({
      state: { collapsedElements: [] },
      actions: { selectElement: mockSelectElement },
    })

    const { getByText } = render(
      <ElementTreeItem element={element} level={0} translations={translations} />
    )

    const titleElement = getByText('Element Title')
    fireEvent.focus(titleElement)

    expect(mockSelectElement).toHaveBeenCalledWith({ id: TEST_ID })
  })

  test('should call selectElement when the element loses focus', () => {
    const mockSelectElement = jest.fn()
    useEditorState.mockReturnValue({
      state: { collapsedElements: [] },
      actions: { selectElement: mockSelectElement },
    })

    const { getByText } = render(
      <ElementTreeItem element={element} level={0} translations={translations} />
    )

    const titleElement = getByText('Element Title')
    fireEvent.blur(titleElement)

    expect(mockSelectElement).toHaveBeenCalledWith({ id: null })
  })

  test('should call collapseElement when collapse button is clicked', () => {
    const mockCollapseElement = jest.fn()
    useEditorState.mockReturnValue({
      state: { collapsedElements: [] },
      actions: { collapseElement: mockCollapseElement },
    })

    const { getByLabelText } = render(
      <ElementTreeItem 
        element={{
          ...element,
          children: [{ id: 'test-child-id' }],
        }} 
        level={0} 
        translations={translations}
      />
    )

    const collapseButton = getByLabelText('Collapse')
    fireEvent.click(collapseButton)

    expect(mockCollapseElement).toHaveBeenCalledWith({ id: TEST_ID })
  })

  test('should call expandElement when expand button is clicked', () => {
    const mockExpandElement = jest.fn()
    useEditorState.mockReturnValue({
      state: { collapsedElements: [TEST_ID] },
      actions: { expandElement: mockExpandElement },
    })

    const { getByLabelText } = render(
      <ElementTreeItem 
        element={{
          ...element,
          children: [{ id: 'test-child-id' }],
        }} 
        level={0} 
        translations={translations}
      />
    )

    const expandButton = getByLabelText('Expand')
    fireEvent.click(expandButton)

    expect(mockExpandElement).toHaveBeenCalledWith({ id: TEST_ID })
  })
})