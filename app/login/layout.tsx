import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vito-x Login',
  description: 'Sign in to your Vito-x account',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}