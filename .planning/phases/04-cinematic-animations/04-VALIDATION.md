---
phase: 4
slug: cinematic-animations
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Build verification (animation is visual) |
| **Config file** | N/A |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual visual check
- **Before `/gsd:verify-work`:** Full build + browser animation review
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | 01 | 1 | ANIM-05 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | ANIM-01 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | ANIM-02,03 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| TBD | 01 | 1 | ANIM-04 | smoke | `npm run build` | ❌ W0 | ⬜ pending |

---

## Wave 0 Requirements

No test framework needed — animation phase is verified visually + build compilation.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Page transition clip-path wipe | ANIM-01 | Visual animation | Navigate between pages, verify smooth wipe transition |
| Scroll reveals on grid items | ANIM-02 | Visual animation | Scroll homepage, verify grid items fade up + scale in |
| Staggered grid cascade | ANIM-03 | Visual animation | Scroll to grid, verify items appear in wave pattern |
| CTA hover scale | ANIM-04 | Mouse interaction | Hover CTAs, verify subtle scale lift |
| Reduced motion disabled | ANIM-05 | OS setting required | Enable reduced motion in OS, verify no animations |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify
- [ ] Sampling continuity maintained
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
