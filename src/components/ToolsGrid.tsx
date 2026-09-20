export default function ToolsGrid() {
  const tools = [
    { name: "Nmap", cat: "Recon / Port Scan", desc: "Network exploration tool and port scanner for host discovery and version fingerprinting.", color: "text-[#00b4d8] bg-[#00b4d8]/10" },
    { name: "Burp Suite Pro", cat: "Web Proxy", desc: "Leading web vulnerability scanner and proxy for manipulating HTTP/S traffic.", color: "text-yellow-400 bg-yellow-500/10" },
    { name: "OWASP ZAP", cat: "DAST Scanner", desc: "Open-source scanner for detecting web application vulnerabilities in pipelines.", color: "text-blue-400 bg-blue-500/10" },
    { name: "Metasploit", cat: "Exploitation", desc: "Penetration testing framework providing known exploit modules and validation payloads.", color: "text-red-400 bg-red-500/10" },
    { name: "SQLmap", cat: "DB Injection", desc: "Automated tool for detecting and safely exploiting SQL injection flaws.", color: "text-red-400 bg-red-500/10" },
    { name: "Nikto", cat: "Web Server Audit", desc: "Open-source web server scanner testing for 6,700+ dangerous files and outdated ciphers.", color: "text-green-400 bg-green-500/10" },
    { name: "Wireshark", cat: "Packet Sniffer", desc: "Network protocol analyzer capturing packet traffic in real time.", color: "text-blue-400 bg-blue-500/10" },
    { name: "Acunetix", cat: "Automated Audit", desc: "Automated scanner for complex SQLi, blind XSS, and enterprise security flaws.", color: "text-purple-400 bg-purple-500/10" },
    { name: "Nessus", cat: "Infra Scanner", desc: "Infrastructure scanner assessing OS patch compliance and cloud misconfigurations.", color: "text-yellow-400 bg-yellow-500/10" },
    { name: "Sublist3r", cat: "OSINT Recon", desc: "Python tool for subdomain enumeration using multiple search engines and DNSdumpster.", color: "text-[#00b4d8] bg-[#00b4d8]/10" },
    { name: "Ghidra", cat: "Reverse Eng", desc: "Software reverse-engineering framework developed by NSA for decompiling binaries.", color: "text-purple-400 bg-purple-500/10" },
    { name: "Hydra", cat: "Auth Auditing", desc: "Fast parallelized network logon cracker used to test credential resiliency.", color: "text-red-400 bg-red-500/10" },
  ];

  return (
    <section className="space-y-6">
      <div>
        <div className="text-[11px] font-mono text-[#00ff9c] tracking-wider uppercase mb-1">
          // ARSENAL &amp; INSTRUMENTATION
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Security Testing Tools</h2>
        <p className="text-sm text-gray-400">
          Industry-standard offensive and defensive security tooling utilized during the assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => (
          <div
            key={t.name}
            className="bg-[#141b2b] border border-white/10 hover:border-[#00b4d8]/40 rounded-lg p-4 shadow-md transition-all hover:-translate-y-0.5 flex gap-3.5"
          >
            <div className={`w-10 h-10 rounded-md flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${t.color}`}>
              {t.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-white font-bold text-sm">{t.name}</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-400 border border-white/5 whitespace-nowrap">
                  {t.cat}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
