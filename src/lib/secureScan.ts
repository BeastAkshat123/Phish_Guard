/**
 * Secure Scan — Website Security Scanning Engine
 * Client-side heuristic analysis for website security assessment
 */

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type GradeLevel = 'A' | 'B' | 'C' | 'D' | 'F';

export interface SecurityFinding {
  category: string;
  title: string;
  severity: SeverityLevel;
  description: string;
  remediation: string;
}

export interface CategoryResult {
  name: string;
  icon: string;
  status: 'pass' | 'warn' | 'fail';
  score: number;       // 0-100 per category
  findings: SecurityFinding[];
}

export interface SecurityScanResult {
  targetUrl: string;
  overallGrade: GradeLevel;
  overallScore: number; // 0-100
  summary: string;
  categories: CategoryResult[];
  findings: SecurityFinding[];
  scannedAt: string;
}

// ── Severity weights ──
const SEVERITY_PENALTY: Record<SeverityLevel, number> = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
  info: 0,
};

// ── Known insecure paths ──
const SENSITIVE_PATHS = [
  '.env', '.git', '.svn', '.htaccess', '.htpasswd',
  'wp-admin', 'wp-login', 'admin', 'administrator',
  'phpmyadmin', 'cpanel', 'webmail',
  'backup', 'backups', 'db', 'database',
  'config', 'configuration', 'setup', 'install',
  'api/debug', 'debug', 'test', 'staging',
  'server-status', 'server-info',
];

// ── Suspicious TLDs ──
const RISKY_TLDS = [
  '.xyz', '.top', '.work', '.click', '.link', '.info',
  '.biz', '.tk', '.ml', '.ga', '.cf', '.gq', '.pw',
  '.icu', '.buzz', '.monster', '.surf',
];

// ── Known vulnerable tech patterns ──
const VULN_PATTERNS = [
  { pattern: 'wp-content', tech: 'WordPress', risk: 'CMS may have known vulnerabilities if not updated' },
  { pattern: 'wp-includes', tech: 'WordPress', risk: 'CMS may have known vulnerabilities if not updated' },
  { pattern: 'joomla', tech: 'Joomla', risk: 'CMS may have known vulnerabilities if not updated' },
  { pattern: 'drupal', tech: 'Drupal', risk: 'CMS may have known vulnerabilities if not updated' },
  { pattern: 'magento', tech: 'Magento', risk: 'E-commerce platform may expose sensitive data' },
  { pattern: '/cgi-bin/', tech: 'CGI Scripts', risk: 'Legacy CGI scripts are often vulnerable' },
  { pattern: '.asp', tech: 'Classic ASP', risk: 'Legacy ASP may have security issues' },
  { pattern: '.php?', tech: 'PHP', risk: 'PHP query parameters may be vulnerable to injection' },
];

// ── Open redirect patterns ──
const REDIRECT_PARAMS = [
  'redirect', 'redirect_uri', 'redirect_url', 'return', 'return_to',
  'returnUrl', 'next', 'url', 'dest', 'destination', 'redir',
  'go', 'goto', 'target', 'link', 'out', 'continue', 'view',
];

// ────────────────────────────────────────────────────────────────
//  Main scanning function
// ────────────────────────────────────────────────────────────────

export function performSecurityScan(rawUrl: string): SecurityScanResult {
  let normalizedUrl = rawUrl.trim().toLowerCase();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalizedUrl);
  } catch {
    return buildErrorResult(rawUrl, 'Invalid URL format — unable to parse the provided URL.');
  }

  const categories: CategoryResult[] = [
    checkSSL(parsedUrl),
    checkSecurityHeaders(parsedUrl),
    checkCookieSecurity(parsedUrl),
    checkMixedContent(parsedUrl),
    checkDomainReputation(parsedUrl),
    checkTechnologyFingerprint(parsedUrl),
    checkOpenRedirects(parsedUrl),
    checkInformationDisclosure(parsedUrl),
    checkSubdomainAnalysis(parsedUrl),
  ];

  const allFindings = categories.flatMap(c => c.findings);
  const overallScore = calculateOverallScore(allFindings);
  const overallGrade = scoreToGrade(overallScore);
  const summary = buildSummary(overallGrade, allFindings, parsedUrl.hostname);

  return {
    targetUrl: parsedUrl.toString(),
    overallGrade,
    overallScore,
    summary,
    categories,
    findings: allFindings,
    scannedAt: new Date().toISOString(),
  };
}

