import { readFile, readdir } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import rules from './rules/index.js';

const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next',
  'coverage', '.cache', '.turbo', 'out',
]);

const SCAN_EXTENSIONS = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs',
]);

async function* walk(dir, rootDir = dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath, rootDir);
    } else if (entry.isFile()) {
      yield { fullPath, relPath: relative(rootDir, fullPath) };
    }
  }
}

export async function audit(rootDir) {
  const allIssues = [];

  // Repo-level rules (run once on the whole project)
  for (const rule of rules) {
    if (rule.scope === 'repo') {
      try {
        const issues = await rule.check(rootDir);
        allIssues.push(...issues);
      } catch (err) {
        console.error(`Rule "${rule.name}" failed:`, err.message);
      }
    }
  }

  // File-level rules (run per file)
  for await (const { fullPath, relPath } of walk(rootDir)) {
    if (!SCAN_EXTENSIONS.has(extname(fullPath))) continue;

    let content;
    try {
      content = await readFile(fullPath, 'utf-8');
    } catch {
      continue;
    }
    const lines = content.split('\n');

    for (const rule of rules) {
      if (rule.scope !== 'file') continue;
      try {
        const issues = rule.check(relPath, content, lines);
        allIssues.push(...issues);
      } catch (err) {
        console.error(`Rule "${rule.name}" failed on ${relPath}:`, err.message);
      }
    }
  }

  return allIssues;
}
