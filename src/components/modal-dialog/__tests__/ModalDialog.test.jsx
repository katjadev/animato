import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ModalDialog from '../ModalDialog'

describe('ModalDialog', () => {
  it('should show modal when isOpen is true', () => {
    HTMLDialogElement.prototype.show = jest.fn()
    HTMLDialogElement.prototype.showModal = jest.fn()
    HTMLDialogElement.prototype.close = jest.fn()

    const { getByLabelText } = render(
      <ModalDialog 
        isOpen={true} 
        aria-label="Test Modal"
        closeButtonAriaLabel="Close"
        onClose={() => {}}
      >
        <div>Modal content</div>
      </ModalDialog>
    )

    const modal = getByLabelText('Test Modal')
    expect(modal).toBeTruthy()
    expect(modal.showModal).toHaveBeenCalledTimes(1)
  })

  it('should hide modal when isOpen is false', () => {
    HTMLDialogElement.prototype.show = jest.fn()
    HTMLDialogElement.prototype.showModal = jest.fn()
    HTMLDialogElement.prototype.close = jest.fn()

    const { getByLabelText } = render(
      <ModalDialog 
        isOpen={false} 
        aria-label="Test Modal"
        closeButtonAriaLabel="Close"
        onClose={() => {}}
      >
        <div>Modal content</div>
      </ModalDialog>
    )

    const modal = getByLabelText('Test Modal')
    expect(modal).toBeTruthy()
    expect(modal.close).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when close button is clicked', () => {
    const onCloseMock = jest.fn()
    const { getByLabelText } = render(
      <ModalDialog 
        isOpen={true} 
        aria-label="Test Modal"
        closeButtonAriaLabel="Close"
        onClose={onCloseMock}
      >
        <div>Modal content</div>
      </ModalDialog>
    )

    const closeButton = getByLabelText('Close')
    fireEvent.click(closeButton)

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