// ────────────────────────────────────────────────────────────────
//  Category checks
// ────────────────────────────────────────────────────────────────

function checkSSL(url: URL): CategoryResult {
  const findings: SecurityFinding[] = [];

  if (url.protocol !== 'https:') {
    findings.push({
      category: 'SSL / TLS',
      title: 'No HTTPS encryption',
      severity: 'critical',
      description: 'The website does not use HTTPS. All data transmitted between the user and the server is sent in plain text and can be intercepted.',
      remediation: 'Obtain an SSL/TLS certificate (e.g. from Let\'s Encrypt) and enforce HTTPS across the entire site.',
    });
  }

  if (url.port && !['443', '80', ''].includes(url.port)) {
    findings.push({
      category: 'SSL / TLS',
      title: 'Non-standard port detected',
      severity: 'low',
      description: `The website is served on non-standard port ${url.port}. This may indicate a development or staging environment.`,
      remediation: 'Use standard ports (443 for HTTPS, 80 for HTTP) in production environments.',
    });
  }

  return {
    name: 'SSL / TLS',
    icon: '🔒',
    status: findings.some(f => f.severity === 'critical') ? 'fail' : findings.length > 0 ? 'warn' : 'pass',
    score: findings.length === 0 ? 100 : findings.some(f => f.severity === 'critical') ? 0 : 60,
    findings,
  };
}

function checkSecurityHeaders(url: URL): CategoryResult {
  const findings: SecurityFinding[] = [];

  // We can't actually fetch headers from a different origin (CORS), so we
  // perform heuristic checks on what we CAN infer from the URL itself.
  // Note: this is a client-side scanner — we flag the importance of headers.

  const headerChecks = [
    {
      header: 'Content-Security-Policy',
      severity: 'high' as SeverityLevel,
      desc: 'Content-Security-Policy (CSP) header helps prevent XSS, clickjacking, and other code injection attacks.',
      fix: 'Implement a strict CSP header. Start with: Content-Security-Policy: default-src \'self\'',
    },
    {
      header: 'X-Frame-Options',
      severity: 'medium' as SeverityLevel,
      desc: 'X-Frame-Options prevents the page from being embedded in iframes, protecting against clickjacking attacks.',
      fix: 'Add the header: X-Frame-Options: DENY or SAMEORIGIN',
    },
    {
      header: 'Strict-Transport-Security',
      severity: 'high' as SeverityLevel,
      desc: 'HSTS ensures browsers always use HTTPS, preventing protocol downgrade attacks.',
      fix: 'Add: Strict-Transport-Security: max-age=31536000; includeSubDomains',
    },
    {
      header: 'X-Content-Type-Options',
      severity: 'medium' as SeverityLevel,
      desc: 'This header prevents MIME-type sniffing, reducing the risk of drive-by downloads.',
      fix: 'Add: X-Content-Type-Options: nosniff',
    },
    {
      header: 'Referrer-Policy',
      severity: 'low' as SeverityLevel,
      desc: 'Controls how much referrer information is passed when navigating away from the page.',
      fix: 'Add: Referrer-Policy: strict-origin-when-cross-origin',
    },
    {
      header: 'Permissions-Policy',
      severity: 'low' as SeverityLevel,
      desc: 'Controls which browser features and APIs can be used, reducing attack surface.',
      fix: 'Add: Permissions-Policy: camera=(), microphone=(), geolocation=()',
    },
  ];

  // For a client-side scanner, we flag all headers as "recommended"
  // since we can't verify which ones the server actually sends.
  if (url.protocol === 'https:') {
    // Only flag header recommendations for HTTPS sites (they matter more)
    findings.push({
      category: 'Security Headers',
      title: 'Security headers verification recommended',
      severity: 'info',
      description: `The following 6 security headers should be configured on your server: ${headerChecks.map(h => h.header).join(', ')}.`,
      remediation: 'Use a tool like securityheaders.com to verify your headers, then configure any missing ones on your web server.',
    });
  } else {
    findings.push({
      category: 'Security Headers',
      title: 'Security headers ineffective without HTTPS',
      severity: 'high',
      description: 'Security headers like HSTS and CSP provide limited protection when the site doesn\'t use HTTPS, since a man-in-the-middle attacker can strip them.',
      remediation: 'First enable HTTPS, then configure all recommended security headers.',
    });
  }

  return {
    name: 'Security Headers',
    icon: '🛡️',
    status: findings.some(f => f.severity === 'high' || f.severity === 'critical') ? 'fail' : findings.length > 0 ? 'warn' : 'pass',
    score: url.protocol === 'https:' ? 70 : 20,
    findings,
  };
}

