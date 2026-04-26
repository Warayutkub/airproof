import { parse } from '@babel/parser';

const PARSE_EXTENSIONS = /\.(jsx?|tsx?|mjs|cjs)$/;

export default {
  name: 'syntax-error',
  severity: 'critical',
  scope: 'file',

  check(file, content, lines) {
    if (!PARSE_EXTENSIONS.test(file)) return [];

    let parseErrors = [];
    try {
      const result = parse(content, {
        sourceType: 'module',
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
        plugins: ['jsx', 'typescript', 'topLevelAwait', 'decorators-legacy'],
        errorRecovery: true,
      });
      parseErrors = result.errors || [];
    } catch (err) {
      parseErrors = [err];
    }

    const issues = [];
    const seenLines = new Set();

    for (const err of parseErrors) {
      const errorLine = err.loc?.line ?? 0;
      if (seenLines.has(errorLine)) continue;
      seenLines.add(errorLine);

      const sourceLine = (lines[errorLine - 1] || '').trim();

      issues.push({
        rule: 'syntax-error',
        severity: 'critical',
        file,
        line: errorLine,
        message: `Syntax error: ${sourceLine}`,
        fix: 'เปิดไฟล์ใน IDE ดูจุดที่ highlight แดง',
      });
    }

    return issues;
  },
};
