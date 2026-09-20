"use client";

import { useState } from "react";
import CvssCalculator from "./CvssCalculator";
import { X, Send, AlertCircle, CheckCircle } from "lucide-react";

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubmitReportModal({ isOpen, onClose, onSuccess }: SubmitReportModalProps) {
  const [title, setTitle] = useState("");
  const [asset, setAsset] = useState("");
  const [type, setType] = useState("SQL Injection");
  const [cvssScore, setCvssScore] = useState(8.5);
  const [cvssVector, setCvssVector] = useState("CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N");
  const [severity, setSeverity] = useState("HIGH");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [poc, setPoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCvssChange = (score: number, vector: string, sev: string) => {
    setCvssScore(score);
    setCvssVector(vector);
    setSeverity(sev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !asset.trim() || !description.trim() || !steps.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          asset: asset.trim(),
          vulnerabilityType: type,
          cvssVector,
          cvssScore,
          severity,
          description: description.trim(),
          stepsToReproduce: steps.trim(),
          poc: poc.trim() || null,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit report.");
      }
    } catch (e: any) {
      setError("Network error submitting report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141b2b] border border-[#00ff9c]/40 rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff9c]"></span>
              <span>Submit Vulnerability Report</span>
            </h2>
            <p className="text-xs text-gray-400">
              Submit a validated security finding for triage and bounty evaluation.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-md text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-300 font-medium block mb-1">
                Report Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Remote Code Execution in PDF Exporter"
                className="w-full h-9 px-3 bg-[#0b0f19] border border-white/10 rounded text-white outline-none focus:border-[#00ff9c]"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 font-medium block mb-1">
                Vulnerability Class <span className="text-red-400">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-9 px-2.5 bg-[#0b0f19] border border-white/10 rounded text-white outline-none focus:border-[#00ff9c]"
              >
                <option value="SQL Injection">SQL Injection</option>
                <option value="Cross-Site Scripting">Cross-Site Scripting (XSS)</option>
                <option value="Broken Access Control">Broken Access Control</option>
                <option value="IDOR">Insecure Direct Object Reference (IDOR)</option>
                <option value="SSRF">Server-Side Request Forgery (SSRF)</option>
                <option value="CSRF">Cross-Site Request Forgery (CSRF)</option>
                <option value="Sensitive Data Exposure">Sensitive Data Exposure</option>
                <option value="Open Redirect">Open Redirect</option>
                <option value="Security Misconfiguration">Security Misconfiguration</option>
                <option value="Remote Code Execution">Remote Code Execution (RCE)</option>
              </select>
            </div>
          </div>

          {/* Asset & CVSS Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-gray-300 font-medium block mb-1">
                Affected Target Asset <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                placeholder="e.g. api.example.com/v1/export"
                className="w-full h-9 px-3 bg-[#0b0f19] border border-white/10 rounded text-white font-mono outline-none focus:border-[#00ff9c]"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 font-medium block mb-1">Derived Severity</label>
              <div className="h-9 px-3 bg-[#0b0f19] border border-white/10 rounded flex items-center justify-between font-mono">
                <span className="text-white font-bold">{cvssScore.toFixed(1)}</span>
                <span className="text-xs text-[#00ff9c] font-bold">{severity}</span>
              </div>
            </div>
          </div>

          {/* Embedded CVSS Calculator */}
          <CvssCalculator onScoreChange={handleCvssChange} compact={true} />

          {/* Description */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">
              Technical Description &amp; Impact <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Explain root cause, flaw mechanism, and potential blast radius..."
              className="w-full p-2.5 bg-[#0b0f19] border border-white/10 rounded text-white outline-none focus:border-[#00ff9c] leading-relaxed"
              required
            />
          </div>

          {/* Steps */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">
              Steps to Reproduce <span className="text-red-400">*</span>
            </label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              rows={3}
              placeholder="1. Send request to endpoint&#10;2. Alter parameter with payload&#10;3. Observe response..."
              className="w-full p-2.5 bg-[#0b0f19] border border-white/10 rounded text-white font-mono outline-none focus:border-[#00ff9c] leading-relaxed"
              required
            />
          </div>

          {/* PoC */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">
              Proof-of-Concept Request / Payload (Optional)
            </label>
            <textarea
              value={poc}
              onChange={(e) => setPoc(e.target.value)}
              rows={3}
              placeholder="curl -X POST https://api.example.com/... or raw HTTP payload"
              className="w-full p-2.5 bg-[#0b0f19] border border-white/10 rounded text-white font-mono outline-none focus:border-[#00ff9c] leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-9 px-5 bg-gradient-to-r from-[#00ff9c] to-[#00d984] hover:opacity-90 text-[#070a10] font-bold rounded flex items-center gap-1.5 transition-opacity"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? "Submitting..." : "Submit Report"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
