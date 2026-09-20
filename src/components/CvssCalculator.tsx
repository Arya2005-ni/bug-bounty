"use client";

import { useState } from "react";
import { calculateCvss, CvssMetrics } from "@/lib/cvss";
import { Copy, Check } from "lucide-react";

interface CvssCalculatorProps {
  onScoreChange?: (score: number, vector: string, severity: string) => void;
  compact?: boolean;
}

export default function CvssCalculator({ onScoreChange, compact = false }: CvssCalculatorProps) {
  const [metrics, setMetrics] = useState<CvssMetrics>({
    av: "N",
    ac: "L",
    pr: "N",
    ui: "N",
    s: "U",
    c: "H",
    i: "H",
    a: "H",
  });

  const [copied, setCopied] = useState(false);

  const result = calculateCvss(metrics);

  const handleChange = (field: keyof CvssMetrics, value: string) => {
    const updated = { ...metrics, [field]: value as any };
    setMetrics(updated);
    const newRes = calculateCvss(updated);
    if (onScoreChange) {
      onScoreChange(newRes.score, newRes.vector, newRes.severity);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.vector);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getBadgeStyle = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "HIGH":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "MEDIUM":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
      case "LOW":
        return "bg-green-500/15 text-green-400 border-green-500/30";
      default:
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="bg-[#141b2b] border border-[#00b4d8]/20 rounded-lg p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-base">Interactive CVSS v3.1 Calculator</h3>
          <p className="text-gray-400 text-xs">Calibrate base metrics according to FIRST CVSS v3.1 formulas.</p>
        </div>
        <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[#00ff9c] bg-[#00ff9c]/10 border border-[#00ff9c]/30">
          Live Matrix
        </span>
      </div>

      <div className={`grid gap-3 mb-4 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 md:grid-cols-4"}`}>
        {/* Attack Vector */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-mono text-gray-400">Attack Vector (AV)</label>
          <select
            value={metrics.av}
            onChange={(e) => handleChange("av", e.target.value)}
            className="bg-[#0b0f19] border border-white/10 text-gray-200 text-xs rounded px-2.5 py-1.5 focus:border-[#00b4d8] outline-none font-sans"
          >
            <option value="N">Network (N - 0.85)</option>
            <option value="A">Adjacent (A - 0.62)</option>
            <option value="L">Local (L - 0.55)</option>
            <option value="P">Physical (P - 0.20)</option>
          </select>
        </div>

        {/* Attack Complexity */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-mono text-gray-400">Complexity (AC)</label>
          <select
            value={metrics.ac}
            onChange={(e) => handleChange("ac", e.target.value)}
            className="bg-[#0b0f19] border border-white/10 text-gray-200 text-xs rounded px-2.5 py-1.5 focus:border-[#00b4d8] outline-none font-sans"
          >
            <option value="L">Low (L - 0.77)</option>
            <option value="H">High (H - 0.44)</option>
          </select>
        </div>

        {/* Privileges Required */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-mono text-gray-400">Privileges (PR)</label>
          <select
            value={metrics.pr}
            onChange={(e) => handleChange("pr", e.target.value)}
            className="bg-[#0b0f19] border border-white/10 text-gray-200 text-xs rounded px-2.5 py-1.5 focus:border-[#00b4d8] outline-none font-sans"
          >
            <option value="N">None (N - 0.85)</option>
            <option value="L">Low (L - 0.62)</option>
            <option value="H">High (H - 0.27)</option>
          </select>
        </div>

        {/* User Interaction */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-mono text-gray-400">User Interaction (UI)</label>
          <select
            value={metrics.ui}
            onChange={(e) => handleChange("ui", e.target.value)}
            className="bg-[#0b0f19] border border-white/10 text-gray-200 text-xs rounded px-2.5 py-1.5 focus:border-[#00b4d8] outline-none font-sans"
          >
            <option value="N">None (N - 0.85)</option>
            <option value="R">Required (R - 0.62)</option>
          </select>
        </div>

        {/* Scope */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-mono text-gray-400">Scope (S)</label>
          <select
            value={metrics.s}
            onChange={(e) => handleChange("s", e.target.value)}
            className="bg-[#0b0f19] border border-white/10 text-gray-200 text-xs rounded px-2.5 py-1.5 focus:border-[#00b4d8] outline-none font-sans"
          >
            <option value="U">Unchanged (U)</option>
            <option value="C">Changed (C)</option>
          </select>
        </div>

        {/* Confidentiality */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-mono text-gray-400">Confidentiality (C)</label>
          <select
            value={metrics.c}
            onChange={(e) => handleChange("c", e.target.value)}
            className="bg-[#0b0f19] border border-white/10 text-gray-200 text-xs rounded px-2.5 py-1.5 focus:border-[#00b4d8] outline-none font-sans"
          >
            <option value="H">High (H - 0.56)</option>
            <option value="L">Low (L - 0.22)</option>
            <option value="N">None (N - 0.00)</option>
          </select>
        </div>

        {/* Integrity */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-mono text-gray-400">Integrity (I)</label>
          <select
            value={metrics.i}
            onChange={(e) => handleChange("i", e.target.value)}
            className="bg-[#0b0f19] border border-white/10 text-gray-200 text-xs rounded px-2.5 py-1.5 focus:border-[#00b4d8] outline-none font-sans"
          >
            <option value="H">High (H - 0.56)</option>
            <option value="L">Low (L - 0.22)</option>
            <option value="N">None (N - 0.00)</option>
          </select>
        </div>

        {/* Availability */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-mono text-gray-400">Availability (A)</label>
          <select
            value={metrics.a}
            onChange={(e) => handleChange("a", e.target.value)}
            className="bg-[#0b0f19] border border-white/10 text-gray-200 text-xs rounded px-2.5 py-1.5 focus:border-[#00b4d8] outline-none font-sans"
          >
            <option value="H">High (H - 0.56)</option>
            <option value="L">Low (L - 0.22)</option>
            <option value="N">None (N - 0.00)</option>
          </select>
        </div>
      </div>

      {/* Result Display Box */}
      <div className="bg-[#070a10] border border-white/10 rounded-md p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-white">{result.score.toFixed(1)}</span>
            <span className="text-gray-500 text-xs font-mono">/ 10.0</span>
          </div>
          <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getBadgeStyle(result.severity)}`}>
            {result.severity}
          </span>
        </div>

        <div className="flex items-center gap-2 max-w-full overflow-x-auto">
          <code className="text-xs font-mono text-[#00b4d8] bg-black/40 px-2 py-1 rounded truncate max-w-[280px] md:max-w-md">
            {result.vector}
          </code>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-200 text-xs rounded flex items-center gap-1 font-mono border border-white/10 flex-shrink-0 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00ff9c]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
