'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { deleteMessage } from '@/app/actions/messages'

type Message = {
  id: string
  name: string
  email: string
  company: string
  message: string
  read: boolean
  createdAt: Date
}

type Props = {
  messages: Message[]
}

export default function MessageList({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <div className="bg-bg-card border border-white/10 rounded-lg p-12 text-center">
        <p className="text-text-muted">No messages yet</p>
      </div>
    )
  }

  return (
    <div className="bg-bg-card border border-white/10 rounded-lg divide-y divide-white/10">
      {messages.map((message) => (
        <MessageRow key={message.id} message={message} />
      ))}
    </div>
  )
}

function MessageRow({ message }: { message: Message }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!window.confirm(`Delete message from ${message.name}? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteMessage(message.id)
    })
  }

  const preview = message.message.length > 80
    ? message.message.slice(0, 80) + '…'
    : message.message

  return (
    <div
      className={[
        'flex items-center gap-4 px-5 py-4 hover:bg-bg-section transition-colors group',
        !message.read ? 'border-l-2 border-accent' : 'border-l-2 border-transparent',
      ].join(' ')}
    >
      <Link
        href={`/admin/messages/${message.id}`}
        className="flex-1 min-w-0"
      >
        <div className="flex items-baseline gap-3 mb-1">
          <span className={[
            'text-sm truncate',
            !message.read ? 'font-bold text-text-primary' : 'font-normal text-text-muted',
          ].join(' ')}>
            {message.name}
          </span>
          <span className="text-xs text-text-muted shrink-0">
            {message.email}
          </span>
          <span className="ml-auto text-xs text-text-muted shrink-0">
            {new Date(message.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className={[
          'text-sm truncate',
          !message.read ? 'text-text-primary' : 'text-text-muted',
        ].join(' ')}>
          {preview}
        </p>
      </Link>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="shrink-0 px-2.5 py-1 text-xs text-text-muted border border-white/10 rounded hover:border-red-500/50 hover:text-red-400 transition-colors disabled:opacity-50"
        aria-label={`Delete message from ${message.name}`}
      >
        {isPending ? '…' : 'Delete'}
      </button>
    </div>
  )
}
