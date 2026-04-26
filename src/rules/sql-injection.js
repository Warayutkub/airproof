const SQL_FN_WITH_TEMPLATE = /\b(query|execute|exec|raw|unsafe|prepare)\s*\(\s*`[^`]*\$\{/i;
const SQL_KEYWORD = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|WHERE|FROM|JOIN)\b/i;

export default {
  name: 'sql-injection',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

      if (!SQL_FN_WITH_TEMPLATE.test(line)) return;

      // Look at this line + next 2 lines for SQL keywords (multi-line queries)
      const window = lines.slice(i, i + 3).join(' ');
      if (!SQL_KEYWORD.test(window)) return;

      issues.push({
        rule: 'sql-injection',
        severity: 'critical',
        file,
        line: i + 1,
        message: 'พบ SQL query ใช้ template literal — เสี่ยง SQL injection',
        fix: 'ใช้ parameterized query: db.query("SELECT ... WHERE id = $1", [id])',
      });
    });

    return issues;
  },
};
