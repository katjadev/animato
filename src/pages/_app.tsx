import { StrictMode } from 'react'
import type { AppProps } from 'next/app'
import { NextIntlProvider } from 'next-intl'
import Firebase from '@animato/lib/firebase/Firebase'
import { 
  AuthUserContext, 
  AuthUserProvider, 
  useAuth,
} from '@animato/context/authUserContext'
import '@animato/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  Firebase.initializeApp()
  const authUserContext = useAuth()
  
  return (
    <StrictMode>
      <NextIntlProvider messages={pageProps.messages}>
        <AuthUserProvider>
          <AuthUserContext.Consumer>
            {({ loading }) => (
              <>
                {loading && (<></>)}
                {!loading && <Component {...pageProps} />}
              </>
            )}
          </AuthUserContext.Consumer>
        </AuthUserProvider>
      </NextIntlProvider>
    </StrictMode>
  )
}
