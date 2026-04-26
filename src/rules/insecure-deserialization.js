const PATTERNS = [
  {
    name: 'dynamic require',
    regex: /\brequire\s*\(\s*req\.(body|query|params)/,
    msg: 'require() ที่รับ path จาก user — โหลด malicious module ได้',
  },
  {
    name: 'dynamic import with user input',
    regex: /\bimport\s*\(\s*req\.(body|query|params)/,
    msg: 'import() ที่รับ path จาก user — โหลด malicious module ได้',
  },
  {
    name: 'eval JSON.parse',
    regex: /\beval\s*\(\s*[`"']\s*\(\s*\$\{|\beval\s*\(\s*JSON\.(parse|stringify)/,
    msg: 'ใช้ eval รวมกับ JSON parse — ถ้า input ฝัง JS code ก็รัน',
  },
  {
    name: 'unserialize untrusted',
    regex: /\b(unserialize|deserialize)\s*\(\s*req\.(body|query|params)/,
    msg: 'deserialize input จาก user ตรง ๆ — เสี่ยง object injection',
  },
];

export default {
  name: 'insecure-deserialization',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      for (const { name, regex, msg } of PATTERNS) {
        if (regex.test(line)) {
          issues.push({
            rule: 'insecure-deserialization',
            severity: 'critical',
            file,
            line: i + 1,
            message: `${msg} (${name})`,
            fix: 'ใช้ JSON.parse() ปกติ + validate ด้วย schema (zod) — อย่าใช้ require/eval กับ user input',
          });
          break;
        }
      }
    });
    return issues;
  },
};
