import { 
  ReactNode, 
  createContext, 
  useContext,
  FC,
} from 'react'
import { useRouter } from 'next/navigation'
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
} from 'firebase/auth'
import Firebase from '@animato/lib/firebase/Firebase'

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

export const AuthProvider: FC<AuthUserProviderProps> = ({ children }) => {
  Firebase.initializeApp()
  const router = useRouter()

  const postAuthToken = async (user: User) => {
    const token = await user.getIdToken()
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.uid,
        email: user.email,
        token,
      })
    })
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
    router.refresh()
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