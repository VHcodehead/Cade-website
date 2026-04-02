'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'

const NAV_LINKS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Settings', href: '/admin/settings' },
  { label: 'Team', href: '/admin/team' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  { label: 'Brand Logos', href: '/admin/logos' },
  { label: 'Messages', href: '/admin/messages' },
  { label: 'Analytics', href: '/admin/analytics' },
]

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Hamburger button — visible below md */}
      <button
        className="fixed top-4 left-4 z-50 flex flex-col gap-1.5 p-2 bg-bg-card border border-white/10 rounded md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <span className="block w-5 h-0.5 bg-text-primary" />
        <span className="block w-5 h-0.5 bg-text-primary" />
        <span className="block w-5 h-0.5 bg-text-primary" />
      </button>

      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed top-0 left-0 z-50 h-screen w-60 bg-bg-card border-r border-white/10 flex flex-col transition-transform duration-200',
          // Desktop: always visible
          'md:translate-x-0 md:static md:z-auto md:flex md:shrink-0',
          // Mobile: slide in/out
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Logo / Brand */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <span className="text-text-primary font-bold tracking-widest uppercase text-sm">
            VLACOVISION
          </span>
          {/* Close button — mobile only */}
          <button
            className="md:hidden text-text-muted hover:text-text-primary transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            &#x2715;
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={[
                    'flex items-center px-6 py-3 text-sm transition-colors border-l-2',
                    isActive(href)
                      ? 'border-accent bg-bg-section text-text-primary font-medium'
                      : 'border-transparent text-text-muted hover:text-text-primary hover:bg-bg-section',
                  ].join(' ')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <form action={logout}>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm text-text-muted hover:text-text-primary border border-white/10 rounded hover:border-white/20 transition-colors text-left"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
