"use client";

import { useState, useEffect } from "react";
import { Report } from "@/lib/types";
import { useRole } from "@/components/RoleContext";
import SubmitReportModal from "@/components/SubmitReportModal";
import TriageModal from "@/components/TriageModal";
import CvssCalculator from "@/components/CvssCalculator";
import { Award, Plus, ShieldAlert, CheckCircle, Clock, ExternalLink } from "lucide-react";

export default function ResearcherPage() {
  const { role, userName } = useRole();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (e) {
      console.error("Failed to fetch researcher reports", e);
    } finally {
      setLoading(false);
    }
  };

  const totalBounties = reports.reduce((acc, r) => acc + (r.bountyAmount || 0), 0);
  const resolvedCount = reports.filter((r) => r.status === "RESOLVED").length;

  return (
    <div className="space-y-10">
      {/* Header / Researcher Profile Card */}
      <div className="bg-[#141b2b] border border-[#00ff9c]/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ff9c] to-[#00b4d8]"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black/40 border border-[#00ff9c]/40 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(0,255,156,0.2)]">
              👨‍💻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{userName}</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#00ff9c]/15 text-[#00ff9c] border border-[#00ff9c]/30">
                  TOP RESEARCHER
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Active Researcher &bull; Specializing in Web Application Security &amp; API Logic Flaws
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <span className="text-[10.5px] font-mono text-gray-400 uppercase block">Total Bounties</span>
              <span className="text-2xl font-bold font-mono text-[#00ff9c]">${totalBounties.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10.5px] font-mono text-gray-400 uppercase block">Reputation Points</span>
              <span className="text-2xl font-bold font-mono text-[#00b4d8]">920</span>
            </div>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="h-10 px-4 bg-gradient-to-r from-[#00ff9c] to-[#00d984] hover:opacity-90 text-[#070a10] font-bold text-xs rounded-md flex items-center gap-1.5 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">My Vulnerability Submissions</h2>
            <p className="text-xs text-gray-400">Track triage status, internal review, and awarded payouts.</p>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Total Logged: <strong className="text-white">{reports.length}</strong> ({resolvedCount} Resolved)
          </span>
        </div>

        <div className="grid gap-3">
          {reports.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedReport(r)}
              className="bg-[#141b2b] border border-white/10 hover:border-[#00b4d8]/40 rounded-lg p-4 transition-all hover:-translate-y-0.5 cursor-pointer shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#00b4d8]/15 text-[#00b4d8] border border-[#00b4d8]/30">
                    {r.referenceId}
                  </span>
                  <h3 className="text-white font-bold text-sm hover:text-[#00ff9c] transition-colors">{r.title}</h3>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  Target: <span className="text-gray-300">{r.asset}</span> &bull; {r.vulnerabilityType}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-orange-400">
                    CVSS {r.cvssScore.toFixed(1)} ({r.severity})
                  </div>
                  <div className="text-[11px] font-mono text-[#00ff9c]">
                    {r.bountyAmount ? `$${r.bountyAmount.toLocaleString()}` : "Bounty Pending"}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border ${
                    r.status === "RESOLVED"
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : r.status === "IN_PROGRESS"
                      ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                      : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CVSS Calculator utility */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">Researcher Scoring Utility</h2>
        <p className="text-xs text-gray-400">
          Calculate your exploit severity and vector before submitting to ensure accurate tiering.
        </p>
        <CvssCalculator />
      </div>

      {/* Modals */}
      <SubmitReportModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSuccess={fetchMyReports}
      />

      <TriageModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpdate={fetchMyReports}
      />
    </div>
  );
}
