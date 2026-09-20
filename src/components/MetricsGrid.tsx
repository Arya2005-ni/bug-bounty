"use client";

import { useEffect, useState } from "react";
import { PlatformStats } from "@/lib/types";
import { AlertTriangle, CheckCircle2, ShieldAlert, DollarSign } from "lucide-react";

export default function MetricsGrid() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Error fetching metrics", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-[#141b2b] border border-white/10 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  const critAndHigh = stats.criticalCount + stats.highCount;
  const cvssPercent = Math.min(100, Math.max(0, (stats.avgCvss / 10) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Findings */}
      <div className="bg-[#141b2b] border border-[#00b4d8]/20 hover:border-[#00b4d8]/40 rounded-lg p-5 shadow-lg relative overflow-hidden transition-all hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#00b4d8]"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm font-medium">Total Vulnerabilities</span>
          <div className="w-9 h-9 rounded-md bg-[#00b4d8]/10 text-[#00b4d8] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
        <div className="text-4xl font-bold font-mono text-white mb-2">{stats.totalReports}</div>
        <div className="text-xs text-gray-400">100% verified &amp; triaged</div>
      </div>

      {/* 2. Critical & High */}
      <div className="bg-[#141b2b] border border-red-500/20 hover:border-red-500/40 rounded-lg p-5 shadow-lg relative overflow-hidden transition-all hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm font-medium">Critical &amp; High Risk</span>
          <div className="w-9 h-9 rounded-md bg-red-500/10 text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="text-4xl font-bold font-mono text-red-400 mb-2">{critAndHigh}</div>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono font-bold">
            {stats.criticalCount} Critical
          </span>
          <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono font-bold">
            {stats.highCount} High
          </span>
        </div>
      </div>

      {/* 3. Average CVSS Risk Index */}
      <div className="bg-[#141b2b] border border-yellow-500/20 hover:border-yellow-500/40 rounded-lg p-5 shadow-lg relative overflow-hidden transition-all hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-yellow-500"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm font-medium">Average CVSS v3.1</span>
          <div className="w-9 h-9 rounded-md bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-mono font-bold text-sm">
            CVSS
          </div>
        </div>
        <div className="text-4xl font-bold font-mono text-white mb-2">{stats.avgCvss.toFixed(2)}</div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00ff9c] via-yellow-400 to-red-500"
            style={{ width: `${cvssPercent}%` }}
          ></div>
        </div>
      </div>

      {/* 4. Bounty Disbursements */}
      <div className="bg-[#141b2b] border border-[#00ff9c]/20 hover:border-[#00ff9c]/40 rounded-lg p-5 shadow-lg relative overflow-hidden transition-all hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#00ff9c]"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm font-medium">Bounties Awarded</span>
          <div className="w-9 h-9 rounded-md bg-[#00ff9c]/10 text-[#00ff9c] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="text-4xl font-bold font-mono text-[#00ff9c] mb-2">
          ${stats.totalBountiesPaid.toLocaleString()}
        </div>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-[#00ff9c]/10 text-[#00ff9c] border border-[#00ff9c]/20 font-mono font-bold">
            {stats.resolvedCount} Resolved
          </span>
          <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-mono">
            {stats.inProgressCount} In Progress
          </span>
        </div>
      </div>
    </div>
  );
}
