import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { NextIntlProvider } from 'next-intl'
import messages from '../../../messages/en.json'
import { useAuth } from '@animato/context/AuthContext'
import LoginDialog from '../LoginDialog'

jest.mock('next/font/google', () => ({
  Inter: jest.fn().mockImplementation(() => ({
    className: 'inter-class',
  })),
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@animato/context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

describe('LoginDialog', () => {
  const useRouter = jest.spyOn(require('next/router'), 'useRouter')
  const locale = 'en'
  useRouter.mockImplementationOnce(() => ({
    query: { locale: locale },
  }))
  HTMLDialogElement.prototype.show = jest.fn()
  HTMLDialogElement.prototype.showModal = jest.fn()
  HTMLDialogElement.prototype.close = jest.fn()

  const onClose = jest.fn()

  beforeEach(() => {
    useAuth.mockImplementationOnce(() => ({
      logIn: jest.fn(),
    }))
    onClose.mockReset()
  })

  it('renders the dialog with correct title', () => {
    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <LoginDialog isOpen={true} onClose={onClose} />
      </NextIntlProvider>
    )

    const title = screen.getByText('Log In')
    expect(title).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <LoginDialog isOpen={true} onClose={onClose} />
      </NextIntlProvider>
    )

    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('submits the form when log in button is clicked', async () => {
    const logInMock = jest.fn()
    useAuth.mockImplementation(() => ({
      logIn: logInMock,
    }))

    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <LoginDialog isOpen={true} onClose={onClose} />
      </NextIntlProvider>
    )

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByText('Log in')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect(logInMock).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('shows an error message for invalid email and sets focus to the email field', async () => {
    const logInMock = jest.fn().mockRejectedValue(new Error('auth/invalid-email'))
    useAuth.mockImplementation(() => ({
      logIn: logInMock,
    }))

    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <LoginDialog isOpen={true} onClose={onClose} />
      </NextIntlProvider>
    )

    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByText('Log in')

    fireEvent.change(emailInput, { target: { value: 'invalid_email' } })
      fireEvent.click(submitButton)
    
    const errorMessage = await screen.findByText('Invalid email format. Please enter a valid email address (e.g. example@example.com).')
    expect(errorMessage).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('shows an error message for missing password', async () => {
    const logInMock = jest.fn().mockRejectedValue(new Error('auth/missing-password'))
    useAuth.mockImplementation(() => ({
      logIn: logInMock,
    }))

    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <LoginDialog isOpen={true} onClose={onClose} />
      </NextIntlProvider>
    )

    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByText('Log in')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    const errorMessage = await screen.findByText('Please enter a password.')
    expect(errorMessage).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('shows an error message when the user is not found', async () => {
    const logInMock = jest.fn().mockRejectedValue(new Error('auth/user-not-found'))
    useAuth.mockImplementation(() => ({
      logIn: logInMock,
    }))

    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <LoginDialog isOpen={true} onClose={onClose} />
      </NextIntlProvider>
    )

    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByText('Log in')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    const errorMessage = await screen.findByText('User not found. Please check your email and try again, or sign up for a new account.')
    expect(errorMessage).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('shows an error message for a wrong password', async () => {
    const logInMock = jest.fn().mockRejectedValue(new Error('auth/wrong-password'))
    useAuth.mockImplementation(() => ({
      logIn: logInMock,
    }))

    render(
      <NextIntlProvider messages={messages} locale={locale}>
        <LoginDialog isOpen={true} onClose={onClose} />
      </NextIntlProvider>
    )

    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByText('Log in')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    const errorMessage = await screen.findByText('Incorrect password. Please try again.')
    expect(errorMessage).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })
})
