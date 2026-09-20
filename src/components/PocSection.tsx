"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function PocSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pocs = [
    {
      id: "BB-001",
      title: "SQL Injection in Login API",
      asset: "POST https://api.example.com/auth/login",
      score: "Critical 9.8",
      scoreClass: "bg-red-500/15 text-red-400 border-red-500/30",
      code: `POST /auth/login HTTP/1.1\nHost: api.example.com\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin' OR '1'='1'--&password=test`,
      impact: "Authentication bypass occurred immediately. The tautology '1'='1' returns the first record (Administrator), issuing a valid JWT without password check.",
      remediation: "Replace concatenated SQL queries with parameterized prepared statements. Apply least-privilege DB user credentials.",
    },
    {
      id: "BB-003",
      title: "Stored Cross-Site Scripting (XSS)",
      asset: "POST https://app.example.com/comments",
      score: "High 8.3",
      scoreClass: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      code: `POST /comments HTTP/1.1\nHost: app.example.com\nContent-Type: application/json\n\n{\n  "article_id": "4892",\n  "comment_text": "Great article! <img src=x onerror=alert(document.domain)>"\n}`,
      impact: "Comment payload was persisted without HTML encoding and executed in DOM of all visiting users and admins, exposing auth tokens.",
      remediation: "Implement context-aware HTML entity output encoding. Enforce strict Content-Security-Policy (CSP) headers.",
    },
    {
      id: "BB-004",
      title: "Insecure Direct Object Reference (IDOR)",
      asset: "GET https://api.example.com/users/{id}",
      score: "High 8.1",
      scoreClass: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      code: `# Authenticated as User 1023:\nGET /api/users/1024 HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer <TOKEN_USER_1023>\n\n# Result: 200 OK returning full PII of User 1024 (SSN, home address, email)`,
      impact: "Backend endpoint retrieved records by sequential integer ID without verifying whether the requesting user token was authorized to access it.",
      remediation: "Enforce server-side authorization checks: verify record ownership at the database query layer. Use non-sequential UUIDv4.",
    },
  ];

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section className="space-y-6">
      <div>
        <div className="text-[11px] font-mono text-[#00ff9c] tracking-wider uppercase mb-1">
          // SANITIZED EVIDENCE
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Verified Proof-of-Concept Demonstrations</h2>
        <p className="text-sm text-gray-400">
          Sanitized reproduction scripts demonstrating vulnerability execution without endangering production systems.
        </p>
      </div>

      <div className="space-y-5">
        {pocs.map((p) => (
          <div key={p.id} className="bg-[#141b2b] border border-white/10 rounded-lg p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${p.scoreClass}`}>
                  {p.score}
                </span>
                <span className="font-mono font-bold text-[#00b4d8] text-xs">{p.id}</span>
                <span className="text-white font-bold text-sm">{p.title}</span>
              </div>
              <button
                onClick={() => handleCopy(p.id, p.code)}
                className="h-7 px-2.5 bg-white/5 hover:bg-white/10 text-gray-200 text-xs rounded border border-white/10 flex items-center gap-1.5 transition-colors font-mono"
              >
                {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-[#00ff9c]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === p.id ? "Copied" : "Copy Payload"}</span>
              </button>
            </div>

            <div className="text-xs font-mono text-[#00ff9c] bg-[#00ff9c]/5 px-2.5 py-1 rounded inline-block">
              Target: {p.asset}
            </div>

            <div className="bg-[#070a10] border border-white/10 rounded p-3.5 font-mono text-xs text-[#a8dadc] overflow-x-auto whitespace-pre leading-relaxed">
              {p.code}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0b0f19] p-3 rounded border border-white/5 space-y-1">
                <span className="font-mono font-bold text-red-400 uppercase text-[10.5px]">Technical Impact</span>
                <p className="text-gray-300 leading-relaxed">{p.impact}</p>
              </div>
              <div className="bg-[#0b0f19] p-3 rounded border border-white/5 space-y-1">
                <span className="font-mono font-bold text-[#00ff9c] uppercase text-[10.5px]">Remediation Action</span>
                <p className="text-gray-300 leading-relaxed">{p.remediation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
