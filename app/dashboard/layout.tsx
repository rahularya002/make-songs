// app/dashboard/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vito-x Dashboard',
  description: 'Your audio project management platform',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}