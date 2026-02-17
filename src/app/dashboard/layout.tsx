import { ReactNode } from 'react'

// Force dynamic rendering for all dashboard routes
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
