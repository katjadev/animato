import { render } from '@testing-library/react'
import ModalDialog from '../ModalDialog'

describe('ModalDialog', () => {
  it('renders correctly', () => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  
    const { container } = render(
      <ModalDialog 
        isOpen={true} 
        aria-label='Test Modal'
        closeButtonAriaLabel="Close"
        onClose={() => {}}
      >
        <div>Modal content</div>
      </ModalDialog>
    )
    expect(container).toMatchSnapshot()
  })
})
