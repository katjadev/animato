import { StrictMode } from 'react'
import type { AppProps } from 'next/app'
import { NextIntlProvider } from 'next-intl'
import Firebase from '@animato/lib/firebase/Firebase'
import { AuthUserProvider } from '@animato/context/AuthContext'
import { ProjectsProvider } from '@animato/context/projects/ProjectsContext'
import { DialogProvider } from '@animato/context/DialogContext'
import '@animato/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  Firebase.initializeApp()

  return (
    <StrictMode>
      <NextIntlProvider messages={pageProps.messages}>
        <AuthUserProvider>
          <DialogProvider>
            <ProjectsProvider>
              <Component {...pageProps} />
            </ProjectsProvider>
          </DialogProvider>
        </AuthUserProvider>
      </NextIntlProvider>
    </StrictMode>
  )
}
