import { render } from '@testing-library/react'
import { NextIntlProvider } from 'next-intl'
import messages from '../../../messages/en.json'
import ModalDialog from '../ModalDialog'

jest.mock('next/font/google', () => ({
  Inter: jest.fn().mockImplementation(() => ({
    className: 'inter-class',
  })),
}))

describe('ModalDialog', () => {
  it('renders correctly', () => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
    
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    const locale = 'en'
    useRouter.mockImplementationOnce(() => ({
      query: { locale: locale },
    }))
  
    const { container } = render(
      <NextIntlProvider messages={messages} locale={locale}>
        <ModalDialog isOpen={true} aria-label='Test Modal' onClose={() => {}}>
          <div>Modal content</div>
        </ModalDialog>
      </NextIntlProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
