const PATTERNS = [
  /\/\/\s*(TODO|FIXME|HACK|XXX)\s*:?\s*[^/\n]*\b(security|secur|insecure|vuln|hack|exploit|bypass|hardcode|inject)\b/i,
  /\/\*\s*(TODO|FIXME|HACK|XXX)\s*:?\s*[^*]*\b(security|secur|insecure|vuln|hack|exploit|bypass|hardcode|inject)\b/i,
];

export default {
  name: 'todo-security',
  severity: 'warning',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      for (const regex of PATTERNS) {
        if (regex.test(line)) {
          const trimmed = line.trim().slice(0, 100);
          issues.push({
            rule: 'todo-security',
            severity: 'warning',
            file,
            line: i + 1,
            message: `พบ TODO/FIXME ที่เกี่ยวกับ security: ${trimmed}`,
            fix: 'อย่าปล่อย TODO security ค้าง — แก้ก่อน deploy หรือ track ใน issue',
          });
          break;
        }
      }
    });
    return issues;
  },
};
