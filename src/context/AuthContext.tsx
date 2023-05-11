import { 
  ReactNode, 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  FC,
} from 'react'
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
} from 'firebase/auth'

export const AuthContext = createContext<{
  currentUser: User | null,
  loading: boolean,
  logIn: (email: string, password: string) => Promise<void>,
  signUp: (email: string, password: string) => Promise<void>,
  logOut: () => Promise<void>,
}>({
  currentUser: null,
  loading: true,
  logIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  logOut: () => Promise.resolve(),
})

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthUserProviderProps {
  children?: ReactNode;
}

export const AuthUserProvider: FC<AuthUserProviderProps> = ({ children }) => {
  const auth = getAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const logIn = async (email: string, password: string) => {
    const auth = getAuth()
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const response = await fetch(`/api/users?id=${userCredential.user.uid}`)
    const data = await response.json()
    setCurrentUser({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    })
  }

  const signUp = async (email: string, password: string) => {
    const auth = getAuth()
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          id: user.uid,
          email: user.email,
        }),
      })
      const data = await response.json()
      setCurrentUser(data)
    } catch (error) {
      throw error
    }
  }

  const logOut = async () => {
    const auth = getAuth()
    await signOut(auth)
    setCurrentUser(null)
  }

  useEffect(() => {
    auth.onAuthStateChanged(async () => {
      setLoading(false)
      if (!auth.currentUser?.uid) {
        document.cookie = 'token='
        return
      }

      const response = await fetch(`/api/users?id=${auth.currentUser.uid}`)
      const data = await response.json()
      setCurrentUser({
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      document.cookie = `token=${await auth.currentUser.getIdToken()}`
    })
  }, [auth])

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading,
      logIn,
      signUp,
      logOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)