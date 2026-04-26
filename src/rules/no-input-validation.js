const DB_FN_WITH_REQ = /\b(create|insert|update|save|upsert|findOne|findFirst|findMany|find|deleteOne|deleteMany)\s*\(\s*\{?\s*(\.\.\.)?req\.(body|query|params)/;

export default {
  name: 'no-input-validation',
  severity: 'warning',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

      if (DB_FN_WITH_REQ.test(line)) {
        issues.push({
          rule: 'no-input-validation',
          severity: 'warning',
          file,
          line: i + 1,
          message: 'ส่ง req.body/query/params เข้า database โดยไม่ validate',
          fix: 'ใช้ schema validator (zod, valibot) ตรวจ shape ก่อน เช่น schema.parse(req.body)',
        });
      }
    });

    return issues;
  },
};
