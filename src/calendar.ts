import { globals } from "./globals.ts";
import { constants } from "./constants.ts";
import { bridge } from "./evenrealities.ts";
import { render } from "./renderer.ts";
import { sync_stats } from "./phone.ts";

// Handles filling the displayed events queue recursively from the raw event data
export function replenishQueue() {
  if (globals.events.length < 3) {
    let day_end = new Date(
      globals.now.getFullYear(),
      globals.now.getMonth(),
      globals.now.getDate() + 1,
      4,
    );
    let next_up = new Date("2069-04-20T00:00:00.000+00:00");
    let next_index;

    for (var i = 0; i < globals.all_events.length; i++) {
      if (globals.all_events[i].at.getTime() - next_up.getTime() < 0) {
        // Is this the soonest event seen so far in the loop?
        if (
          !globals.all_events[i].queued &&
          globals.all_events[i].at.getTime() - globals.now.getTime() >
            -constants.LATE_GRACE
        ) {
          // Has it not been queued before and isn't already over? (15 min start grace)
          if (globals.all_events[i].at.getTime() < day_end.getTime()) {
            // Is it "today" (con days go until 2AM technically, to fix clubs rolling)
            next_index = i;
            next_up = globals.all_events[i].at;
          }
        }
      }
    }

    if (next_index !== undefined) {
      globals.events.push(globals.all_events[next_index]);
      globals.all_events[next_index].queued = true;
      replenishQueue();
    }
  }
}

// Takes the split up raw events array and turns them into the objects needed for the queue
export async function parseEvents() {
  globals.all_events = []; // Clear before repopulating
  globals.split_raw_events.forEach((event) => {
    let at = event.match(/^DTSTART:.*$/gm);
    let loc = event.match(/^LOCATION:.*$/gm);
    let name = event.match(/^SUMMARY:.*$/gm);

    if (at === null) return;
    if (loc === null) loc = [""];
    if (name === null) name = [""];

    // Get:  20260822T090000Z
    // Need: 2026-08-19T04:33:42.000+00:00

    let time = at[0].replace(
      /DTSTART:([0-9]{4})([0-9]{2})([0-9]{2})T([0-9]{2})([0-9]{2})([0-9]{2})Z/,
      "$1-$2-$3T$4:$5:$6.000+00:00",
    );

    globals.all_events.push({
      at: new Date(time),
      loc: loc[0]
        .replace("LOCATION:", "")
        .replace("CCH ", "")
        .replace("Radisson ", "")
        .split(" – ")[0],
      name: name[0].replace("SUMMARY:", "").replaceAll("\\", ""),
      queued: false,
    });
  });

  sync_stats(globals.all_events.length);
  replenishQueue();
  render();
}

// Fetches the calendar from Euforuence backend and splits+filters them into a preliminary unformatted array
export async function updateInfo() {
  var res;

  try {
    res = await fetch(await bridge.getLocalStorage("CALENDAR_URL"));
  } catch (e) {
    globals.last_sync_worked = false;
    return;
  }

  if (!res.ok) {
    globals.last_sync_worked = false;
    return;
  } else {
    globals.last_sync_worked = true;
  }

  const text = await res.text();
  if (text.includes("BEGIN:VCALENDAR")) {
    globals.split_raw_events = []; // Clear before repopulating
    let temp = text.split("BEGIN:VEVENT");
    temp.forEach((event) => {
      globals.split_raw_events.push(
        event
          .split("\n")
          .filter(
            (line) =>
              line.startsWith("DTSTART") ||
              line.startsWith("SUMMARY") ||
              line.startsWith("LOCATION"),
          )
          .join("\n"),
      );
    });
    parseEvents();
  }
}
