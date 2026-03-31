---
phase: 6
slug: analytics-and-advanced-admin
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 6 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Build verification + manual testing |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Manual verification
- **Max feedback latency:** 30 seconds

## Manual-Only Verifications

| Behavior | Requirement | Why Manual |
|----------|-------------|------------|
| Drag-and-drop reorder persists | ADMIN-07 | Requires drag interaction |
| Page views tracked silently | ANLYT-01 | Requires browsing + DB check |
| Video plays tracked | ANLYT-02 | Requires hover/play interaction |
| Dashboard shows accurate data | ANLYT-03 | Requires prior tracking data |

**Approval:** pending
