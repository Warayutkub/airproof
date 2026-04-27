const PATTERNS = [
  /Object\.assign\s*\(\s*\{[^}]*\}\s*,\s*req\.(body|query|params)/,
  /\b_\.(merge|defaultsDeep|set)\s*\([^)]*req\.(body|query|params)/,
  /\blodash\.(merge|defaultsDeep|set)\s*\([^)]*req\.(body|query|params)/,
  /\.\s*assign\s*\([^)]*\.\.\.req\.(body|query|params)/,
];

export default {
  name: 'prototype-pollution',
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
            rule: 'prototype-pollution',
            severity: 'critical',
            file,
            line: i + 1,
            message: 'merge req input เข้า object โดยตรง — เสี่ยง prototype pollution (__proto__)',
            fix: 'whitelist field ที่ยอม + ใช้ Object.create(null) สำหรับ destination',
          });
          break;
        }
      }
    });
    return issues;
  },
};
