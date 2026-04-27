const PATTERNS = [
  /res\.redirect\s*\([^)]*req\.(body|query|params)/,
  /window\.location\s*\.(href|assign|replace)\s*=\s*[^;]*req\.(body|query|params)/,
  /window\.location\s*=\s*[^;]*req\.(body|query|params)/,
];

export default {
  name: 'open-redirect',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      for (const regex of PATTERNS) {
        if (regex.test(line)) {
          issues.push({
            rule: 'open-redirect',
            severity: 'critical',
            file,
            line: i + 1,
            message: 'redirect ไป URL ที่มาจาก user — เสี่ยง phishing (open redirect)',
            fix: 'whitelist URL หรือ path ที่ยอม redirect ไป — ห้ามใช้ user input ตรง ๆ',
          });
          break;
        }
      }
    });
    return issues;
  },
};
