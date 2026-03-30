'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action} className="flex flex-col gap-4 w-full max-w-sm">
      {state?.error && (
        <p className="text-red-400 text-sm">{state.error}</p>
      )}
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="bg-bg-card border border-white/10 rounded px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="bg-bg-card border border-white/10 rounded px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-accent text-white font-medium py-3 rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
