// app/layout.tsx
import { Providers } from '../providers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vito-x Dashboard',
  description: 'Your audio project management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html lang="en" suppressHydrationWarning>
      <body>
          <Providers>{children}</Providers>
      </body>
    </html>
    
  )
}