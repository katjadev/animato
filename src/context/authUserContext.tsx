import { ReactNode, createContext, useContext, useEffect, useState, FC } from 'react'
import { User, getAuth } from 'firebase/auth'

export const AuthUserContext = createContext<{
  currentUser: User | null,
  loading: boolean,
}>({
  currentUser: null,
  loading: true,
})

interface AuthUserProviderProps {
  children?: ReactNode;
}

export const AuthUserProvider: FC<AuthUserProviderProps> = ({ children }) => {
  const auth = getAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setCurrentUser(auth.currentUser)
      setLoading(false)
    })
  }, [auth])

  return (
    <AuthUserContext.Provider value={{ currentUser, loading }}>{children}</AuthUserContext.Provider>
  )
}

export const useAuth = () => useContext(AuthUserContext)