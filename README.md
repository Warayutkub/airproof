# Airproof

[![npm version](https://img.shields.io/npm/v/airproof.svg)](https://www.npmjs.com/package/airproof)
[![npm downloads](https://img.shields.io/npm/dm/airproof.svg)](https://www.npmjs.com/package/airproof)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Warayutkub/airproof?style=social)](https://github.com/Warayutkub/airproof)

> Audit your JS/TS code for common security bugs — before you ship.
> Zero config. Plain English. 80% OWASP coverage.

```bash
npx airproof ./your-project
```

That's it. No setup. No config file. No login.

---

## Why?

You shipped code. Maybe you wrote it. Maybe Cursor wrote it. Maybe a friend wrote it. **All of you forget the same things:**

- ❌ The `/api/users/:id` endpoint without auth check
- ❌ The Stripe key hardcoded "just for testing"
- ❌ The `.env` you forgot to put in `.gitignore`
- ❌ The `db.query(\`SELECT ... ${id}\`)` that's a SQL injection
- ❌ The `cors()` with no options that lets anyone hit your API

Airproof catches these in 30 seconds. No setup. No paid tier (yet).

---

## What it checks (v0.1 — 19 rules)

### 🔴 Critical (15 rules)

| Rule | Catches |
|---|---|
| `syntax-error` | Invalid JS/TS that won't run |
| `env-in-git` | `.env` file not in `.gitignore` |
| `hardcoded-secret` | OpenAI / Anthropic / AWS / Stripe / GitHub keys in code |
| `missing-auth` | Express routes without auth middleware |
| `sql-injection` | `db.query` with template literals |
| `xss` | `innerHTML`, `eval`, `dangerouslySetInnerHTML` |
| `command-injection` | `exec`/`spawn` with user input |
| `cors-allow-all` | `cors()` with no options |
| `weak-crypto` | MD5, SHA1 |
| `path-traversal` | `fs.readFile(req.body.path)` |
| `mass-assignment` | `update({ ...req.body })` |
| `jwt-issues` | Hardcoded JWT secret, `jwt.decode()` without verify |
| `ssrf` | `fetch(req.body.url)` |
| `insecure-deserialization` | `require(req.body.module)` |
| `no-rate-limit` | `/login` and `/register` without rate limiting (warn) |

### 🟡 Warning (4 rules)

| Rule | Catches |
|---|---|
| `no-input-validation` | `req.body` straight to database |
| `http-not-https` | HTTP URLs in fetch (excluding localhost) |
| `exposed-errors` | `res.json(err)` leaking stack traces |
| `sensitive-logging` | `console.log` of password/token/secret |

### OWASP Top 10 coverage

| OWASP Risk | Status |
|---|---|
| A01: Broken Access Control | ✅ |
| A02: Cryptographic Failures | ✅ |
| A03: Injection | ✅ |
| A04: Insecure Design | — *(needs human review)* |
| A05: Security Misconfiguration | ✅ |
| A06: Vulnerable Components | — *(use `npm audit`)* |
| A07: Auth Failures | ✅ |
| A08: Data Integrity | ✅ |
| A09: Logging Failures | ✅ |
| A10: SSRF | ✅ |

**8 / 10 categories covered.**

---

## What it does NOT check

Airproof is one tool, not the only tool. **You still need:**

- ❌ **Business logic bugs** — code review, not regex.
- ❌ **Dependency vulnerabilities** — use `npm audit` or Snyk.
- ❌ **Type errors** — use TypeScript.
- ❌ **Style / formatting** — use ESLint + Prettier.
- ❌ **Performance** — use Lighthouse / profiler.
- ❌ **Accessibility** — use axe-core.

Airproof catches **patterns** that regex can spot. Anything requiring deep understanding of your business — get a human reviewer.

---

## Install / Use

### Run directly (no install)

```bash
npx airproof ./my-project
```

### Install globally

```bash
npm install -g airproof
airproof ./my-project
```

### CLI options

```
airproof [path]            Audit code at path (default: current dir)
airproof --help, -h        Show help
airproof --version, -v     Show version
```

### Exit codes (CI-friendly)

- `0` — no critical issues
- `1` — critical issues found

Use in CI:
```yaml
# .github/workflows/audit.yml
- run: npx airproof .
```

---

## Example output

```
Airproof — scanning ./my-project

Found: 3 critical, 1 warning

  ● CRITICAL [hardcoded-secret]
    src/server.js:7
    พบ Stripe key ฝังในโค้ด — ใครเข้า repo ได้ก็ใช้ key ได้
    → ย้ายไปใส่ใน .env แล้วเรียกผ่าน process.env.YOUR_KEY

  ● CRITICAL [missing-auth]
    src/api/users.js:12
    Endpoint GET /api/users/:id ไม่มี auth middleware — ใครก็เรียกได้
    → เพิ่ม middleware เช่น app.get('/api/users/:id', requireAuth, handler)

  ● CRITICAL [sql-injection]
    src/api/users.js:13
    พบ SQL query ใช้ template literal — เสี่ยง SQL injection
    → ใช้ parameterized query: db.query("SELECT ... WHERE id = $1", [id])

  ● WARNING [no-input-validation]
    src/api/posts.js:8
    ส่ง req.body/query/params เข้า database โดยไม่ validate
    → ใช้ schema validator (zod, valibot) ตรวจ shape ก่อน

✗ 3 critical issue(s) — fix before deploy.
```

---

## Comparison

| | Snyk Code | Semgrep | ESLint security | **Airproof** |
|---|---|---|---|---|
| OWASP coverage | ~95% | ~90% | ~40% | **80%** |
| Price | $52/dev/mo | Free (hard config) | Free | **Free** |
| Setup time | 30+ min | 1-2 hours | 20 min | **30 seconds** |
| Plain Thai output | ❌ | ❌ | ❌ | **✅** |

---

## Roadmap

- **v0.2**: `--json` output, `--config` file, `--ignore` comments
- **v0.3**: Python rules, more JWT patterns, race conditions
- **v0.4**: Dashboard (Pro), GitHub PR integration
- **v1.0**: AST-based rules (lower false positives)

---

## Contributing

PRs welcome — especially:
- New rules (regex first, AST later)
- Bug reports with code samples that triggered false positives
- Translations (English/other languages)

---

## License

MIT — see [LICENSE](./LICENSE).

---

Built by [@Warayutkub](https://github.com/Warayutkub) — a CS student in Thailand. Use freely. Tell others.
