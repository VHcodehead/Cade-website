import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import MessageList from '@/components/admin/message-list'

export default async function MessagesPage() {
  await verifySession()

  const messages = await db.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">
        Messages{unreadCount > 0 && (
          <span className="ml-3 inline-flex items-center justify-center min-w-6 h-6 px-2 text-xs font-bold bg-accent text-white rounded-full">
            {unreadCount} unread
          </span>
        )}
      </h1>

      <MessageList messages={messages} />
    </div>
  )
}
