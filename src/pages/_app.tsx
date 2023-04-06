import type { AppProps } from 'next/app'
import { AuthUserProvider } from '@animato/context/AuthUserContext'

import '@animato/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <AuthUserProvider><Component {...pageProps} /></AuthUserProvider>
}
