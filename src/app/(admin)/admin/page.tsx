import { verifySession } from '@/lib/dal'
import { logout } from '@/app/actions/auth'

export default async function AdminDashboard() {
  await verifySession()
  return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Admin Dashboard</h1>
        <p className="text-text-muted mb-8">Content management coming in Phase 5.</p>
        <form action={logout}>
          <button
            type="submit"
            className="px-6 py-2 bg-bg-card border border-white/10 rounded text-text-primary hover:border-accent transition-colors"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  )
}
