import 'firebase/auth'
import { firebaseAdminSDK } from '@animato/lib/firebase/FirebaseAdminSDK'
import verifyCookie from '../verifyCookie'

jest.mock('@animato/lib/firebase/FirebaseAdminSDK', () => ({
  firebaseAdminSDK: {
    auth: jest.fn(() => ({
      verifySessionCookie: jest.fn(),
    })),
  },
}))

describe('verifyCookie', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns authenticated true and user information when cookie is valid', async () => {
    const cookie = 'valid_cookie'
    const decodedClaims = { email: 'test@example.com', user_id: 'user_id' }
    const verifySessionCookieMock = jest.fn().mockResolvedValue(decodedClaims)
    firebaseAdminSDK.auth.mockReturnValue({
      verifySessionCookie: verifySessionCookieMock,
    })

    const result = await verifyCookie(cookie)

    expect(result).toEqual({
      authenticated: true,
      email: 'test@example.com',
      userId: 'user_id',
    })
    expect(verifySessionCookieMock).toHaveBeenCalledWith(cookie, true)
  })

  it('returns authenticated false and empty user information when cookie is invalid', async () => {
    const cookie = 'invalid_cookie'
    const verifySessionCookieMock = jest.fn().mockRejectedValue(new Error('Invalid cookie'))
    firebaseAdminSDK.auth.mockReturnValue({
      verifySessionCookie: verifySessionCookieMock,
    })

    const result = await verifyCookie(cookie)

    expect(result).toEqual({
      authenticated: false,
      email: '',
      userId: '',
    })
    expect(verifySessionCookieMock).toHaveBeenCalledWith(cookie, true)
  })
})
