import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { NextIntlProvider } from 'next-intl'
import messages from '../../../messages/en.json'
import ModalDialog from '../ModalDialog'

jest.mock('next/font/google', () => ({
  Inter: jest.fn().mockImplementation(() => ({
    className: 'inter-class',
  })),
}))

describe('ModalDialog', () => {
  const useRouter = jest.spyOn(require('next/router'), 'useRouter')
  const locale = 'en'
  useRouter.mockImplementationOnce(() => ({
    query: { locale: locale },
  }))

  it('should show modal when isOpen is true', () => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();

    const { getByLabelText } = render(
      <NextIntlProvider messages={messages} locale={locale}>
        <ModalDialog isOpen={true} aria-label="Test Modal" onClose={() => {}}>
          <div>Modal content</div>
        </ModalDialog>
      </NextIntlProvider>
    )

    const modal = getByLabelText('Test Modal')
    expect(modal).toBeTruthy()
    expect(modal.showModal).toHaveBeenCalledTimes(1)
  })

  it('should hide modal when isOpen is false', () => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();

    const { getByLabelText } = render(
      <NextIntlProvider messages={messages} locale={locale}>
        <ModalDialog isOpen={false} aria-label="Test Modal" onClose={() => {}}>
          <div>Modal content</div>
        </ModalDialog>
      </NextIntlProvider>
    )

    const modal = getByLabelText('Test Modal')
    expect(modal).toBeTruthy()
    expect(modal.close).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when close button is clicked', () => {
    const onCloseMock = jest.fn()
    const { getByLabelText } = render(
      <NextIntlProvider messages={messages} locale={locale}>
        <ModalDialog isOpen={true} aria-label="Test Modal" onClose={onCloseMock}>
          <div>Modal content</div>
        </ModalDialog>
      </NextIntlProvider>
    )

    const closeButton = getByLabelText('Close')
    fireEvent.click(closeButton)

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
