import { NextRequest } from "next/server";
import { realtimeEmitter } from "@/lib/events";
import { RealtimeMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial connected acknowledgment
      const initMsg: RealtimeMessage = {
        type: "connected",
        data: {
          status: "ready",
          message: "CyberScope Real-Time Security Operations Stream Connected",
        },
        timestamp: new Date().toISOString(),
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initMsg)}\n\n`));

      // 2. Event listener for broadcasted mutations
      const onEvent = (msg: RealtimeMessage) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`));
        } catch {
          // Stream closed by client
        }
      };

      realtimeEmitter.on("event", onEvent);

      // 3. Heartbeat every 15 seconds to prevent browser/proxy connection dropouts
      const heartbeatTimer = setInterval(() => {
        try {
          const heartbeat: RealtimeMessage = {
            type: "heartbeat",
            data: { timestamp: Date.now() },
            timestamp: new Date().toISOString(),
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(heartbeat)}\n\n`));
        } catch {
          clearInterval(heartbeatTimer);
        }
      }, 15000);

      // 4. Cleanup when client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeatTimer);
        realtimeEmitter.off("event", onEvent);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
