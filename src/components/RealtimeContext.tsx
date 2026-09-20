"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { RealtimeEventType, RealtimeMessage, RealtimeToast } from "@/lib/types";
import { ShieldAlert, CheckCircle2, MessageSquare, DollarSign, X, Radio, Wifi, WifiOff } from "lucide-react";

interface RealtimeContextType {
  isConnected: boolean;
  toasts: RealtimeToast[];
  dismissToast: (id: string) => void;
  lastEvent: RealtimeMessage | null;
}

const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  toasts: [],
  dismissToast: () => {},
  lastEvent: null,
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState<RealtimeToast[]>([]);
  const [lastEvent, setLastEvent] = useState<RealtimeMessage | null>(null);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<RealtimeToast, "id" | "timestamp">) => {
    const newToast: RealtimeToast = {
      ...toast,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5 visible

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 6000);
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let retryDelay = 2000;

    function connect() {
      try {
        eventSource = new EventSource("/api/events");

        eventSource.onopen = () => {
          setIsConnected(true);
          retryDelay = 2000;
        };

        eventSource.onmessage = (e) => {
          try {
            const msg: RealtimeMessage = JSON.parse(e.data);
            setLastEvent(msg);

            // Dispatch global DOM event for component listeners
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("cyberscope:realtime", { detail: msg }));
            }

            // Create contextual cyber toast alerts
            if (msg.type === "report_created") {
              const r = msg.data?.report;
              addToast({
                type: "report_created",
                title: "⚡ New Vulnerability Reported",
                message: `${r?.referenceId || "New"}: ${r?.title} (${r?.severity || "HIGH"})`,
                badge: r?.severity || "REPORTED",
              });
            } else if (msg.type === "report_updated") {
              const r = msg.data?.report;
              addToast({
                type: "report_updated",
                title: "🛡️ Triage Status Updated",
                message: `${r?.referenceId}: Status shifted to ${r?.status}${
                  r?.bountyAmount ? ` • $${r.bountyAmount.toLocaleString()} awarded` : ""
                }`,
                badge: r?.status,
              });
            } else if (msg.type === "comment_added") {
              const c = msg.data?.comment;
              addToast({
                type: "comment_added",
                title: "💬 New Triage Communication",
                message: `${c?.author?.name || "Analyst"}: "${c?.body?.substring(0, 50)}${
                  (c?.body?.length || 0) > 50 ? "..." : ""
                }"`,
                badge: c?.isInternal ? "INTERNAL" : "PUBLIC",
              });
            }
          } catch (err) {
            console.error("Error parsing realtime message:", err);
          }
        };

        eventSource.onerror = () => {
          setIsConnected(false);
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnect with backoff
          reconnectTimeout = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 1.5, 15000);
            connect();
          }, retryDelay);
        };
      } catch (err) {
        console.error("Failed to connect EventSource:", err);
        setIsConnected(false);
      }
    }

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [addToast]);

  return (
    <RealtimeContext.Provider value={{ isConnected, toasts, dismissToast, lastEvent }}>
      {children}

      {/* Cyber Real-Time Toast Notifications Deck */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#0e1422]/95 border border-[#00ff9c]/40 rounded-lg p-3.5 shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden"
          >
            {/* Top glowing accent line */}
            <div
              className={`absolute top-0 left-0 right-0 h-[2px] ${
                toast.type === "report_created"
                  ? "bg-gradient-to-r from-[#00ff9c] to-[#00b4d8]"
                  : toast.type === "report_updated"
                  ? "bg-gradient-to-r from-[#9d4edd] to-[#00b4d8]"
                  : "bg-gradient-to-r from-[#ffd166] to-[#00ff9c]"
              }`}
            />

            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                    toast.type === "report_created"
                      ? "bg-[#00ff9c]/15 text-[#00ff9c]"
                      : toast.type === "report_updated"
                      ? "bg-[#9d4edd]/15 text-[#9d4edd]"
                      : "bg-[#ffd166]/15 text-[#ffd166]"
                  }`}
                >
                  {toast.type === "report_created" ? (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  ) : toast.type === "report_updated" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <MessageSquare className="w-3.5 h-3.5" />
                  )}
                </div>
                <h4 className="text-white font-bold text-xs tracking-tight">{toast.title}</h4>
              </div>

              <div className="flex items-center gap-1.5">
                {toast.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-white/10 text-gray-300 uppercase">
                    {toast.badge}
                  </span>
                )}
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-gray-400 hover:text-white transition-colors p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-gray-300 text-[11.5px] font-mono mt-1.5 leading-relaxed pl-8">
              {toast.message}
            </p>
          </div>
        ))}
      </div>
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  return useContext(RealtimeContext);
}

/**
 * Custom React hook to subscribe to live real-time events in any component
 */
export function useRealtimeListener(
  targetTypes: RealtimeEventType[] | "*",
  callback: (message: RealtimeMessage) => void
) {
  useEffect(() => {
    function handleEvent(e: Event) {
      const customEvent = e as CustomEvent<RealtimeMessage>;
      const msg = customEvent.detail;
      if (!msg) return;

      if (targetTypes === "*" || targetTypes.includes(msg.type)) {
        callback(msg);
      }
    }

    window.addEventListener("cyberscope:realtime", handleEvent);
    return () => {
      window.removeEventListener("cyberscope:realtime", handleEvent);
    };
  }, [targetTypes, callback]);
}