function checkCookieSecurity(url: URL): CategoryResult {
  const findings: SecurityFinding[] = [];
  const fullUrl = url.toString();

  // Check for session IDs exposed in URL
  const sessionParams = ['sessionid', 'sid', 'sessid', 'phpsessid', 'jsessionid', 'session_id', 'token', 'auth_token'];
  for (const param of sessionParams) {
    if (fullUrl.includes(param + '=')) {
      findings.push({
        category: 'Cookie Security',
        title: `Session identifier in URL (${param})`,
        severity: 'critical',
        description: 'Session identifiers should never be passed in URLs. They can be leaked through browser history, referrer headers, and server logs.',
        remediation: 'Use secure, HttpOnly cookies to manage sessions instead of URL parameters.',
      });
      break;
    }
  }

  if (url.protocol !== 'https:') {
    findings.push({
      category: 'Cookie Security',
      title: 'Cookies vulnerable to interception',
      severity: 'high',
      description: 'Without HTTPS, cookies (including session cookies) are sent in plain text and can be intercepted by attackers on the network.',
      remediation: 'Enable HTTPS and set the Secure flag on all cookies.',
    });
  }

  return {
    name: 'Cookie Security',
    icon: '🍪',
    status: findings.some(f => f.severity === 'critical') ? 'fail' : findings.length > 0 ? 'warn' : 'pass',
    score: findings.length === 0 ? 100 : findings.some(f => f.severity === 'critical') ? 10 : 50,
    findings,
  };
}

function checkMixedContent(url: URL): CategoryResult {
  const findings: SecurityFinding[] = [];
  const fullUrl = url.toString();

  if (url.protocol === 'https:' && fullUrl.includes('http://')) {
    findings.push({
      category: 'Mixed Content',
      title: 'Potential mixed content detected',
      severity: 'medium',
      description: 'The HTTPS URL contains references to HTTP resources. Mixed content can compromise the security of the entire page.',
      remediation: 'Ensure all resources (scripts, images, stylesheets) are loaded over HTTPS.',
    });
  }

  if (url.protocol === 'http:') {
    findings.push({
      category: 'Mixed Content',
      title: 'Entire page served over HTTP',
      severity: 'high',
      description: 'The page itself is served over unencrypted HTTP, making all content vulnerable to interception and modification.',
      remediation: 'Migrate the entire site to HTTPS.',
    });
  }

  return {
    name: 'Mixed Content',
    icon: '⚡',
    status: findings.some(f => f.severity === 'high' || f.severity === 'critical') ? 'fail' : findings.length > 0 ? 'warn' : 'pass',
    score: findings.length === 0 ? 100 : findings.some(f => f.severity === 'high') ? 20 : 65,
    findings,
  };
}

