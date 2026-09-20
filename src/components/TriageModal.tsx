"use client";

import { useState } from "react";
import { Report } from "@/lib/types";
import { useRole } from "./RoleContext";
import { X, Send, Award, CheckCircle, ShieldAlert } from "lucide-react";

interface TriageModalProps {
  report: Report | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function TriageModal({ report, onClose, onUpdate }: TriageModalProps) {
  const { role } = useRole();
  const [newStatus, setNewStatus] = useState<string>(report?.status || "SUBMITTED");
  const [bounty, setBounty] = useState<number | string>(report?.bountyAmount || "");
  const [commentText, setCommentText] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!report) return null;

  const canTriage = role === "TRIAGER" || role === "ADMIN";

  const handleUpdateStatusAndBounty = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          bountyAmount: bounty ? Number(bounty) : null,
        }),
      });

      if (res.ok) {
        onUpdate();
        onClose();
      }
    } catch (e) {
      console.error("Failed to update report", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: report.id,
          body: commentText.trim(),
          isInternal: isInternalComment,
          role: role,
        }),
      });

      if (res.ok) {
        setCommentText("");
        onUpdate();
      }
    } catch (e) {
      console.error("Failed to post comment", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141b2b] border border-[#00b4d8]/40 rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#00b4d8]/15 text-[#00b4d8] border border-[#00b4d8]/30">
              {report.referenceId}
            </span>
            <div>
              <h2 className="text-lg font-bold text-white leading-snug">{report.title}</h2>
              <div className="text-xs font-mono text-gray-400 mt-0.5">
                Target: <span className="text-[#00ff9c]">{report.asset}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0b0f19] p-3.5 rounded-lg border border-white/5 text-xs">
          <div>
            <span className="text-gray-500 font-mono text-[10.5px] uppercase block">CVSS Score</span>
            <span className="text-white font-mono font-bold text-sm">{report.cvssScore.toFixed(1)} / 10.0</span>
          </div>
          <div>
            <span className="text-gray-500 font-mono text-[10.5px] uppercase block">Severity</span>
            <span className="text-orange-400 font-mono font-bold">{report.severity}</span>
          </div>
          <div>
            <span className="text-gray-500 font-mono text-[10.5px] uppercase block">Status</span>
            <span className="text-[#00ff9c] font-mono font-bold">{report.status}</span>
          </div>
          <div>
            <span className="text-gray-500 font-mono text-[10.5px] uppercase block">Awarded Bounty</span>
            <span className="text-[#00ff9c] font-mono font-bold">
              {report.bountyAmount ? `$${report.bountyAmount.toLocaleString()}` : "Pending"}
            </span>
          </div>
        </div>

        {/* Vector */}
        <div>
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-1">
            CVSS v3.1 Vector String
          </span>
          <code className="text-xs font-mono text-[#00b4d8] bg-black/40 px-3 py-1.5 rounded border border-white/5 block overflow-x-auto">
            {report.cvssVector}
          </code>
        </div>

        {/* Description & Impact */}
        <div className="space-y-3 text-xs">
          <div>
            <span className="font-mono text-gray-400 uppercase tracking-wider block mb-1">Vulnerability Summary</span>
            <div className="bg-black/30 p-3 rounded border border-white/5 text-gray-200 leading-relaxed">
              {report.description}
            </div>
          </div>

          <div>
            <span className="font-mono text-gray-400 uppercase tracking-wider block mb-1">Reproduction Steps</span>
            <pre className="bg-black/40 p-3 rounded border border-white/5 text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
              {report.stepsToReproduce}
            </pre>
          </div>

          {report.poc && (
            <div>
              <span className="font-mono text-[#00ff9c] uppercase tracking-wider block mb-1">
                Sanitized Proof-of-Concept (PoC)
              </span>
              <pre className="bg-black/50 p-3 rounded border border-white/10 text-[#a8dadc] font-mono whitespace-pre-wrap overflow-x-auto">
                {report.poc}
              </pre>
            </div>
          )}
        </div>

        {/* Triager Controls (Visible to TRIAGER and ADMIN) */}
        {canTriage && (
          <div className="bg-[#0b0f19] border border-[#00b4d8]/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00ff9c] font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>SECURITY OPERATIONS TRIAGE ACTIONS (ACTIVE AS: {role})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Update Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#141b2b] border border-white/10 rounded text-white outline-none focus:border-[#00b4d8]"
                >
                  <option value="SUBMITTED">SUBMITTED (Under Review)</option>
                  <option value="TRIAGED">TRIAGED (Valid Finding)</option>
                  <option value="ACCEPTED">ACCEPTED (Ready for Fix)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Remediation)</option>
                  <option value="RESOLVED">RESOLVED (Patched &amp; Verified)</option>
                  <option value="DUPLICATE">DUPLICATE</option>
                  <option value="REJECTED">REJECTED / Out of Scope</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Assign Bounty Reward ($ USD):</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={bounty}
                    onChange={(e) => setBounty(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full h-9 pl-7 pr-3 bg-[#141b2b] border border-white/10 rounded text-white outline-none focus:border-[#00ff9c] font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleUpdateStatusAndBounty}
              disabled={loading}
              className="w-full h-9 bg-gradient-to-r from-[#00ff9c] to-[#00b4d8] hover:opacity-90 text-[#070a10] font-bold rounded text-xs transition-opacity"
            >
              {loading ? "Updating..." : "Save Triage Changes"}
            </button>
          </div>
        )}

        {/* Activity & Comments Thread */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider">
            Triage Discussion &amp; Audit Log ({report.comments?.length || 0})
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {(!report.comments || report.comments.length === 0) && (
              <div className="text-xs text-gray-500 italic py-2">No comments recorded yet.</div>
            )}
            {report.comments?.map((c) => (
              <div
                key={c.id}
                className={`p-2.5 rounded text-xs space-y-1 ${
                  c.isInternal
                    ? "bg-yellow-950/20 border border-yellow-500/30 text-yellow-200"
                    : "bg-black/30 border border-white/5 text-gray-300"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-white flex items-center gap-1">
                    <span>{c.author.avatar || "👤"}</span>
                    <span>{c.author.name}</span>
                    <span className="text-gray-400 text-[10px]">({c.author.role})</span>
                  </span>
                  {c.isInternal && (
                    <span className="px-1.5 py-0.2 bg-yellow-500/20 text-yellow-400 text-[10px] rounded uppercase font-bold">
                      Internal Note
                    </span>
                  )}
                </div>
                <p className="leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add feedback or triage note..."
              className="flex-1 h-9 px-3 bg-[#0b0f19] border border-white/10 rounded text-xs text-white placeholder-gray-500 outline-none focus:border-[#00b4d8]"
            />
            {canTriage && (
              <label className="flex items-center gap-1 text-[11px] text-gray-400 cursor-pointer font-mono whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isInternalComment}
                  onChange={(e) => setIsInternalComment(e.target.checked)}
                />
                <span>Internal</span>
              </label>
            )}
            <button
              type="submit"
              className="h-9 px-3 bg-white/10 hover:bg-white/20 text-white rounded text-xs flex items-center gap-1 font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
