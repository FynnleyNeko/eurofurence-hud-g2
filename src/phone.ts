import { bridge } from "./evenrealities.ts";
import { globals } from "./globals.ts";
import { staff_init, staff_stop } from "./staff.ts";
import { updateInfo } from "./calendar.ts";

// These elements are guaranteed to exist in index.html, so throw if they vanish.
function byId<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Element #${id} not found`);
  return node as T;
}
const input = (id: string) => byId<HTMLInputElement>(id);

const CALENDAR_URL_PREFIX =
  "https://app.eurofurence.org/EF30/Api/Events/Favorites/calendar.ics/?token=";

// Remember previously input settings and auto-initialize with them
export async function setFromBridge() {
  input("url").value = (await bridge.getLocalStorage("CALENDAR_URL")) ?? "";
  if (input("url").value.startsWith(CALENDAR_URL_PREFIX)) {
    globals.api_key_set = true;
    updateInfo();
  } else {
    globals.api_key_set = false;
  }

  input("staffkey").value = (await bridge.getLocalStorage("STAFF_KEY")) ?? "";
  if (input("staffkey").value.startsWith("ef-skey-")) {
    staff_init(input("staffkey").value);
  }

  const restored_attendee_type = await bridge.getLocalStorage("ATTENDEE_TYPE");
  if (restored_attendee_type !== "") {
    input("attendee_type").value = restored_attendee_type;
    globals.attendee_type = Number(restored_attendee_type);
  }
}

export function render_timings(start: Date, end: Date) {
  byId("results_last_render").innerText =
    `Last render (every minute): ${(globals.now.getHours() < 10 ? "0" : "") + globals.now.getHours()}:${(globals.now.getMinutes() < 10 ? "0" : "") + globals.now.getMinutes()}:${(globals.now.getSeconds() < 10 ? "0" : "") + globals.now.getSeconds()} (${end.getTime() - start.getTime()} ms)`;
}

export function sync_stats(count: number) {
  byId("results_last_sync").innerText =
    `Last sync (every 30 mins): ${(globals.now.getHours() < 10 ? "0" : "") + globals.now.getHours()}:${(globals.now.getMinutes() < 10 ? "0" : "") + globals.now.getMinutes()}:${(globals.now.getSeconds() < 10 ? "0" : "") + globals.now.getSeconds()} (${count} Events)`;
}

// Register listener for "sync & save" button
byId("sync").addEventListener("click", function () {
  if (input("url").value.startsWith(CALENDAR_URL_PREFIX)) {
    bridge.setLocalStorage("CALENDAR_URL", input("url").value);
    globals.api_key_set = true;
    updateInfo();
  }
});

// Register listener for attendee type dropdown
byId<HTMLSelectElement>("attendee_type").addEventListener(
  "change",
  function () {
    bridge.setLocalStorage("ATTENDEE_TYPE", input("attendee_type").value);
    globals.attendee_type = Number(input("attendee_type").value);
  },
);

// Register listener for staff mode init button
byId("staffsync").addEventListener("click", function () {
  if (input("staffkey").value.startsWith("ef-skey-")) {
    bridge.setLocalStorage("STAFF_KEY", input("staffkey").value);
    staff_init(input("staffkey").value);
  }
});

byId("staffstop").addEventListener("click", function () {
  staff_stop();
});
