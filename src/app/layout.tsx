import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/components/RoleContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Bug Bounty Management Platform | CyberScope",
  description: "Enterprise Full-Stack Bug Bounty Management & Vulnerability Triage Platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <RoleProvider>
          <Navbar />
          <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 py-8 space-y-12">
            {children}
          </main>

          {/* Global Footer */}
          <footer className="bg-[#070a10] border-t border-white/10 py-10 mt-16 print-hide">
            <div className="max-w-[1320px] mx-auto px-4 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-white font-bold text-base flex items-center gap-2">
                    <span>CyberScope.io</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00ff9c]/10 text-[#00ff9c] border border-[#00ff9c]/30">
                      NEXT.js 15 &bull; PRISMA SQLITE
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Simulated cybersecurity bug bounty and penetration testing management platform.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                  <a href="https://owasp.org" target="_blank" rel="noreferrer" className="hover:text-[#00ff9c]">
                    OWASP Top 10
                  </a>
                  <a href="https://first.org/cvss" target="_blank" rel="noreferrer" className="hover:text-[#00ff9c]">
                    FIRST CVSS v3.1
                  </a>
                  <a href="https://cwe.mitre.org" target="_blank" rel="noreferrer" className="hover:text-[#00ff9c]">
                    MITRE CWE
                  </a>
                </div>
              </div>

              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded text-[11.5px] text-red-300/80 leading-relaxed">
                <strong>DISCLAIMER:</strong> This is an educational simulation platform. All targets (*.example.com), findings, and user tokens are fictional. No actual systems were targeted, tested, or exploited.
              </div>

              <div className="flex justify-between items-center text-[11px] text-gray-500 font-mono pt-4 border-t border-white/5">
                <span>&copy; 2026 CyberScope Security Operations.</span>
                <span>STATUS: PRISMA_ORCHESTRATED // FULL_STACK_ACTIVE</span>
              </div>
            </div>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
