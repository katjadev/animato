import { FC } from 'react'
import NextHead from 'next/head'

interface HeadProps {
  title?: string;
}

const Head: FC<HeadProps> = ({ title }) => (
  <NextHead>
    <title>{title || 'Animato'}</title>
    <meta name='description' content='Bring your designs to life with animated SVGs' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <link rel="shortcut icon" href="/images/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
  </NextHead>
)

export default Head