const COOKIE_CALL = /\bres\.cookie\s*\(/;
const HAS_SECURE = /\bsecure\s*:\s*true/i;
const HAS_HTTPONLY = /\bhttpOnly\s*:\s*true/i;
const HAS_SAMESITE = /\bsameSite\s*:/i;

export default {
  name: 'insecure-cookie',
  severity: 'warning',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      if (!COOKIE_CALL.test(line)) return;

      // Look at this + next 5 lines for the options object
      const window = lines.slice(i, i + 6).join(' ');
      const missing = [];
      if (!HAS_SECURE.test(window)) missing.push('secure');
      if (!HAS_HTTPONLY.test(window)) missing.push('httpOnly');
      if (!HAS_SAMESITE.test(window)) missing.push('sameSite');

      if (missing.length === 0) return;

      issues.push({
        rule: 'insecure-cookie',
        severity: 'warning',
        file,
        line: i + 1,
        message: `cookie ขาด flag: ${missing.join(', ')} — เสี่ยง XSS / CSRF / MITM`,
        fix: 'เพิ่ม { secure: true, httpOnly: true, sameSite: "strict" } ในตัวเลือก',
      });
    });
    return issues;
  },
};