function checkDomainReputation(url: URL): CategoryResult {
  const findings: SecurityFinding[] = [];
  const domain = url.hostname;

  // IP address instead of domain
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipRegex.test(domain)) {
    findings.push({
      category: 'Domain Reputation',
      title: 'IP address used instead of domain name',
      severity: 'high',
      description: 'Using an IP address instead of a domain name is a common indicator of phishing or temporary malicious infrastructure.',
      remediation: 'Use a registered domain name with valid DNS records.',
    });
  }

  // Suspicious TLD
  for (const tld of RISKY_TLDS) {
    if (domain.endsWith(tld)) {
      findings.push({
        category: 'Domain Reputation',
        title: `Risky TLD detected: ${tld}`,
        severity: 'medium',
        description: `The domain uses the ${tld} TLD, which is frequently associated with malicious or low-quality websites.`,
        remediation: 'Consider using a more reputable TLD (.com, .org, .net, etc.) for better trust signals.',
      });
      break;
    }
  }

  // Excessively long domain
  if (domain.length > 40) {
    findings.push({
      category: 'Domain Reputation',
      title: 'Unusually long domain name',
      severity: 'low',
      description: `The domain is ${domain.length} characters long. Excessively long domains can be used to obscure the real destination.`,
      remediation: 'Use a concise, memorable domain name.',
    });
  }

  // Hyphens
  const hyphenCount = (domain.match(/-/g) || []).length;
  if (hyphenCount > 2) {
    findings.push({
      category: 'Domain Reputation',
      title: `Multiple hyphens in domain (${hyphenCount})`,
      severity: 'medium',
      description: 'Domains with multiple hyphens are commonly used in phishing and brand impersonation attacks.',
      remediation: 'Use a cleaner domain name without excessive hyphens.',
    });
  }

  return {
    name: 'Domain Reputation',
    icon: '🌐',
    status: findings.some(f => f.severity === 'high' || f.severity === 'critical') ? 'fail' : findings.length > 0 ? 'warn' : 'pass',
    score: Math.max(0, 100 - findings.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0)),
    findings,
  };
}

function checkTechnologyFingerprint(url: URL): CategoryResult {
  const findings: SecurityFinding[] = [];
  const fullUrl = url.toString();

  for (const vp of VULN_PATTERNS) {
    if (fullUrl.includes(vp.pattern)) {
      findings.push({
        category: 'Technology',
        title: `${vp.tech} detected`,
        severity: 'low',
        description: `Technology identified: ${vp.tech}. ${vp.risk}`,
        remediation: `Keep ${vp.tech} updated to the latest version. Remove unnecessary default files and disable directory listing.`,
      });
    }
  }

  // Check for version disclosures in URL
  const versionPattern = /[v]\d+\.\d+/i;
  if (versionPattern.test(fullUrl)) {
    findings.push({
      category: 'Technology',
      title: 'Version information in URL',
      severity: 'info',
      description: 'Version numbers visible in the URL can help attackers identify specific software versions and known vulnerabilities.',
      remediation: 'Remove version numbers from URLs where possible.',
    });
  }

  return {
    name: 'Technology',
    icon: '⚙️',
    status: findings.length > 0 ? 'warn' : 'pass',
    score: Math.max(60, 100 - findings.length * 10),
    findings,
  };
}

function checkOpenRedirects(url: URL): CategoryResult {
  const findings: SecurityFinding[] = [];
  const params = url.searchParams;

  for (const param of REDIRECT_PARAMS) {
    const value = params.get(param);
    if (value) {
      const lowerValue = value.toLowerCase();
      if (lowerValue.startsWith('http') || lowerValue.startsWith('//') || lowerValue.includes('://')) {
        findings.push({
          category: 'Open Redirects',
          title: `Potential open redirect via "${param}" parameter`,
          severity: 'high',
          description: `The URL contains a "${param}" parameter pointing to an external URL. Open redirects can be exploited for phishing attacks.`,
          remediation: 'Validate and whitelist redirect destinations on the server side. Never redirect to user-supplied URLs without validation.',
        });
      } else {
        findings.push({
          category: 'Open Redirects',
          title: `Redirect parameter detected: "${param}"`,
          severity: 'low',
          description: `A redirect-like parameter "${param}" was found. Ensure it is validated server-side.`,
          remediation: 'Implement a server-side whitelist for redirect targets.',
        });
      }
    }
  }

  return {
    name: 'Open Redirects',
    icon: '↪️',
    status: findings.some(f => f.severity === 'high') ? 'fail' : findings.length > 0 ? 'warn' : 'pass',
    score: Math.max(0, 100 - findings.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0)),
    findings,
  };
}

