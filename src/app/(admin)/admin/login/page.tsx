import { LoginForm } from '@/components/admin/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <p className="font-heading text-xl tracking-widest text-text-primary text-center mb-8">
          VLACOVISION
        </p>
        <h1 className="text-sm text-text-muted uppercase tracking-wider text-center mb-6">
          Admin Login
        </h1>
        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
