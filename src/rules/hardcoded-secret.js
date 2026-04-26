const PATTERNS = [
  { name: 'OpenAI API key', regex: /sk-[A-Za-z0-9]{20,}/ },
  { name: 'Anthropic API key', regex: /sk-ant-[A-Za-z0-9_-]{20,}/ },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Google API key', regex: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'GitHub token', regex: /gh[ps]_[A-Za-z0-9]{36}/ },
  { name: 'Stripe key', regex: /sk_(test|live)_[A-Za-z0-9]{24,}/ },
  {
    name: 'Generic credential assignment',
    regex: /\b(api[_-]?key|secret|token|password|access[_-]?key)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i,
  },
];

export default {
  name: 'hardcoded-secret',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

      for (const { name, regex } of PATTERNS) {
        if (regex.test(line)) {
          issues.push({
            rule: 'hardcoded-secret',
            severity: 'critical',
            file,
            line: i + 1,
            message: `พบ ${name} ฝังในโค้ด — ใครเข้า repo ได้ก็ใช้ key ได้`,
            fix: 'ย้ายไปใส่ใน .env แล้วเรียกผ่าน process.env.YOUR_KEY',
          });
          break;
        }
      }
    });

    return issues;
  },
};
