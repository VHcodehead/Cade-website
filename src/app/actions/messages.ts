'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/dal'

export async function markRead(id: string): Promise<void> {
  await verifySession()
  await db.contactSubmission.update({
    where: { id },
    data: { read: true },
  })
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}

export async function deleteMessage(id: string): Promise<void> {
  await verifySession()
  await db.contactSubmission.delete({
    where: { id },
  })
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}
