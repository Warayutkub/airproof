const HTTP_FETCH = /\b(fetch|axios(?:\.(get|post|put|delete|patch))?|got|http\.(get|request))\s*\(\s*['"`]http:\/\//i;
const ALLOW_LOCAL = /http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])/i;

export default {
  name: 'http-not-https',
  severity: 'warning',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      if (!HTTP_FETCH.test(line)) return;
      if (ALLOW_LOCAL.test(line)) return;

      issues.push({
        rule: 'http-not-https',
        severity: 'warning',
        file,
        line: i + 1,
        message: 'พบ HTTP URL ใน fetch/axios — ข้อมูลไม่ถูก encrypt ระหว่างส่ง',
        fix: 'เปลี่ยนเป็น https:// ทุกที่ (ยกเว้น localhost ระหว่าง dev)',
      });
    });
    return issues;
  },
};
