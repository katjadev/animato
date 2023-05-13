import { 
  ReactNode, 
  createContext, 
  useContext,
  FC,
} from 'react'
import { useRouter } from 'next/router'
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
} from 'firebase/auth'

export const AuthContext = createContext<{
  logIn: (email: string, password: string) => Promise<void>,
  signUp: (email: string, password: string) => Promise<void>,
  logOut: () => Promise<void>,
}>({
  logIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  logOut: () => Promise.resolve(),
})

interface User { 
  getIdToken: () => any; 
  uid: any; 
  email: any; 
}

interface AuthUserProviderProps {
  children?: ReactNode;
}

export const AuthUserProvider: FC<AuthUserProviderProps> = ({ children }) => {
  const auth = getAuth()
  const router = useRouter()

  const postAuthToken = async (user: User) => {
    const token = await user.getIdToken()
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.uid,
        email: user.email,
        token,
      })
    })
    return response.json()
  }

  const logIn = async (email: string, password: string) => {
    const auth = getAuth()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return await postAuthToken(userCredential.user)
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    const auth = getAuth()
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return await postAuthToken(userCredential.user)
    } catch (error) {
      throw error
    }
  }

  const logOut = async () => {
    const auth = getAuth()
    await signOut(auth)
    await fetch('/api/users', { method: 'DELETE' })
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ 
      logIn,
      signUp,
      logOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)