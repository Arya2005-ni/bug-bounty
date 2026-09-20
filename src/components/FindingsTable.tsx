"use client";

import { useState } from "react";
import { Report } from "@/lib/types";
import { Search, RotateCcw, Eye, ArrowUpDown } from "lucide-react";

interface FindingsTableProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  title?: string;
  subtitle?: string;
}

export default function FindingsTable({
  reports,
  onSelectReport,
  title = "Vulnerability Findings & Triage",
  subtitle = "Search, filter, and inspect verified security findings across active targets.",
}: FindingsTableProps) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortColumn, setSortColumn] = useState<keyof Report>("cvssScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtering
  const filtered = reports.filter((r) => {
    if (severityFilter !== "ALL" && r.severity !== severityFilter) return false;
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = r.referenceId.toLowerCase().includes(q);
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchAsset = r.asset.toLowerCase().includes(q);
      const matchType = r.vulnerabilityType.toLowerCase().includes(q);
      return matchId || matchTitle || matchAsset || matchType;
    }
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (sortColumn === "cvssScore") {
      return ((valA as number) - (valB as number)) * (sortDirection === "asc" ? 1 : -1);
    }
    if (sortColumn === "createdAt") {
      return (new Date(valA as string).getTime() - new Date(valB as string).getTime()) * (sortDirection === "asc" ? 1 : -1);
    }
    return String(valA).localeCompare(String(valB)) * (sortDirection === "asc" ? 1 : -1);
  });

  const toggleSort = (col: keyof Report) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortDirection(col === "cvssScore" || col === "createdAt" ? "desc" : "asc");
    }
  };

  const handleReset = () => {
    setSearch("");
    setSeverityFilter("ALL");
    setStatusFilter("ALL");
  };

  const getSeverityBadge = (sev: string) => {
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

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "RESOLVED":
        return "bg-green-500/15 text-green-400 border-green-500/30";
      case "IN_PROGRESS":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
      case "ACCEPTED":
      case "TRIAGED":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "REJECTED":
      case "DUPLICATE":
        return "bg-gray-500/15 text-gray-400 border-gray-500/30";
      default:
        return "bg-red-500/15 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono text-[#00ff9c] tracking-wider uppercase mb-1">
            // TELEMETRY REPOSITORY
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300 self-start sm:self-auto">
          Showing <span className="text-[#00ff9c] font-bold">{sorted.length}</span> of {reports.length} findings
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#141b2b] border border-white/10 rounded-lg p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID (BB-001), Title, Asset, or Type..."
            className="w-full h-9 pl-9 pr-3 bg-[#0b0f19] border border-white/10 rounded text-xs text-white placeholder-gray-500 focus:border-[#00b4d8] outline-none transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
            <span>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-9 px-2.5 bg-[#0b0f19] border border-white/10 rounded text-xs text-white focus:border-[#00b4d8] outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-2.5 bg-[#0b0f19] border border-white/10 rounded text-xs text-white focus:border-[#00b4d8] outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="TRIAGED">Triaged</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="h-9 px-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 rounded text-xs flex items-center gap-1.5 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141b2b] border border-white/10 rounded-lg overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-black/20 border-b border-white/10 font-mono text-[11px] text-gray-400 uppercase tracking-wider">
              <th className="p-3.5 cursor-pointer hover:text-[#00ff9c]" onClick={() => toggleSort("referenceId")}>
                <div className="flex items-center gap-1">
                  <span>ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-[#00ff9c]" onClick={() => toggleSort("title")}>
                <div className="flex items-center gap-1">
                  <span>Vulnerability Title</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5">Target Asset</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5 text-center cursor-pointer hover:text-[#00ff9c]" onClick={() => toggleSort("cvssScore")}>
                <div className="flex items-center justify-center gap-1">
                  <span>CVSS</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5 text-center">Severity</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-center">Bounty</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400">
                  No vulnerabilities match the selected filters.
                </td>
              </tr>
            ) : (
              sorted.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onSelectReport(r)}
                  className="hover:bg-[#00b4d8]/5 cursor-pointer transition-colors group"
                >
                  <td className="p-3.5 font-mono font-bold text-[#00b4d8] whitespace-nowrap">
                    {r.referenceId}
                  </td>
                  <td className="p-3.5 font-semibold text-white group-hover:text-[#00ff9c] transition-colors">
                    {r.title}
                  </td>
                  <td className="p-3.5 font-mono text-gray-300">
                    <span className="bg-black/30 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap">
                      {r.asset}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-300 whitespace-nowrap">{r.vulnerabilityType}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-sm">
                    <span className={r.cvssScore >= 9 ? "text-red-400" : r.cvssScore >= 7 ? "text-orange-400" : "text-yellow-400"}>
                      {r.cvssScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getSeverityBadge(r.severity)}`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${getStatusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-mono text-[#00ff9c] whitespace-nowrap">
                    {r.bountyAmount ? `$${r.bountyAmount.toLocaleString()}` : <span className="text-gray-500">—</span>}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectReport(r)}
                      className="h-7 px-2.5 bg-white/5 hover:bg-[#00b4d8]/20 text-gray-300 hover:text-[#00b4d8] border border-white/10 hover:border-[#00b4d8]/40 rounded text-xs inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
