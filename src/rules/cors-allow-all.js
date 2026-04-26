const PATTERNS = [
  /\.use\s*\(\s*cors\s*\(\s*\)\s*\)/,
  /cors\s*\(\s*\{\s*origin\s*:\s*['"`]\*['"`]/,
  /cors\s*\(\s*\{\s*origin\s*:\s*true\b/,
  /['"`]Access-Control-Allow-Origin['"`]\s*,\s*['"`]\*['"`]/,
  /setHeader\s*\(\s*['"`]Access-Control-Allow-Origin['"`]\s*,\s*['"`]\*['"`]/,
];

export default {
  name: 'cors-allow-all',
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
            rule: 'cors-allow-all',
            severity: 'critical',
            file,
            line: i + 1,
            message: 'CORS เปิด allow-all (*) — เว็บอื่นเรียก API คุณได้หมด',
            fix: 'จำกัด origin: cors({ origin: "https://your-domain.com" })',
          });
          break;
        }
      }
    });
    return issues;
  },
};
