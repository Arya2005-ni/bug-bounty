"use client";

import { useState, useEffect } from "react";
import { Report } from "@/lib/types";
import { useRole } from "@/components/RoleContext";
import FindingsTable from "@/components/FindingsTable";
import TriageModal from "@/components/TriageModal";
import { ShieldCheck, ShieldAlert, CheckCircle2, DollarSign, Filter } from "lucide-react";

export default function TriagePage() {
  const { role, userName } = useRole();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTriageQueue();
  }, []);

  const fetchTriageQueue = async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (e) {
      console.error("Failed to fetch triage queue", e);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = reports.filter((r) => r.status === "SUBMITTED" || r.status === "TRIAGED").length;
  const inProgressCount = reports.filter((r) => r.status === "IN_PROGRESS").length;
  const resolvedCount = reports.filter((r) => r.status === "RESOLVED").length;

  return (
    <div className="space-y-10">
      {/* Triage Banner */}
      <div className="bg-[#141b2b] border border-[#00b4d8]/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00b4d8] to-[#9d4edd]"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00b4d8] animate-ping"></span>
              <h1 className="text-2xl font-bold text-white tracking-tight">Security Triage &amp; Operations Console</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#00b4d8]/15 text-[#00b4d8] border border-[#00b4d8]/30">
                ACTIVE: {role}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Welcome back, <strong className="text-white">{userName}</strong>. Review incoming submissions, validate exploitability, manage remediation tickets, and disburse bounty awards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#0b0f19] border border-white/10 rounded-lg text-center font-mono">
              <span className="text-[10px] text-gray-500 uppercase block">Pending Review</span>
              <span className="text-lg font-bold text-yellow-400">{pendingCount}</span>
            </div>
            <div className="px-4 py-2 bg-[#0b0f19] border border-white/10 rounded-lg text-center font-mono">
              <span className="text-[10px] text-gray-500 uppercase block">In Remediation</span>
              <span className="text-lg font-bold text-orange-400">{inProgressCount}</span>
            </div>
            <div className="px-4 py-2 bg-[#0b0f19] border border-white/10 rounded-lg text-center font-mono">
              <span className="text-[10px] text-gray-500 uppercase block">Resolved</span>
              <span className="text-lg font-bold text-[#00ff9c]">{resolvedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Triage Queue Table */}
      <FindingsTable
        reports={reports}
        onSelectReport={(r) => setSelectedReport(r)}
        title="Live Vulnerability Triage Queue"
        subtitle="Click any finding to change status, award bounty payouts, or post internal triage notes."
      />

      {/* Modal */}
      <TriageModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpdate={fetchTriageQueue}
      />
    </div>
  );
}
