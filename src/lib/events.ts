import { EventEmitter } from "events";
import { RealtimeEventType, RealtimeMessage } from "./types";

declare global {
  var __realtimeEmitter: EventEmitter | undefined;
}

export const realtimeEmitter: EventEmitter =
  global.__realtimeEmitter || new EventEmitter();

realtimeEmitter.setMaxListeners(200);

if (process.env.NODE_ENV !== "production") {
  global.__realtimeEmitter = realtimeEmitter;
}

export function emitRealtimeEvent(type: RealtimeEventType, data: any) {
  const message: RealtimeMessage = {
    type,
    data,
    timestamp: new Date().toISOString(),
  };
  try {
    realtimeEmitter.emit("event", message);
  } catch (err) {
    console.error("Error emitting realtime event:", err);
  }
}
