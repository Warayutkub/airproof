const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
};

const ICON = {
  critical: `${c.red}●${c.reset}`,
  warning: `${c.yellow}●${c.reset}`,
  info: `${c.cyan}●${c.reset}`,
};

const LABEL = {
  critical: `${c.red}${c.bold}CRITICAL${c.reset}`,
  warning: `${c.yellow}${c.bold}WARNING${c.reset}`,
  info: `${c.cyan}${c.bold}INFO${c.reset}`,
};

export function printReport(issues, target) {
  console.log();
  console.log(`${c.bold}${c.cyan}Airproof${c.reset} ${c.dim}— scanning ${target}${c.reset}`);
  console.log();

  if (issues.length === 0) {
    console.log(`${c.green}${c.bold}✓ No issues found.${c.reset} ${c.dim}Your code is airproof.${c.reset}`);
    console.log();
    return;
  }

  const grouped = { critical: [], warning: [], info: [] };
  for (const issue of issues) {
    (grouped[issue.severity] || grouped.info).push(issue);
  }

  const counts = [];
  if (grouped.critical.length) counts.push(`${c.red}${grouped.critical.length} critical${c.reset}`);
  if (grouped.warning.length) counts.push(`${c.yellow}${grouped.warning.length} warning${c.reset}`);
  if (grouped.info.length) counts.push(`${c.cyan}${grouped.info.length} info${c.reset}`);

  console.log(`${c.bold}Found:${c.reset} ${counts.join(', ')}`);
  console.log();

  for (const severity of ['critical', 'warning', 'info']) {
    for (const issue of grouped[severity]) {
      const loc = issue.line ? `${issue.file}:${issue.line}` : issue.file;
      console.log(`  ${ICON[severity]} ${LABEL[severity]} ${c.dim}[${issue.rule}]${c.reset}`);
      console.log(`    ${c.cyan}${loc}${c.reset}`);
      console.log(`    ${issue.message}`);
      console.log(`    ${c.green}→ ${issue.fix}${c.reset}`);
      console.log();
    }
  }

  if (grouped.critical.length > 0) {
    console.log(`${c.red}${c.bold}✗ ${grouped.critical.length} critical issue(s) — fix before deploy.${c.reset}`);
  } else {
    console.log(`${c.yellow}⚠ No critical issues, but ${grouped.warning.length} warning(s) to review.${c.reset}`);
  }
  console.log();
}
