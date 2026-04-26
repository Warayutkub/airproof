const SENSITIVE_TERMS = '(password|passwd|secret|token|apiKey|api_key|jwt|credential|cookie|sessionId|session_id|privateKey|private_key|creditCard|credit_card|cvv|ssn)';

const LOG_FNS = '(console\\.(log|info|warn|error|debug)|logger\\.(log|info|warn|error|debug)|log\\.(info|warn|error|debug))';

const PATTERN = new RegExp(`${LOG_FNS}\\s*\\([^)]*\\b${SENSITIVE_TERMS}\\b`, 'i');

export default {
  name: 'sensitive-logging',
  severity: 'warning',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      if (PATTERN.test(line)) {
        issues.push({
          rule: 'sensitive-logging',
          severity: 'warning',
          file,
          line: i + 1,
          message: 'log ข้อมูลที่ดูเป็น sensitive (password/token/secret) — log file อาจรั่วถ้ามีคนเข้าถึง',
          fix: 'mask ก่อน log: console.log({ user: { email: u.email } }) หรือ redact field sensitive',
        });
      }
    });
    return issues;
  },
};
