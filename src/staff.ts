import { constants } from "./constants.ts";
import { globals } from "./globals.ts";
import { G2pager } from "./evenrealities.ts";

let websocket: WebSocket | null = null;
let ran_before = false;
let reconnect_timer: ReturnType<typeof setTimeout> | null = null;
let pingInterval: ReturnType<typeof setTimeout> | null = null;

// Staff functionality handler
export function staff_init(key: string) {
  // Properly close a pre-existing session, otherwise we duplicate listeners
  if (pingInterval !== null) clearInterval(pingInterval);
  if (ran_before) websocket?.close();

  const ws = new WebSocket(constants.STAFF_PING_URL);
  websocket = ws;

  // Send authorization token and queue alive status interval
  ws.addEventListener("open", () => {
    ws.send(`{"auth":"${key}"}`);
    G2pager("");
    pingInterval = setInterval(() => {
      ws.send('{"status":"alive"}');
    }, constants.STAFF_PING_TIME);
  });

  // On close retry
  ws.addEventListener("close", () => {
    if (pingInterval !== null) clearInterval(pingInterval);
    globals.now = new Date();
    G2pager(
      `${(globals.now.getHours() < 10 ? "0" : "") + globals.now.getHours()}:${(globals.now.getMinutes() < 10 ? "0" : "") + globals.now.getMinutes()}:${(globals.now.getSeconds() < 10 ? "0" : "") + globals.now.getSeconds()} WebSocket failure, retrying...`,
    );
    if (reconnect_timer !== null) clearTimeout(reconnect_timer);
    reconnect_timer = setTimeout(
      () => staff_init(key),
      constants.STAFF_RETRY_TIME,
    );
  });

  // On WebSocket message put it on the pager area immediately
  ws.addEventListener("message", (e) => {
    let input: { message?: unknown } | null = null;
    try {
      input = JSON.parse(e.data);
    } catch (_e) {
      ws.send('{"status":"malformed"}');
      return;
    }
    if (input?.message !== undefined) {
      G2pager(String(input.message));
      ws.send('{"status":"received"}');
    } else {
      ws.send('{"status":"rejected"}');
    }
  });

  ran_before = true;
}

export function staff_stop() {
  G2pager("");
  if (ran_before) websocket?.close();
  websocket = null;

  if (reconnect_timer !== null) clearTimeout(reconnect_timer);
  reconnect_timer = null;
  if (pingInterval !== null) clearInterval(pingInterval);
  pingInterval = null;
}
