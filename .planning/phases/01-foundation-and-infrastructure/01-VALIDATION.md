---
phase: 1
slug: foundation-and-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29.x + React Testing Library (Wave 0 installs) |
| **Config file** | `jest.config.ts` (Wave 0 creates) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npx jest` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npx jest`
- **Before `/gsd:verify-work`:** Full suite must be green + Railway deploy succeeds
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | 01 | 1 | FOUND-01 | smoke | `npm run build` exits 0 | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FOUND-02 | smoke | `npx prisma db push --skip-generate` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FOUND-03 | integration | `curl -I /projects/aether-nz.html` → 308 redirect | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FOUND-04 | unit | Jest render test for LazyMotion provider | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | FOUND-05 | smoke | `grep -r "0A0A0A" .next/static` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `jest.config.ts` — Jest configuration for Next.js 16 + TypeScript
- [ ] `jest.setup.ts` — @testing-library/jest-dom matchers
- [ ] `__tests__/providers/motion-provider.test.tsx` — covers FOUND-04
- [ ] Framework install: `npm install --save-dev jest @jest/globals ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Railway deployment succeeds | FOUND-02 | Requires Railway environment | Deploy via `railway up`, verify app loads at public URL |
| Design tokens produce correct dark editorial output | FOUND-05 | Visual verification | Open dev server, inspect test component renders dark theme correctly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
