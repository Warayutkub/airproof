const PATTERNS = [
  /res\.(json|send)\s*\(\s*(err(or)?|e)\b\s*\)/,
  /res\.status\s*\(\s*\d+\s*\)\.(json|send)\s*\(\s*(err(or)?|e)\b\s*\)/,
  /res\.(json|send)\s*\(\s*\{[^}]*\bstack\s*:/,
  /res\.(json|send)\s*\(\s*\{[^}]*(err(or)?|e)\.stack\b/,
];

export default {
  name: 'exposed-errors',
  severity: 'warning',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      for (const regex of PATTERNS) {
        if (regex.test(line)) {
          issues.push({
            rule: 'exposed-errors',
            severity: 'warning',
            file,
            line: i + 1,
            message: 'ส่ง error object ไปให้ client โดยตรง — stack trace อาจรั่ว path/structure ภายใน',
            fix: 'ส่ง message ที่ปลอดภัย: res.json({ error: "Something went wrong" }) + log error ฝั่ง server',
          });
          break;
        }
      }
    });
    return issues;
  },
};
