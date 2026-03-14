import type { Metadata, Viewport } from 'next'
import { Montserrat, Fredoka } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
});

const fredoka = Fredoka({ 
  subsets: ["latin"],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: 'LikeGrow - Grow Your Digital Avatar',
  description: 'Transform your saved content into a unique AI avatar. Take the quiz, discover your digital self, and watch it evolve!',
  generator: 'v0.app',
  keywords: ['avatar', 'digital', 'quiz', 'social media', 'gamification', 'AI'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#00BFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${montserrat.variable} ${fredoka.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
