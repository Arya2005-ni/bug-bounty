"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "./RoleContext";
import { useRealtime } from "./RealtimeContext";
import { Shield, PlusCircle, Printer, UserCheck, Menu, X, Radio } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { role, setRole, userName, userAvatar } = useRole();
  const { isConnected } = useRealtime();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Public Dashboard" },
    { href: "/researcher", label: "Researcher Portal" },
    { href: "/triage", label: "Triage & Admin" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-white/10">
      {/* Top Advisory Banner */}
      <div className="bg-[#070a10] border-b border-red-500/20 py-1.5 px-4 text-xs font-mono">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400 truncate">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
            <span>
              <strong className="text-white">FULL-STACK SIMULATION:</strong> Educational Bug Bounty Platform with SQLite &amp; Next.js 15.
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold text-red-400 bg-red-950/40 border border-red-500/30 rounded">
            Confidential Demo
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1320px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-md bg-[#00ff9c]/10 border border-[#00ff9c]/30 flex items-center justify-center text-[#00ff9c] shadow-[0_0_12px_rgba(0,255,156,0.15)] group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-[17px] tracking-tight leading-none">
              CyberScope<span className="text-[#00ff9c]">.</span>io
            </span>
            <span className="text-gray-400 font-mono text-[9.5px] uppercase tracking-wider leading-none mt-1">
              Bounty Platform
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#00ff9c] bg-[#00ff9c]/10 border border-[#00ff9c]/30 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Live Sync Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
              isConnected
                ? "bg-[#00ff9c]/10 text-[#00ff9c] border-[#00ff9c]/30 shadow-[0_0_10px_rgba(0,255,156,0.15)]"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
            }`}
            title={isConnected ? "Real-time Live Stream Active (SSE)" : "Connecting to real-time stream..."}
          >
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9c] opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? "bg-[#00ff9c]" : "bg-amber-400"
                }`}
              ></span>
            </span>
            <span className="font-bold tracking-wider uppercase text-[10px]">
              {isConnected ? "LIVE SYNC" : "CONNECTING"}
            </span>
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="h-[34px] px-2.5 bg-[#141b2b] border border-white/10 hover:border-[#00b4d8]/40 rounded-md flex items-center gap-2 text-[12px] font-mono text-gray-200 transition-colors"
              title="Switch Active Simulated Role"
            >
              <span>{userAvatar}</span>
              <span className="hidden sm:inline font-semibold">{role}</span>
              <span className="text-gray-400 text-[10px]">▼</span>
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-[#141b2b] border border-[#00b4d8]/30 rounded-md shadow-2xl py-1 z-50 font-sans"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-white/10 text-[11px] text-gray-400 font-mono">
                  SWITCH SIMULATED ROLE:
                </div>
                <button
                  onClick={() => setRole("RESEARCHER")}
                  className={`w-full text-left px-3 py-2 text-[12.5px] flex items-center gap-2 hover:bg-white/5 ${
                    role === "RESEARCHER" ? "text-[#00ff9c] font-bold" : "text-gray-300"
                  }`}
                >
                  <span>👨‍💻</span>
                  <div>
                    <div>Alex Vance</div>
                    <div className="text-[10px] text-gray-400 font-mono">RESEARCHER</div>
                  </div>
                </button>
                <button
                  onClick={() => setRole("TRIAGER")}
                  className={`w-full text-left px-3 py-2 text-[12.5px] flex items-center gap-2 hover:bg-white/5 ${
                    role === "TRIAGER" ? "text-[#00b4d8] font-bold" : "text-gray-300"
                  }`}
                >
                  <span>🛡️</span>
                  <div>
                    <div>Marcus Sterling</div>
                    <div className="text-[10px] text-gray-400 font-mono">TRIAGER</div>
                  </div>
                </button>
                <button
                  onClick={() => setRole("ADMIN")}
                  className={`w-full text-left px-3 py-2 text-[12.5px] flex items-center gap-2 hover:bg-white/5 ${
                    role === "ADMIN" ? "text-[#9d4edd] font-bold" : "text-gray-300"
                  }`}
                >
                  <span>⚡</span>
                  <div>
                    <div>Sarah Connor</div>
                    <div className="text-[10px] text-gray-400 font-mono">ADMIN</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Quick Submit Link */}
          <Link
            href="/researcher"
            className="h-[34px] px-3.5 bg-gradient-to-r from-[#00ff9c] to-[#00d984] hover:from-[#1affab] hover:to-[#00ff9c] text-[#05140b] font-bold text-[12.5px] rounded-md flex items-center gap-1.5 shadow-[0_2px_10px_rgba(0,255,156,0.25)] transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Submit Bug</span>
          </Link>

          {/* Export Report */}
          <button
            onClick={handlePrint}
            className="h-[34px] px-3 bg-white/5 hover:bg-[#00b4d8]/10 text-gray-200 hover:text-white border border-white/10 hover:border-[#00b4d8] rounded-md flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors whitespace-nowrap"
            title="Export or Print Audit Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden h-[34px] w-[34px] bg-white/5 border border-white/10 rounded-md flex items-center justify-center text-gray-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#070a10]/98 border-b border-white/10 px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`px-3 py-2 rounded-md text-[13.5px] font-medium ${
                pathname === link.href ? "text-[#00ff9c] bg-[#00ff9c]/10 font-bold" : "text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>ACTIVE ROLE: {role}</span>
            <span>{userName}</span>
          </div>
        </div>
      )}
    </header>
  );
}
