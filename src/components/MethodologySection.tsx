export default function MethodologySection() {
  const steps = [
    {
      num: "01",
      phase: "Phase 1",
      title: "Reconnaissance & OSINT",
      desc: "Passive and active information gathering across target organization. Mapped subdomains, ASN allocations, DNS records, public cloud buckets, and exposed credential dumps without direct active probing.",
      tags: ["Sublist3r", "Amass", "whois", "DNS Recon"],
    },
    {
      num: "02",
      phase: "Phase 2",
      title: "Scanning & Enumeration",
      desc: "Full TCP/UDP port scanning across target host infrastructure. Fingerprinted web servers, reverse proxies, exposed databases, TLS configuration ciphers, and application API endpoints.",
      tags: ["Nmap", "Nikto", "Masscan", "SSLScan"],
    },
    {
      num: "03",
      phase: "Phase 3",
      title: "Vulnerability Identification",
      desc: "Automated security sweeps combined with deep manual code inspection and API fuzzing. Identified logic flaws, authentication bypass opportunities, injection points, and missing access controls.",
      tags: ["Burp Suite Pro", "OWASP ZAP", "ffuf", "Postman"],
    },
    {
      num: "04",
      phase: "Phase 4",
      title: "Exploitation & Validation",
      desc: "Safe, controlled exploitation to validate theoretical vulnerabilities without causing denial-of-service or database degradation. Verified true positive status and recorded deterministic reproduction steps.",
      tags: ["SQLmap", "Metasploit", "Custom Python PoC"],
    },
    {
      num: "05",
      phase: "Phase 5",
      title: "Post-Exploitation & Impact Analysis",
      desc: "Assessed potential blast radius, privilege escalation paths, horizontal data exposure, and lateral movement risks. Quantified real-world business impact and regulatory compliance liabilities.",
      tags: ["Blast Radius Mapping", "PII Exposure Audit"],
    },
    {
      num: "06",
      phase: "Phase 6",
      title: "Reporting & Remediation Guidance",
      desc: "Synthesized all findings into structured CVSS v3.1 reports with actionable patch instructions, developer unit test recommendations, and collaborative re-testing verification criteria.",
      tags: ["CVSS v3.1", "OWASP ASVS", "Patch Verification"],
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <div className="text-[11px] font-mono text-[#00ff9c] tracking-wider uppercase mb-1">
          // EXECUTION FRAMEWORK
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Penetration Testing Methodology</h2>
        <p className="text-sm text-gray-400">
          Rigorous 6-stage testing workflow adapted from the OWASP Testing Guide (OTG) and PTES standard.
        </p>
      </div>

      <div className="space-y-4 max-w-4xl">
        {steps.map((s) => (
          <div key={s.num} className="flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-full bg-[#0b0f19] border-2 border-[#00b4d8]/40 group-hover:border-[#00ff9c] text-[#00ff9c] flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 shadow-[0_0_15px_rgba(0,180,216,0.15)] transition-all">
              {s.num}
            </div>
            <div className="flex-1 bg-[#141b2b] border border-white/10 group-hover:border-[#00b4d8]/40 rounded-lg p-4 shadow-md transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10.5px] font-mono text-[#00b4d8] bg-[#00b4d8]/10 font-semibold uppercase">
                  {s.phase}
                </span>
                <h3 className="text-white font-bold text-sm">{s.title}</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-white/5 text-gray-400 border border-white/5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
