---
phase: 2
slug: auth-system-and-data-layer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest (Wave 0 installs if not present) |
| **Config file** | `jest.config.ts` (Wave 0 creates if missing) |
| **Quick run command** | `npx jest --testPathPattern=auth --passWithNoTests` |
| **Full suite command** | `npx jest` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npx jest --passWithNoTests`
- **Before `/gsd:verify-work`:** All 4 auth requirements manually smoke-tested via browser
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | 01 | 1 | AUTH-01 | unit | `npx jest __tests__/actions/auth.test.ts -t "login" --passWithNoTests` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | AUTH-02 | integration | `npx jest __tests__/proxy.test.ts --passWithNoTests` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | AUTH-03 | unit | `npx jest __tests__/lib/session.test.ts --passWithNoTests` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | AUTH-04 | unit | `npx jest __tests__/actions/auth.test.ts -t "logout" --passWithNoTests` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `jest.config.ts` — Jest configuration for Next.js 16 + TypeScript (if not already created)
- [ ] `__tests__/lib/session.test.ts` — covers AUTH-03 (cookie flags, encrypt/decrypt)
- [ ] `__tests__/actions/auth.test.ts` — covers AUTH-01, AUTH-04
- [ ] `__tests__/proxy.test.ts` — covers AUTH-02
- [ ] Jest install: `npm install --save-dev jest @jest/globals ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Login flow end-to-end | AUTH-01 | Requires browser with cookies | Visit /admin/login, enter credentials, verify redirect to dashboard |
| Session survives refresh | AUTH-03 | Requires real browser cookie persistence | After login, refresh page, verify still authenticated |
| Logout + back button | AUTH-04 | Requires browser history interaction | Click logout, press back button, verify no admin content visible |
| Route protection | AUTH-02 | Requires real Next.js proxy.ts execution | Visit /admin without session, verify redirect to /admin/login |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
