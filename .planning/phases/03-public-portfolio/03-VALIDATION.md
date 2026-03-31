---
phase: 3
slug: public-portfolio
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest + Testing Library (Wave 0 installs) |
| **Config file** | `jest.config.ts` (Wave 0 creates) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npx jest && npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npx jest && npm run build`
- **Before `/gsd:verify-work`:** Full build + manual browser review (hero, grid, form, mobile)
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | 01 | 1 | PORT-01,02 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | PORT-07 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | PORT-08 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| TBD | 02 | 2 | PORT-03,04,05,10 | smoke+unit | `npm run build` + Jest | ❌ W0 | ⬜ pending |
| TBD | 02 | 2 | PORT-06 | integration | `npm run build` | ❌ W0 | ⬜ pending |
| TBD | 03 | 3 | LEAD-01,02,03,04 | unit | Jest contact action test | ❌ W0 | ⬜ pending |
| TBD | 03 | 3 | SEO-01,02,03,04 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| TBD | 03 | 3 | RESP-01,02 | manual | Browser + mobile emulation | N/A | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `jest.config.ts` — Jest configuration for Next.js 16 + TypeScript
- [ ] `jest.setup.ts` — @testing-library/jest-dom matchers
- [ ] `__tests__/actions/contact.test.ts` — covers LEAD-02, LEAD-04
- [ ] `__tests__/lib/vimeo.test.ts` — covers PORT-03 thumbnail fetch
- [ ] Jest install: `npm install --save-dev jest @jest/globals ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero video autoplays muted | PORT-01 | Requires browser with autoplay policy | Open site, verify hero plays without user interaction |
| Sound toggle works | PORT-02 | Requires audio output verification | Click sound toggle, verify audio plays |
| Hover-to-play on grid | PORT-04 | Requires mouse interaction | Hover over grid item, verify Vimeo iframe loads |
| Mobile touch fallback | PORT-05, RESP-02 | Requires touch device | Tap grid item on mobile, verify navigates to detail |
| No horizontal scroll mobile | RESP-01 | Requires viewport testing | Chrome DevTools mobile emulation, check all breakpoints |
| Vimeo facade click-to-load | PORT-06 | Requires user interaction | Click poster on detail page, verify iframe loads |
| Contact form success state | LEAD-01 | Requires form interaction | Submit form, verify success message |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
