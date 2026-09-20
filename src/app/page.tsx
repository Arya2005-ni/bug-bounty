"use client";

import { useEffect, useState, useCallback } from "react";
import MetricsGrid from "@/components/MetricsGrid";
import FindingsTable from "@/components/FindingsTable";
import CvssCalculator from "@/components/CvssCalculator";
import MethodologySection from "@/components/MethodologySection";
import ToolsGrid from "@/components/ToolsGrid";
import PocSection from "@/components/PocSection";
import RemediationMatrix from "@/components/RemediationMatrix";
import TriageModal from "@/components/TriageModal";
import SubmitReportModal from "@/components/SubmitReportModal";
import { Report } from "@/lib/types";
import { useRealtimeListener } from "@/components/RealtimeContext";
import { ShieldCheck, Plus, ArrowDown, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (e) {
      console.error("Failed to load reports", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();

    // Fallback sync every 8 seconds
    const interval = setInterval(() => {
      fetchReports();
    }, 8000);

    return () => clearInterval(interval);
  }, [fetchReports]);

  // Instant real-time socket/SSE listener
  useRealtimeListener(["report_created", "report_updated", "report_deleted"], (msg) => {
    if (msg.type === "report_created" && msg.data?.report) {
      const newReport: Report = msg.data.report;
      setReports((prev) => {
        if (prev.some((r) => r.id === newReport.id || r.referenceId === newReport.referenceId)) {
          return prev;
        }
        return [newReport, ...prev];
      });
    } else if (msg.type === "report_updated" && msg.data?.report) {
      const updatedReport: Report = msg.data.report;
      setReports((prev) =>
        prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
      );
      setSelectedReport((curr) => (curr?.id === updatedReport.id ? updatedReport : curr));
    } else if (msg.type === "report_deleted" && msg.data?.reportId) {
      const deletedId: string = msg.data.reportId;
      setReports((prev) => prev.filter((r) => r.id !== deletedId));
      setSelectedReport((curr) => (curr?.id === deletedId ? null : curr));
    }
  });

  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      <section className="relative pt-6 pb-2">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff9c]/10 border border-[#00ff9c]/30 text-xs font-mono text-[#00ff9c]">
              <span className="w-2 h-2 rounded-full bg-[#00ff9c] animate-pulse"></span>
              <span>AUDIT CYCLE 2026-Q3 &bull; FULL-STACK PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Bug Bounty Vulnerability <br />
              <span className="bg-gradient-to-r from-[#00ff9c] via-[#00b4d8] to-[#58a6ff] bg-clip-text text-transparent">
                Management Platform
              </span>
            </h1>

            <p className="text-gray-300 text-base leading-relaxed">
              Enterprise vulnerability assessment management system connecting independent ethical researchers with security triage teams. 
              Review live verified vulnerabilities, adjust CVSS v3.1 severities, coordinate patches, and award bounties with SQLite &amp; Prisma.
            </p>

            {/* Scope Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#141b2b] border border-white/10 rounded-lg text-xs font-mono">
              <div>
                <span className="text-gray-500 uppercase block text-[10px]">Target Scope</span>
                <span className="text-[#00b4d8] font-bold">*.example.com</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase block text-[10px]">Assessment</span>
                <span className="text-white">Q3 Cycle 2026</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase block text-[10px]">Lead Team</span>
                <span className="text-white">RedTeam SecOps</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase block text-[10px]">Standard</span>
                <span className="text-[#00ff9c]">OWASP ASVS</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/researcher"
                className="h-10 px-5 bg-gradient-to-r from-[#00ff9c] to-[#00d984] hover:opacity-90 text-[#070a10] font-bold rounded-md flex items-center gap-2 shadow-[0_4px_16px_rgba(0,255,156,0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Vulnerability</span>
              </Link>
              <Link
                href="/triage"
                className="h-10 px-5 bg-white/5 hover:bg-[#00b4d8]/10 text-gray-200 hover:text-white border border-white/10 hover:border-[#00b4d8] rounded-md flex items-center gap-2 transition-colors font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-[#00b4d8]" />
                <span>Security Triage Queue</span>
              </Link>
            </div>
          </div>

          {/* Posture Score Badge */}
          <div className="w-full lg:w-auto p-6 bg-gradient-to-b from-[#1a2236] to-[#141b2b] border border-[#00b4d8]/30 rounded-2xl shadow-2xl flex flex-col items-center text-center">
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#00ff9c]/40 animate-spin" style={{ animationDuration: "25s" }}></div>
              <div className="w-20 h-20 rounded-full bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(255,77,77,0.3)]">
                <ShieldCheck className="w-10 h-10" />
              </div>
            </div>
            <div className="text-[11px] font-mono text-gray-400 tracking-wider uppercase">
              PLATFORM RISK POSTURE
            </div>
            <div className="text-4xl font-extrabold font-mono text-red-400 my-1">
              7.35
            </div>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
              HIGH RISK INDEX
            </span>
            <span className="text-[11px] text-gray-500 mt-2">
              Mean CVSS v3.1 across {reports.length} verified findings
            </span>
          </div>
        </div>
      </section>

      {/* 2. Executive Metrics Cards */}
      <MetricsGrid />

      {/* 3. Findings Table */}
      <FindingsTable
        reports={reports}
        onSelectReport={(r) => setSelectedReport(r)}
      />

      {/* 4. CVSS Calculator */}
      <CvssCalculator />

      {/* 5. Methodology Stepper */}
      <MethodologySection />

      {/* 6. Tools Arsenal */}
      <ToolsGrid />

      {/* 7. Sanitized PoC Examples */}
      <PocSection />

      {/* 8. Remediation Matrix */}
      <RemediationMatrix />

      {/* Modals */}
      <TriageModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpdate={fetchReports}
      />

      <SubmitReportModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSuccess={fetchReports}
      />
    </div>
  );
}
