import { createContext, useContext } from 'react'
import { getAuth } from 'firebase/auth'
import Firebase from '@animato/lib/firebase/Firebase'

Firebase.initializeApp()

const authUserContext = createContext({
  authUser: null,
  loading: true,
})

export function AuthUserProvider({ children }) {
  const auth = getAuth()
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
}

export const useAuth = () => useContext(authUserContext)