const PATTERNS = [
  { name: 'innerHTML assignment', regex: /\.innerHTML\s*=(?!=)/ },
  { name: 'outerHTML assignment', regex: /\.outerHTML\s*=(?!=)/ },
  { name: 'dangerouslySetInnerHTML', regex: /dangerouslySetInnerHTML/ },
  { name: 'eval()', regex: /\beval\s*\(/ },
  { name: 'new Function()', regex: /\bnew\s+Function\s*\(/ },
  { name: 'document.write', regex: /document\.write(ln)?\s*\(/ },
];

export default {
  name: 'xss',
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
            rule: 'xss',
            severity: 'critical',
            file,
            line: i + 1,
            message: `พบการใช้ ${name} — เสี่ยง XSS ถ้า input มาจาก user`,
            fix: 'ใช้ textContent หรือ React/Vue binding ปกติ + sanitize ด้วย DOMPurify',
          });
          break;
        }
      }
    });
    return issues;
  },
};
