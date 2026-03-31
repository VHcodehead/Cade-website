---
phase: 5
slug: admin-cms
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Build verification + manual admin testing |
| **Config file** | N/A |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual admin walkthrough
- **Before `/gsd:verify-work`:** Full build + end-to-end admin CRUD test in browser
- **Max feedback latency:** 30 seconds

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Create project end-to-end | ADMIN-03 | Requires form interaction + DB write | Fill admin form, save, verify on public site |
| Edit project | ADMIN-04 | Form interaction | Edit existing project, verify changes on public site |
| Delete with confirmation | ADMIN-05 | Dialog interaction | Delete project, confirm dialog, verify removed |
| Publish/unpublish toggle | ADMIN-06 | Interactive toggle | Toggle status, verify project appears/disappears on public site |
| Update hero video | ADMIN-08 | Settings form | Change hero Vimeo URL, verify hero updates on public site |
| Edit about/contact | ADMIN-09,10 | Settings form | Update text, verify on public site |
| Upload brand logo | ADMIN-11 | File upload interaction | Upload PNG, verify appears in logo marquee |
| Contact inbox read/unread | ADMIN-12 | Requires prior form submission | Submit contact form, check admin inbox |
| Tablet responsive | RESP-03 | Viewport testing | Chrome DevTools tablet mode, verify sidebar collapses |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify
- [ ] Sampling continuity maintained
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
