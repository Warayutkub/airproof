import { readFile, readdir, access } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import ignore from 'ignore';
import rules from './rules/index.js';

const DEFAULT_IGNORE = [
  'node_modules/',
  '.git/',
  'dist/',
  'build/',
  '.next/',
  'out/',
  'coverage/',
  '.cache/',
  '.turbo/',
  '.svelte-kit/',
  '.vercel/',
  '.netlify/',
];

const SCAN_EXTENSIONS = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs',
]);

async function readIgnoreFile(rootDir, filename) {
  try {
    const content = await readFile(join(rootDir, filename), 'utf-8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  } catch {
    return [];
  }
}

async function buildIgnoreFilter(rootDir, options = {}) {
  const ig = ignore();
  ig.add(DEFAULT_IGNORE);

  if (!options.noGitignore) {
    const gitignore = await readIgnoreFile(rootDir, '.gitignore');
    if (gitignore.length) ig.add(gitignore);
  }

  const airproofignore = await readIgnoreFile(rootDir, '.airproofignore');
  if (airproofignore.length) ig.add(airproofignore);

  if (options.extraIgnore?.length) ig.add(options.extraIgnore);

  return ig;
}

async function* walk(dir, rootDir, ig) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const rel = relative(rootDir, fullPath).split('\\').join('/');
    const testPath = entry.isDirectory() ? `${rel}/` : rel;

    if (ig.ignores(testPath)) continue;

    if (entry.isDirectory()) {
      yield* walk(fullPath, rootDir, ig);
    } else if (entry.isFile()) {
      yield { fullPath, relPath: rel };
    }
  }
}

export async function audit(rootDir, options = {}) {
  const ig = await buildIgnoreFilter(rootDir, options);
  const allIssues = [];

  // Repo-level rules
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

  // File-level rules
  for await (const { fullPath, relPath } of walk(rootDir, rootDir, ig)) {
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
