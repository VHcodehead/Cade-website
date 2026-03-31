import { notFound } from 'next/navigation'
import Link from 'next/link'
import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import { markRead, deleteMessage } from '@/app/actions/messages'

type Props = {
  params: Promise<{ id: string }>
}

export default async function MessageDetailPage({ params }: Props) {
  await verifySession()

  const { id } = await params

  const message = await db.contactSubmission.findUnique({ where: { id } })

  if (!message) {
    notFound()
  }

  if (!message.read) {
    await markRead(id)
  }

  const formattedDate = new Date(message.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
      >
        &#8592; Back to Messages
      </Link>

      <div className="bg-bg-card border border-white/10 rounded-lg p-8">
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-text-primary mb-1">{message.name}</h1>
          <a
            href={`mailto:${message.email}`}
            className="text-accent hover:underline text-sm"
          >
            {message.email}
          </a>
          {message.company && (
            <p className="text-text-muted text-sm mt-1">{message.company}</p>
          )}
          <p className="text-text-muted text-xs mt-2">{formattedDate}</p>
        </div>

        {/* Message body */}
        <div className="mb-8">
          <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
            {message.message}
          </p>
        </div>

        {/* Delete */}
        <div className="pt-6 border-t border-white/10">
          <form
            action={deleteMessage.bind(null, id)}
          >
            <button
              type="submit"
              className="px-4 py-2 text-sm text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 hover:border-red-500/60 transition-colors"
            >
              Delete Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
