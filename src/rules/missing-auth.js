const ROUTE_PATTERN = /\b(app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/;

const AUTH_KEYWORDS = [
  'auth', 'authenticate', 'verify', 'requireuser', 'requireauth',
  'protect', 'isauthenticated', 'jwt', 'session',
];

const PUBLIC_ROUTE_PATTERNS = [
  /\bhealth\b/i, /\bping\b/i, /\bstatus\b/i,
  /\blogin\b/i, /\bregister\b/i, /\bsignup\b/i,
  /\bsignin\b/i, /\bwebhook\b/i, /\bpublic\b/i,
  /\boauth\b/i, /\bcallback\b/i,
];

export default {
  name: 'missing-auth',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];

    lines.forEach((line, i) => {
      const m = line.match(ROUTE_PATTERN);
      if (!m) return;

      const method = m[2];
      const route = m[3];

      if (PUBLIC_ROUTE_PATTERNS.some(p => p.test(route))) return;

      const lower = line.toLowerCase();
      const hasAuth = AUTH_KEYWORDS.some(kw => lower.includes(kw));
      if (hasAuth) return;

      issues.push({
        rule: 'missing-auth',
        severity: 'critical',
        file,
        line: i + 1,
        message: `Endpoint ${method.toUpperCase()} ${route} ไม่มี auth middleware — ใครก็เรียกได้`,
        fix: `เพิ่ม middleware เช่น app.${method}('${route}', requireAuth, handler)`,
      });
    });

    return issues;
  },
};
