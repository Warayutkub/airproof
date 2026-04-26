---
name: "🐛 Bug report (false positive / false negative)"
about: When airproof flags safe code or misses real bugs
title: "[BUG] "
labels: bug
assignees: ''
---

## Type

- [ ] **False positive** — flagged my code but it's safe
- [ ] **False negative** — missed a real bug
- [ ] **Crash / error** — tool itself broke

## Rule name

e.g. `xss`, `sql-injection`, `missing-auth`

## Code sample

```js
// paste the code that triggered (or should have triggered) the rule
```

## Expected behavior

What should airproof have done?

## Actual behavior

What did airproof actually do? (paste output if useful)

## Environment

- airproof version: <!-- run `airproof --version` -->
- Node.js version: <!-- run `node --version` -->
- OS: <!-- Windows / macOS / Linux -->
- Project framework (if relevant): <!-- Next.js / Express / etc. -->

## Additional context

Anything else that might help — e.g. is this a 3rd-party file? auto-generated?
