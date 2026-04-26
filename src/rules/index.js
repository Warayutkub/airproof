import syntaxError from './syntax-error.js';
import envInGit from './env-in-git.js';
import hardcodedSecret from './hardcoded-secret.js';
import missingAuth from './missing-auth.js';
import sqlInjection from './sql-injection.js';
import noInputValidation from './no-input-validation.js';
import xss from './xss.js';
import commandInjection from './command-injection.js';
import corsAllowAll from './cors-allow-all.js';
import weakCrypto from './weak-crypto.js';
import httpNotHttps from './http-not-https.js';
import exposedErrors from './exposed-errors.js';
import pathTraversal from './path-traversal.js';
import massAssignment from './mass-assignment.js';
import jwtIssues from './jwt-issues.js';
import noRateLimit from './no-rate-limit.js';
import ssrf from './ssrf.js';
import insecureDeserialization from './insecure-deserialization.js';
import sensitiveLogging from './sensitive-logging.js';

export default [
  syntaxError,
  envInGit,
  hardcodedSecret,
  missingAuth,
  sqlInjection,
  noInputValidation,
  xss,
  commandInjection,
  corsAllowAll,
  weakCrypto,
  httpNotHttps,
  exposedErrors,
  pathTraversal,
  massAssignment,
  jwtIssues,
  noRateLimit,
  ssrf,
  insecureDeserialization,
  sensitiveLogging,
];
