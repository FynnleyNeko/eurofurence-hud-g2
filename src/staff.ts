import { constants } from "./constants.ts";
import { globals } from "./globals.ts";
import { G2pager } from "./evenrealities.ts";

var websocket;
var websocket_ran_before = false;

// Staff functionality handler
export function staff_init(key) {
  // Properly close a pre-existing session, otherwise we duplicate listeners
  if (websocket_ran_before) websocket.close();
  
  websocket = new WebSocket(constants.STAFF_PING_URL);
  var pingInterval;

  // Send authorization token and queue alive status interval
  websocket.addEventListener("open", () => {
    websocket.send(`{"auth":"${key}"}`);
	G2pager("");
    pingInterval = setInterval(() => {
      websocket.send('{"status":"alive"}');
    }, constants.STAFF_PING_TIME);
  });

  // On close retry
  websocket.addEventListener("close", () => {
    clearInterval(pingInterval);
	globals.now = new Date();
    G2pager(
      `${(globals.now.getHours() < 10 ? "0" : "") + globals.now.getHours()}:${(globals.now.getMinutes() < 10 ? "0" : "") + globals.now.getMinutes()}:${(globals.now.getSeconds() < 10 ? "0" : "") + globals.now.getSeconds()} WebSocket failure, retrying...`,
    );
    setTimeout(staff_init, constants.STAFF_RETRY_TIME);
  });

  // On WebSocket message put it on the pager area immediately
  websocket.addEventListener("message", (e) => {
	var input;
	try {
      input = JSON.parse(e.data);
	} catch(e) {
	  websocket.send('{"status":"malformed"}');
	}
    if (input.message !== undefined) {
      G2pager(input.message);
      websocket.send('{"status":"received"}');
    } else {
      websocket.send('{"status":"rejected"}');
    }
  });
  
  websocket_ran_before = true;
}
