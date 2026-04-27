#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { audit } from '../src/scan.js';
import { printReport } from '../src/report.js';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  await readFile(resolve(here, '../package.json'), 'utf-8'),
);

const args = process.argv.slice(2);

function showHelp() {
  console.log(`
${pkg.name} v${pkg.version}
${pkg.description}

Usage:
  airproof [path] [options]

Options:
  --ignore <patterns>        Comma-separated patterns to skip (e.g. "tests/**,docs/**")
  --no-gitignore             Do not respect .gitignore (scan everything)
  --help, -h                 Show this help
  --version, -v              Show version

Examples:
  airproof                          # Scan current directory
  airproof ./src                    # Scan ./src folder
  airproof . --ignore "tests/**"    # Skip tests folder
  airproof . --no-gitignore         # Ignore .gitignore (scan all)

Ignore files:
  airproof respects .gitignore by default.
  Add a .airproofignore file to add custom patterns just for airproof.

Exit codes:
  0  No critical issues
  1  Critical issues found

Docs: https://github.com/Warayutkub/airproof
`);
}

function getOptionValue(flag) {
  const idx = args.findIndex(a => a === flag || a.startsWith(`${flag}=`));
  if (idx === -1) return null;
  const arg = args[idx];
  if (arg.includes('=')) return arg.split('=').slice(1).join('=');
  return args[idx + 1] ?? null;
}

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log(pkg.version);
  process.exit(0);
}

const target = args.find(a => !a.startsWith('-')) || '.';

const ignoreArg = getOptionValue('--ignore');
const extraIgnore = ignoreArg
  ? ignoreArg.split(',').map(p => p.trim()).filter(Boolean)
  : [];

const noGitignore = args.includes('--no-gitignore');

const issues = await audit(target, { extraIgnore, noGitignore });
printReport(issues, target);

const hasCritical = issues.some(i => i.severity === 'critical');
process.exit(hasCritical ? 1 : 0);
