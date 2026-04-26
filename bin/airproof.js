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
  airproof [path]            Audit code at path (default: current directory)
  airproof --help, -h        Show this help
  airproof --version, -v     Show version

Examples:
  airproof                   # Scan current directory
  airproof ./src             # Scan ./src folder
  airproof ../my-project     # Scan a sibling project

Exit codes:
  0  No critical issues
  1  Critical issues found

Docs: https://github.com/Warayutkub/airproof
`);
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

const issues = await audit(target);
printReport(issues, target);

const hasCritical = issues.some(i => i.severity === 'critical');
process.exit(hasCritical ? 1 : 0);