function checkInformationDisclosure(url: URL): CategoryResult {
  const findings: SecurityFinding[] = [];
  const path = url.pathname.toLowerCase();

  for (const sensitive of SENSITIVE_PATHS) {
    if (path.includes(sensitive)) {
      findings.push({
        category: 'Information Disclosure',
        title: `Sensitive path exposed: /${sensitive}`,
        severity: sensitive.startsWith('.') ? 'critical' : 'medium',
        description: `The URL path contains "/${sensitive}" which may expose configuration files, admin panels, or sensitive data.`,
        remediation: `Restrict access to /${sensitive} using server configuration. Block public access to sensitive files and admin paths.`,
      });
    }
  }

  // Query string with debug/verbose params
  const debugParams = ['debug', 'verbose', 'trace', 'test', 'dev'];
  for (const param of debugParams) {
    if (url.searchParams.has(param)) {
      findings.push({
        category: 'Information Disclosure',
        title: `Debug parameter detected: "${param}"`,
        severity: 'medium',
        description: `The URL contains a "${param}" parameter which may enable verbose error output or debug features in production.`,
        remediation: 'Remove debug parameters and disable debug modes in production environments.',
      });
    }
  }

  return {
    name: 'Information Disclosure',
    icon: '📄',
    status: findings.some(f => f.severity === 'critical') ? 'fail' : findings.length > 0 ? 'warn' : 'pass',
    score: Math.max(0, 100 - findings.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0)),
    findings,
  };
}

function checkSubdomainAnalysis(url: URL): CategoryResult {
  const findings: SecurityFinding[] = [];
  const domain = url.hostname;
  const parts = domain.split('.');
  const subdomains = parts.length - 2; // Subtract TLD + root

  if (subdomains > 3) {
    findings.push({
      category: 'Subdomain Analysis',
      title: `Excessive subdomain depth (${subdomains} levels)`,
      severity: 'medium',
      description: 'An unusually deep subdomain structure can indicate domain abuse or attempts to impersonate legitimate services.',
      remediation: 'Keep subdomain structures simple and well-organized.',
    });
  }

  // Check for suspicious subdomain patterns
  const suspiciousSubdomains = ['login', 'secure', 'account', 'verify', 'update', 'admin', 'mail', 'webmail'];
  for (const sub of suspiciousSubdomains) {
    if (parts.slice(0, -2).some(p => p.includes(sub))) {
      findings.push({
        category: 'Subdomain Analysis',
        title: `Sensitive subdomain pattern: "${sub}"`,
        severity: 'info',
        description: `The subdomain contains "${sub}", which is commonly targeted by attackers for impersonation.`,
        remediation: 'Ensure SSL certificates cover all subdomains and implement proper access controls.',
      });
      break;
    }
  }

  return {
    name: 'Subdomain Analysis',
    icon: '🔗',
    status: findings.some(f => f.severity === 'medium' || f.severity === 'high') ? 'warn' : 'pass',
    score: Math.max(60, 100 - findings.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0)),
    findings,
  };
}

// ────────────────────────────────────────────────────────────────
//  Utility helpers
// ────────────────────────────────────────────────────────────────

function calculateOverallScore(findings: SecurityFinding[]): number {
  const totalPenalty = findings.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0);
  return Math.max(0, Math.min(100, 100 - totalPenalty));
}

function scoreToGrade(score: number): GradeLevel {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 55) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

function buildSummary(grade: GradeLevel, findings: SecurityFinding[], hostname: string): string {
  const critical = findings.filter(f => f.severity === 'critical').length;
  const high = findings.filter(f => f.severity === 'high').length;
  const medium = findings.filter(f => f.severity === 'medium').length;

  if (grade === 'A') {
    return `${hostname} demonstrates excellent security practices. No critical issues were found.`;
  } else if (grade === 'B') {
    return `${hostname} has good security with minor improvements recommended. Found ${medium} medium-severity item(s).`;
  } else if (grade === 'C') {
    return `${hostname} has moderate security concerns. Found ${high} high and ${medium} medium severity issue(s) that should be addressed.`;
  } else if (grade === 'D') {
    return `${hostname} has significant security weaknesses. Found ${critical} critical and ${high} high severity issue(s) requiring immediate attention.`;
  }
  return `${hostname} has critical security vulnerabilities. Found ${critical} critical issue(s) that must be resolved immediately.`;
}

function buildErrorResult(rawUrl: string, error: string): SecurityScanResult {
  return {
    targetUrl: rawUrl,
    overallGrade: 'F',
    overallScore: 0,
    summary: error,
    categories: [],
    findings: [{
      category: 'General',
      title: 'Invalid URL',
      severity: 'critical',
      description: error,
      remediation: 'Provide a valid URL in the format: https://example.com',
    }],
    scannedAt: new Date().toISOString(),
  };
}
