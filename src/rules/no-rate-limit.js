const SENSITIVE_ROUTES = /\b(app|router)\.(post|put)\s*\(\s*['"`][^'"`]*\b(login|signin|register|signup|reset|forgot|otp|verify)\b/i;
const RATE_LIMIT_KEYWORDS = /\b(rateLimit|rate_limit|RateLimit|throttle|slowDown|express-rate-limit|limiter)\b/;

export default {
  name: 'no-rate-limit',
  severity: 'warning',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    const fileHasRateLimit = RATE_LIMIT_KEYWORDS.test(content);

    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      if (!SENSITIVE_ROUTES.test(line)) return;
      if (RATE_LIMIT_KEYWORDS.test(line)) return;
      if (fileHasRateLimit) return;

      issues.push({
        rule: 'no-rate-limit',
        severity: 'warning',
        file,
        line: i + 1,
        message: 'พบ login/register endpoint แต่ไม่เห็น rate limiting — เสี่ยง brute force / abuse',
        fix: 'ใช้ express-rate-limit: app.use("/login", rateLimit({ windowMs: 60_000, max: 5 }))',
      });
    });
    return issues;
  },
};
