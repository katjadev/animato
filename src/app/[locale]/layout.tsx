import { Montserrat } from 'next/font/google'
import { useLocale } from 'next-intl'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'Animato',
  description: 'Bring your designs to life with animated SVGs',
  icons: {
    icon: '/images/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = useLocale();

  return (
    <html lang={locale}>
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}
