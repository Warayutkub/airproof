const CMD_WITH_TEMPLATE = /\b(exec|execSync|spawn|spawnSync|execFile)\s*\(\s*`[^`]*\$\{/;
const CMD_WITH_CONCAT = /\b(exec|execSync|spawn|spawnSync|execFile)\s*\(\s*['"`][^'"`]*['"`]\s*\+/;
const CMD_WITH_REQ = /\b(exec|execSync|spawn|spawnSync|execFile)\s*\([^)]*req\.(body|query|params)/;

export default {
  name: 'command-injection',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      const matches =
        CMD_WITH_TEMPLATE.test(line) ||
        CMD_WITH_CONCAT.test(line) ||
        CMD_WITH_REQ.test(line);

      if (matches) {
        issues.push({
          rule: 'command-injection',
          severity: 'critical',
          file,
          line: i + 1,
          message: 'พบ exec/spawn ที่รับ input แบบ dynamic — เสี่ยง command injection',
          fix: 'ใช้ array form: spawn("cmd", [arg1, arg2]) แทน string + sanitize input',
        });
      }
    });
    return issues;
  },
};
