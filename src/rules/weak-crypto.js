const PATTERNS = [
  { name: 'MD5', regex: /createHash\s*\(\s*['"`]md5['"`]/i },
  { name: 'SHA1', regex: /createHash\s*\(\s*['"`]sha1['"`]/i },
  { name: 'MD5 (alt)', regex: /\bcrypto\.MD5\b/i },
  { name: 'SHA1 (alt)', regex: /\bcrypto\.SHA1\b/i },
];

export default {
  name: 'weak-crypto',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      for (const { name, regex } of PATTERNS) {
        if (regex.test(line)) {
          issues.push({
            rule: 'weak-crypto',
            severity: 'critical',
            file,
            line: i + 1,
            message: `พบ ${name} — algorithm ที่แตกแล้ว ไม่ควรใช้กับ password/security`,
            fix: 'ใช้ SHA-256 ขึ้นไป สำหรับ password ใช้ bcrypt/argon2',
          });
          break;
        }
      }
    });
    return issues;
  },
};
