export default function RemediationMatrix() {
  const remediations = [
    {
      type: "SQL Injection",
      cwe: "CWE-89 / OWASP A03",
      fix: "Use parameterized queries and prepared statements unconditionally. Never concatenate raw user input into SQL strings. Apply least-privilege DB user credentials and deploy a Web Application Firewall (WAF).",
      defense: "Prepared Statements",
      badgeClass: "bg-red-500/15 text-red-400 border-red-500/30",
    },
    {
      type: "Cross-Site Scripting (XSS)",
      cwe: "CWE-79 / OWASP A03",
      fix: "Context-aware HTML entity output encoding before rendering in the DOM. Enforce strict Content-Security-Policy (CSP) headers without 'unsafe-inline'.",
      defense: "Context Encoding & CSP",
      badgeClass: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    },
    {
      type: "IDOR / Broken Access Control",
      cwe: "CWE-639 / OWASP A01",
      fix: "Centralized server-side authorization checks on every endpoint. Use non-sequential UUIDv4 references. Verify tenant ownership at the database query layer.",
      defense: "RBAC & Tenant Ownership",
      badgeClass: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    },
    {
      type: "CSRF (Cross-Site Request Forgery)",
      cwe: "CWE-352 / OWASP A01",
      fix: "Implement cryptographically random anti-CSRF synchronizer tokens for state changes. Set SameSite=Strict or SameSite=Lax on all session cookies.",
      defense: "Anti-CSRF Tokens",
      badgeClass: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    },
    {
      type: "Sensitive Data Exposure",
      cwe: "CWE-200 / OWASP A02",
      fix: "Disallow storing archives (.zip, .sql, .env) in web root directories. Block public file indexing. Encrypt sensitive data at rest using AES-256-GCM.",
      defense: "Strict Access & AES-256",
      badgeClass: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    },
    {
      type: "Open Redirect",
      cwe: "CWE-601 / OWASP A01",
      fix: "Avoid user-controlled redirect destinations. Implement a strict server-side allow-list of approved internal paths. Disallow protocol-relative destinations.",
      defense: "Domain Allow-List",
      badgeClass: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    },
    {
      type: "Security Misconfiguration",
      cwe: "CWE-16 / OWASP A05",
      fix: "Disable deprecated protocols (TLS 1.0, 1.1) and weak ciphers (RC4, 3DES). Configure TLS 1.3 and HSTS (HTTP Strict Transport Security with preload).",
      defense: "HSTS & TLS 1.3 Only",
      badgeClass: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <div className="text-[11px] font-mono text-[#00ff9c] tracking-wider uppercase mb-1">
          // HARDENING &amp; MITIGATION
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Remediation Recommendations Matrix</h2>
        <p className="text-sm text-gray-400">
          Defensive engineering guide providing prescriptive fixes mapped against each identified vulnerability category.
        </p>
      </div>

      <div className="bg-[#141b2b] border border-white/10 rounded-lg overflow-x-auto shadow-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-black/20 border-b border-white/10 font-mono text-[11px] text-gray-400 uppercase tracking-wider">
              <th className="p-3.5 w-1/4">Vulnerability Type</th>
              <th className="p-3.5 w-1/2">Recommended Remediation Strategy</th>
              <th className="p-3.5 w-1/4 text-center">Primary Defense</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {remediations.map((r) => (
              <tr key={r.type} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-white text-sm">{r.type}</div>
                  <div className="text-[10.5px] font-mono text-gray-500 mt-0.5">{r.cwe}</div>
                </td>
                <td className="p-3.5 text-gray-300 leading-relaxed">{r.fix}</td>
                <td className="p-3.5 text-center whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${r.badgeClass}`}>
                    {r.defense}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
