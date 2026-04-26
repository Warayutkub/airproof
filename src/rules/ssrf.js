const SSRF_PATTERNS = [
  /\b(fetch|got)\s*\([^)]*req\.(body|query|params)/,
  /\baxios\.(get|post|put|delete|patch|head|request)\s*\([^)]*req\.(body|query|params)/,
  /\baxios\s*\(\s*\{[^}]*url\s*:\s*req\.(body|query|params)/,
  /\bhttp(s)?\.(get|request)\s*\([^)]*req\.(body|query|params)/,
];

export default {
  name: 'ssrf',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      for (const regex of SSRF_PATTERNS) {
        if (regex.test(line)) {
          issues.push({
            rule: 'ssrf',
            severity: 'critical',
            file,
            line: i + 1,
            message: 'Server ยิง URL ตาม req input — เสี่ยง SSRF (user ทำให้ server เข้าถึง internal network ได้)',
            fix: 'whitelist domain ที่ยอม + reject IP ภายใน (127.0.0.1, 10.x, 192.168.x, 169.254.x)',
          });
          break;
        }
      }
    });
    return issues;
  },
};
