'use client'

import { useEffect } from 'react'

interface AnalyticsTrackerProps {
  page: string
  eventType?: 'PAGE_VIEW' | 'VIDEO_PLAY'
  projectId?: string
}

export function AnalyticsTracker({
  page,
  eventType = 'PAGE_VIEW',
  projectId,
}: AnalyticsTrackerProps) {
  useEffect(() => {
    const url = '/api/analytics/event'
    const payload = JSON.stringify({ eventType, page, projectId })

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon(url, blob)
    } else {
      fetch(url, {
        method: 'POST',
        body: payload,
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {
        // Fire-and-forget — ignore errors
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
