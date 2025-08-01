// app/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/ui/Dashboard'

export default function DashboardPage() {
    const { status } = useSession()

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-white-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (status === "unauthenticated") {
        redirect('/login')
    }

    return <Dashboard />
}