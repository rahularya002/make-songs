// app/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/ui/Dashboard'

export default function DashboardPage() {
    const { status } = useSession()

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (status === "unauthenticated") {
        redirect('/auth')
    }

    return <Dashboard />
}