const JWT_LITERAL_SECRET = /jwt\.(sign|verify)\s*\([^,)]+,\s*['"`][^'"`]+['"`]/;
const JWT_NO_VERIFY = /jwt\.decode\s*\(/;

export default {
  name: 'jwt-issues',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      if (JWT_LITERAL_SECRET.test(line)) {
        issues.push({
          rule: 'jwt-issues',
          severity: 'critical',
          file,
          line: i + 1,
          message: 'JWT secret ฝังในโค้ดเป็น literal string — อ่าน repo เจอ = forge token ได้',
          fix: 'ย้าย secret ไปใส่ใน process.env.JWT_SECRET (ยาว ≥ 32 ตัวอักษร random)',
        });
        return;
      }

      if (JWT_NO_VERIFY.test(line)) {
        issues.push({
          rule: 'jwt-issues',
          severity: 'critical',
          file,
          line: i + 1,
          message: 'jwt.decode() ไม่ได้ verify signature — ใครก็ปลอม token ได้',
          fix: 'ใช้ jwt.verify(token, secret) แทน — มันจะ throw ถ้า signature ผิด',
        });
      }
    });
    return issues;
  },
};
