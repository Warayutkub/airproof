const UPDATE_WITH_SPREAD = /\b(update|updateOne|updateMany|findOneAndUpdate|findByIdAndUpdate|save)\s*\([^)]*\.\.\.req\.(body|query)/;
const UPDATE_DIRECT_BODY = /\b(update|updateOne|updateMany|findOneAndUpdate|findByIdAndUpdate)\s*\(\s*[^,]+,\s*req\.(body|query)\s*\)/;

export default {
  name: 'mass-assignment',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      if (UPDATE_WITH_SPREAD.test(line) || UPDATE_DIRECT_BODY.test(line)) {
        issues.push({
          rule: 'mass-assignment',
          severity: 'critical',
          file,
          line: i + 1,
          message: 'ส่ง req.body ทั้งก้อนไป update — user อาจ inject field เช่น { isAdmin: true }',
          fix: 'whitelist field ที่ยอมแก้ได้: const { name, email } = req.body; update({ name, email })',
        });
      }
    });
    return issues;
  },
};
