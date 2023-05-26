import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import AnimationElement from '../AnimationElement'

jest.mock('@animato/context/EditorContext/EditorContextProvider', () => ({
  useEditorState: jest.fn(),
}))

const translations = {
  expand: 'Expand',
  collapse: 'Collapse',
}

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
  it('renders the element title', () => {
    useEditorState.mockReturnValue({ state: { collapsedAnimations: [] } })

    render(
      <AnimationElement
        element={TEST_ELEMENT}
        selected={false}
        translations={translations}
      />
    )

    const elementTitle = screen.getByText('Animation Group')
    expect(elementTitle).toBeInTheDocument()
  })

  it('renders the expand icon when the animation group is collapsed', () => {
    useEditorState.mockReturnValue({ state: { collapsedAnimations: [TEST_ID] } })

    render(
      <AnimationElement
        element={TEST_ELEMENT}
        selected={false}
        translations={translations}
      />
    )

    const expandIcon = screen.getByLabelText('Expand')
    expect(expandIcon).toBeInTheDocument()
  })

  it('renders the collapse icon when the animation group is expanded', () => {
    useEditorState.mockReturnValue({ state: { collapsedAnimations: [] } })

    render(
      <AnimationElement
        element={TEST_ELEMENT}
        selected={false}
        translations={translations}
      />
    )

    const collapseIcon = screen.getByLabelText('Collapse')
    expect(collapseIcon).toBeInTheDocument()
  })

  it('toggles the collapsed state when the expand button is clicked', () => {
    const mockExpandAnimation = jest.fn()
    useEditorState.mockReturnValue({ 
      state: { collapsedAnimations: [TEST_ID] },
      actions: { expandAnimation: mockExpandAnimation },
    })

    render(
      <AnimationElement
        element={TEST_ELEMENT}
        selected={false}
        translations={translations}
      />
    )

    const button = screen.getByLabelText('Expand')
    fireEvent.click(button)

    expect(mockExpandAnimation).toHaveBeenCalledTimes(1)
    expect(mockExpandAnimation).toHaveBeenCalledWith({ id: TEST_ID })
  })

  it('toggles the collapsed state when the collapse button is clicked', () => {
    const mockCollapseAnimation = jest.fn()
    useEditorState.mockReturnValue({ 
      state: { collapsedAnimations: [] },
      actions: { collapseAnimation: mockCollapseAnimation },
    })

    render(
      <AnimationElement
        element={TEST_ELEMENT}
        selected={false}
        translations={translations}
      />
    )

    const button = screen.getByLabelText('Collapse')
    fireEvent.click(button)
    expect(mockCollapseAnimation).toHaveBeenCalledTimes(1)
    expect(mockCollapseAnimation).toHaveBeenCalledWith({ id: TEST_ID })
  })

  it('renders the animation titles when the animation group is expanded', () => {
    useEditorState.mockReturnValue({ state: { collapsedAnimations: [] } })

    render(
      <AnimationElement
        element={TEST_ELEMENT}
        selected={false}
        translations={translations}
      />
    )

    const animation1Title = screen.getByText('Animation 1')
    expect(animation1Title).toBeInTheDocument()

    const animation2Title = screen.getByText('Animation 2')
    expect(animation2Title).toBeInTheDocument()
  })

  it('does not render the animation titles when the animation group is collapsed', () => {
    useEditorState.mockReturnValue({ state: { collapsedAnimations: [TEST_ID] } })

    render(
      <AnimationElement
        element={TEST_ELEMENT}
        selected={false}
        translations={translations}
      />
    )

    const animation1Title = screen.queryByText('Animation 1')
    expect(animation1Title).not.toBeInTheDocument()

    const animation2Title = screen.queryByText('Animation 2')
    expect(animation2Title).not.toBeInTheDocument()
  })
})
