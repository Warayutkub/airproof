const FS_WITH_REQ = /\b(readFile|readFileSync|createReadStream|writeFile|writeFileSync|unlink|stat)\s*\([^)]*req\.(body|query|params)/;
const PATH_JOIN_WITH_REQ = /path\.(join|resolve)\s*\([^)]*req\.(body|query|params)/;
const SENDFILE_WITH_REQ = /\b(sendFile|sendfile|download)\s*\([^)]*req\.(body|query|params)/;

export default {
  name: 'path-traversal',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    const issues = [];
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;

      const matches =
        FS_WITH_REQ.test(line) ||
        PATH_JOIN_WITH_REQ.test(line) ||
        SENDFILE_WITH_REQ.test(line);

      if (matches) {
        issues.push({
          rule: 'path-traversal',
          severity: 'critical',
          file,
          line: i + 1,
          message: 'ใช้ req input ตรง ๆ กับ file system — เสี่ยง path traversal (../../etc/passwd)',
          fix: 'ใช้ path.basename() กรองชื่อไฟล์ + จำกัด extension + check ว่าอยู่ใน allowed directory',
        });
      }
    });
    return issues;
  },
};
