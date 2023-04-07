import type { AppProps } from 'next/app'
import '@animato/styles/globals.css'
import Firebase from '@animato/lib/firebase/Firebase'
import { AuthUserProvider } from '@animato/context/authUserContext'

export default function App({ Component, pageProps }: AppProps) {
  Firebase.initializeApp()
  return <AuthUserProvider><Component {...pageProps} /></AuthUserProvider>
}
