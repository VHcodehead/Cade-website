import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventType, page, projectId } = body

    await db.analyticsEvent.create({
      data: {
        eventType: eventType ?? 'PAGE_VIEW',
        page: page ?? '/',
        projectId: projectId ?? null,
      },
    })
  } catch {
    // Analytics must NEVER error the page — silently swallow all errors
  }

  return new NextResponse(null, { status: 204 })
}
