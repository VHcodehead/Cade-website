export const dynamic = 'force-dynamic'

import AdminSidebar from '@/components/admin/sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
