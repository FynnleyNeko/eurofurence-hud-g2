import {
  waitForEvenAppBridge,
  TextContainerProperty,
  TextContainerUpgrade,
  ImageContainerProperty,
  ImageRawDataUpdate,
  CreateStartUpPageContainer,
  OsEventTypeList,
} from "@evenrealities/even_hub_sdk";

import { globals } from "./globals.ts";
import { constants } from "./constants.ts";

const bridge = await waitForEvenAppBridge();

// Takes a date object and turns it into a string containing "--m" or "--h--m"
function datefuzzy(date) {
  let mins = (date.getTime() - globals.now.getTime()) / constants.MINUTES;
  let timestring;

  if (mins >= 60) {
    let hours = Math.floor(mins / 60);
    mins = Math.floor(mins % 60);
    timestring = hours + "h" + mins + "m";
  } else {
    timestring = Math.floor(mins) + "m";
  }

  return timestring;
}

// Returns text info about the Artists Lounges current status
function artistsLoungeInfo() {
  var output = "";

  // TODO - real impl
  output = "closed";

  return output;
}

// Returns text info about the Art Shows current status
function artShowInfo() {
  var output = "";

  // TODO - real impl
  output = "closed";

  return output;
}

// Returns text info about the Artists Alleys current status
function artistsAlleyInfo() {
  var output = "";

  // TODO - real impl
  output = "closed";

  return output;
}

// Returns text info about the Dealers Dens current status
function dealersDenInfo() {
  var output = "";

  // TODO - real impl
  output = "in 1h";

  return output;
}

// Returns text info about the VR portals current info
function vrPortalInfo() {
  var output = "";

  // TODO - real impl
  output = "closed";

  return output;
}

// Returns text info about the CCH club stages current status
function cchClubInfo() {
  var output = "";

  // TODO - real impl
  output = "closed";

  return output;
}

// Returns text info about the outside stages current status
function outsideClubInfo() {
  var output = "";

  // TODO - real impl
  output = "PHC - Mixed genre";

  return output;
}

// Returns text info about the Coda Clubs current status
function codaClubInfo() {
  var output = "";

  // TODO - real impl
  output = "Hardstyle";

  return output;
}

// Renders the full resolution UI to a single canvas
function renderUI(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Show that we acted on globals
  globals.compact_mode_cur = globals.compact_mode;
  globals.dimmed_mode_cur = globals.dimmed_mode;

  // Draw schedule times
  if (globals.compact_mode > 0) {
    ctx.fillStyle = globals.dimmed_mode
      ? constants.THEME_DARK_PRIMARY
      : constants.THEME_BRIGHT_PRIMARY;
    ctx.textAlign = "right";
    ctx.font = "15px sans-serif";
    if (globals.events.length >= 1)
      ctx.fillText(`${datefuzzy(globals.events[0].at)}`, 60, 22);
    if (globals.events.length >= 2)
      ctx.fillText(`${datefuzzy(globals.events[1].at)}`, 60, 47);
    if (globals.events.length >= 3)
      ctx.fillText(`${datefuzzy(globals.events[2].at)}`, 60, 72);
  }

  // Draw titles
  ctx.fillStyle = globals.dimmed_mode
    ? constants.THEME_DARK_SECONDARY
    : constants.THEME_BRIGHT_SECONDARY;
  ctx.textAlign = "left";
  ctx.font = "15px sans-serif";
  if (globals.compact_mode > 0) {
    if (globals.events.length >= 1)
      ctx.fillText(
        `${globals.events[0].loc} ${globals.events[0].name}`,
        75,
        22,
      );
    if (globals.events.length >= 2)
      ctx.fillText(
        `${globals.events[1].loc} ${globals.events[1].name}`,
        75,
        47,
      );
    if (globals.events.length >= 3)
      ctx.fillText(
        `${globals.events[2].loc} ${globals.events[2].name}`,
        75,
        72,
      );
  } else {
    if (globals.events.length >= 1)
      ctx.fillText(
        `${datefuzzy(globals.events[0].at)} ${globals.events[0].loc} ${globals.events[0].name}`,
        0,
        15,
      );
  }
  if (globals.events.length === 0 && globals.api_key_set)
    ctx.fillText("No more favorites today!", 0, 15);

  // Draw rooms
  ctx.fillStyle = globals.dimmed_mode
    ? constants.THEME_DARK_PRIMARY
    : constants.THEME_BRIGHT_PRIMARY;
  ctx.textAlign = "left";
  ctx.font = "15px sans-serif";
  if (globals.compact_mode > 0) {
    if (globals.events.length >= 1)
      ctx.fillText(`${globals.events[0].loc}`, 75, 22);
    if (globals.events.length >= 2)
      ctx.fillText(`${globals.events[1].loc}`, 75, 47);
    if (globals.events.length >= 3)
      ctx.fillText(`${globals.events[2].loc}`, 75, 72);
  } else {
    if (globals.events.length >= 1)
      ctx.fillText(
        `${datefuzzy(globals.events[0].at)} ${globals.events[0].loc}`,
        0,
        15,
      );
  }

  // Gracefully handle long titles
  const gradient = ctx.createLinearGradient(
    constants.UI_WIDTH - 150,
    0,
    constants.UI_WIDTH - 90,
    0,
  );
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, "black");
  ctx.fillStyle = gradient;
  ctx.fillRect(constants.UI_WIDTH - 150, 0, 150, 90);

  // Draw API key warning
  if (!globals.api_key_set) {
    ctx.drawImage(constants.WARN_KEY, 140, 35);
    ctx.fillStyle = globals.dimmed_mode
      ? constants.THEME_DARK_PRIMARY
      : constants.THEME_BRIGHT_PRIMARY;
    ctx.textAlign = "left";
    ctx.font = "25px sans-serif";
    ctx.fillText("Calendar link not set!", 177, 61);
  }

  // Draw clock
  ctx.fillStyle = globals.dimmed_mode
    ? constants.THEME_DARK_PRIMARY
    : constants.THEME_BRIGHT_PRIMARY;
  ctx.textAlign = "right";
  ctx.font = "15px sans-serif";
  ctx.fillText(`${getClock()}`, width, 15);
  if (globals.compact_mode > 0) {
    ctx.fillStyle = globals.dimmed_mode
      ? constants.THEME_DARK_SECONDARY
      : constants.THEME_BRIGHT_PRIMARY;
    ctx.fillText(`${getDay()}`, width, 30);

    // Draw event schedule graphic
    if (globals.events.length >= 3) ctx.drawImage(constants.IMG_ARROW3, 60, 0);
    if (globals.events.length === 2) ctx.drawImage(constants.IMG_ARROW2, 60, 0);
    if (globals.events.length === 1) ctx.drawImage(constants.IMG_ARROW1, 60, 0);

    // Draw EF logo
    ctx.drawImage(constants.IMG_LOGO, width - 32, 35);

    // Draw sync failure warning
    if (!globals.last_sync_worked)
      ctx.drawImage(constants.WARN_SYNC, width - 64, 35);

    // Dim image areas to half luminance
    ctx.fillStyle = globals.dimmed_mode
      ? `rgba(0,0,0,${constants.THEME_DARK_IMAGES})`
      : `rgba(0,0,0,${constants.THEME_BRIGHT_IMAGES})`;
    if (globals.events.length > 0) ctx.fillRect(60, 0, 15, 90); // arrows
    ctx.fillRect(width - 64, 35, 64, 32); // ef logo
  }

  // Additional event info wip
  // Design concept: left -> artistry events, right -> entertainment events
  if (globals.compact_mode === 2) {
    // Icons
    ctx.drawImage(constants.IMG_AL, 5, 204);
    ctx.drawImage(constants.IMG_AS, 5, 226);
    ctx.drawImage(constants.IMG_AA, 5, 248);
    ctx.drawImage(constants.IMG_DD, 5, 270);
    ctx.drawImage(constants.IMG_VR, 554, 204);
    ctx.drawImage(constants.CLUB_CCH, 554, 226);
    ctx.drawImage(constants.CLUB_OUT, 554, 248);
    ctx.drawImage(constants.CLUB_RAD, 554, 270);

    // Left leaning text objects (artistry related long-run events)
    ctx.fillStyle = globals.dimmed_mode ? "#888" : "#fff";
    ctx.textAlign = "left";
    ctx.font = "15px sans-serif";
    ctx.fillText(artistsLoungeInfo(), 27, 218);
    ctx.fillText(artShowInfo(), 27, 240);
    ctx.fillText(artistsAlleyInfo(), 27, 262);
    ctx.fillText(dealersDenInfo(), 27, 284);

    // Right leaning text objects (club related long-run events)
    ctx.fillStyle = globals.dimmed_mode ? "#888" : "#fff";
    ctx.textAlign = "right";
    ctx.font = "15px sans-serif";
    ctx.fillText(vrPortalInfo(), 549, 218);
    ctx.fillText(cchClubInfo(), 549, 240);
    ctx.fillText(outsideClubInfo(), 549, 262);
    ctx.fillText(codaClubInfo(), 549, 284);

    // Dim image areas to half luminance
    ctx.fillStyle = globals.dimmed_mode
      ? `rgba(0,0,0,${constants.THEME_DARK_IMAGES})`
      : `rgba(0,0,0,${constants.THEME_BRIGHT_IMAGES})`;
    ctx.fillRect(0, 288 - constants.UI_HEIGHT_BOT, 27, constants.UI_HEIGHT_BOT); // left
    ctx.fillRect(
      width - 27,
      288 - constants.UI_HEIGHT_BOT,
      27,
      constants.UI_HEIGHT_BOT,
    ); // right
  }

  return canvas;
}

// Divide main canvas into quadrants
function split(where, fullCanvas) {
  const canvas = document.createElement("canvas");
  canvas.width = constants.UI_WIDTH / 2;
  if (where.startsWith("t")) {
    canvas.height = constants.UI_HEIGHT;
  } else {
    canvas.height = constants.UI_HEIGHT_BOT;
  }

  const ctx = canvas.getContext("2d")!;

  if (where === "tl") ctx.drawImage(fullCanvas, 0, 0);
  if (where === "tr") ctx.drawImage(fullCanvas, -(constants.UI_WIDTH / 2), 0);
  if (where === "bl")
    ctx.drawImage(fullCanvas, 0, -288 + constants.UI_HEIGHT_BOT);
  if (where === "br")
    ctx.drawImage(
      fullCanvas,
      -(constants.UI_WIDTH / 2),
      -288 + constants.UI_HEIGHT_BOT,
    );

  return canvas;
}

// Turn canvas into frame data for the G2
async function canvasToPng(canvas, target) {
  const dataUrl = await canvas.toDataURL("image/png");
  const binary = await atob(dataUrl.split(",")[1]);
  const bytes: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    bytes.push(binary.charCodeAt(i));
  }
  return bytes;
}

// Clock string helper
function getClock() {
  return `${constants.DAYNAMES[globals.now.getDay()]} ${(globals.now.getHours() < 10 ? "0" : "") + globals.now.getHours()}:${(globals.now.getMinutes() < 10 ? "0" : "") + globals.now.getMinutes()}`;
}

// Con day string helper
function getDay() {
  return `Day ${globals.now.getDate() - constants.START.getDate() >= 0 ? globals.now.getDate() - constants.START.getDate() + 1 : globals.now.getDate() - constants.START.getDate()}`;
}

// Main render manager: update time -> throw out old events (replenish queue if needed) -> render -> split -> send
async function render() {
  const render_start = new Date();
  if (constants.MOCK_TIME !== "") {
    globals.now = new Date(constants.MOCK_TIME);
  } else {
    globals.now = new Date();
  }

  if (
    globals.events[0]?.at.getTime() - globals.now.getTime() <
    -constants.LATE_GRACE
  ) {
    globals.events.shift();
    replenishQueue();
  }

  const fullrender = await renderUI(576, 288);
  const frame_tl = split("tl", fullrender);
  const frame_tr = split("tr", fullrender);
  const frame_bl = split("bl", fullrender);
  const frame_br = split("br", fullrender);

  const [tlarr, trarr, blarr, brarr] = await Promise.all([
    canvasToPng(frame_tl),
    canvasToPng(frame_tr),
    canvasToPng(frame_bl),
    canvasToPng(frame_br),
  ]);

  await Promise.all([
    bridge.updateImageRawData(
      new ImageRawDataUpdate({
        containerID: 2,
        containerName: "tleft",
        imageData: tlarr,
      }),
    ),
    bridge.updateImageRawData(
      new ImageRawDataUpdate({
        containerID: 3,
        containerName: "tright",
        imageData: trarr,
      }),
    ),
    bridge.updateImageRawData(
      new ImageRawDataUpdate({
        containerID: 4,
        containerName: "bleft",
        imageData: blarr,
      }),
    ),
    bridge.updateImageRawData(
      new ImageRawDataUpdate({
        containerID: 5,
        containerName: "bright",
        imageData: brarr,
      }),
    ),
  ]);

  const render_end = new Date();
  document.getElementById("results_last_render").innerText =
    `Last render (every minute): ${(globals.now.getHours() < 10 ? "0" : "") + globals.now.getHours()}:${(globals.now.getMinutes() < 10 ? "0" : "") + globals.now.getMinutes()}:${(globals.now.getSeconds() < 10 ? "0" : "") + globals.now.getSeconds()} (${render_end.getTime() - render_start.getTime()} ms)`;
}

// Handles filling the displayed events queue recursively from the raw event data
function replenishQueue() {
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
async function parseEvents() {
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
  document.getElementById("results_last_sync").innerText =
    `Last sync (every 30 mins): ${(globals.now.getHours() < 10 ? "0" : "") + globals.now.getHours()}:${(globals.now.getMinutes() < 10 ? "0" : "") + globals.now.getMinutes()}:${(globals.now.getSeconds() < 10 ? "0" : "") + globals.now.getSeconds()} (${globals.all_events.length} Events)`;

  replenishQueue();
  render();
}

// Fetches the calendar from Euforuence backend and splits+filters them into a preliminary unformatted array
async function updateInfo() {
  const res = await fetch(await bridge.getLocalStorage("CALENDAR_URL"));

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

// Define initial UI
const text = new TextContainerProperty({
  xPosition: 0,
  yPosition: constants.UI_HEIGHT,
  width: constants.UI_WIDTH,
  height: 288 - constants.UI_HEIGHT - constants.UI_HEIGHT_BOT,
  borderWidth: 0,
  paddingLength: 4,
  containerID: 1,
  containerName: "inputslave",
  content: "",
  isEventCapture: 1,
});
const tleft = new ImageContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: constants.UI_WIDTH / 2,
  height: constants.UI_HEIGHT,
  containerID: 2,
  containerName: "tleft",
});
const tright = new ImageContainerProperty({
  xPosition: constants.UI_WIDTH / 2,
  yPosition: 0,
  width: constants.UI_WIDTH / 2,
  height: constants.UI_HEIGHT,
  containerID: 3,
  containerName: "tright",
});
const bleft = new ImageContainerProperty({
  xPosition: 0,
  yPosition: 288 - constants.UI_HEIGHT_BOT,
  width: constants.UI_WIDTH / 2,
  height: constants.UI_HEIGHT_BOT,
  containerID: 4,
  containerName: "bleft",
});
const bright = new ImageContainerProperty({
  xPosition: constants.UI_WIDTH / 2,
  yPosition: 288 - constants.UI_HEIGHT_BOT,
  width: constants.UI_WIDTH / 2,
  height: constants.UI_HEIGHT_BOT,
  containerID: 5,
  containerName: "bright",
});

// Send initial UI
const result = await bridge.createStartUpPageContainer(
  new CreateStartUpPageContainer({
    containerTotalNum: 1,
    textObject: [text],
    imageObject: [tleft, tright, bleft, bright],
  }),
);

// Init input listener
const unsubscribe = bridge.onEvenHubEvent((event) => {
  const sysType = event.sysEvent?.eventType ?? null;
  const textType = event.textEvent?.eventType ?? null;

  // Tap to undim the UI for 3 minutes
  if (event.jsonData.eventType === undefined) {
    if (globals.dimmed_mode) {
      globals.dimmed_mode = false;
      setTimeout(() => {
        globals.dimmed_mode = true;
      }, constants.DIM_TIMER);
    } else {
      globals.dimmed_mode = true;
    }
    if (globals.dimmed_mode !== globals.dimmed_mode_cur) {
      render();
    }
    return;
  }

  // Swipe up to decrease detail level
  if (event.jsonData.eventType === 1) {
    if (globals.compact_mode > 0) globals.compact_mode--;
    if (globals.compact_mode !== globals.compact_mode_cur) {
      render();
    }
    return;
  }

  // Swipe down to increase detail level
  if (event.jsonData.eventType === 2) {
    if (globals.compact_mode < 2) globals.compact_mode++;
    if (globals.compact_mode !== globals.compact_mode_cur) {
      render();
    }
    return;
  }

  // Double click to summon exit modal
  if (event.jsonData.eventType === 3) {
    bridge.shutDownPageContainer(1);
    return;
  }

  if (
    sysType === OsEventTypeList.SYSTEM_EXIT_EVENT ||
    sysType === OsEventTypeList.ABNORMAL_EXIT_EVENT
  ) {
    unsubscribe();
  }
});

// Staff functionality handler
function staff_init() {
  // TODO websocket staff api
  console.log("staff init reached");
}

// Register listener for "sync & save" button
document.getElementById("sync").addEventListener("click", function (event) {
  if (
    document
      .querySelector<HTMLInputElement>("#url")
      .value.startsWith(
        "https://app.eurofurence.org/EF30/Api/Events/Favorites/calendar.ics/?token=",
      )
  ) {
    bridge.setLocalStorage(
      "CALENDAR_URL",
      document.querySelector<HTMLInputElement>("#url").value,
    );
    globals.api_key_set = true;
    updateInfo();
  }
});

// Register listener for attendee type dropdown
document
  .getElementById("attendee_type")
  .addEventListener("change", function (event) {
    bridge.setLocalStorage(
      "ATTENDEE_TYPE",
      document.querySelector<HTMLInputElement>("#attendee_type").value,
    );
    globals.attendee_type = Number(
      document.querySelector<HTMLInputElement>("#attendee_type").value,
    );
  });

// Register listener for staff mode init button
document
  .getElementById("staffsync")
  .addEventListener("click", function (event) {
    if (
      document
        .querySelector<HTMLInputElement>("#staffkey")
        .value.startsWith("ef-skey-")
    ) {
      bridge.setLocalStorage(
        "STAFF_KEY",
        document.querySelector<HTMLInputElement>("#staffkey").value,
      );
      staff_init();
    }
  });

// Remember previously input settings and auto-initialize with them
async function setFromBridge() {
  document.querySelector<HTMLInputElement>("#url").value =
    await bridge.getLocalStorage("CALENDAR_URL");
  if (
    document
      .querySelector<HTMLInputElement>("#url")
      .value.startsWith(
        "https://app.eurofurence.org/EF30/Api/Events/Favorites/calendar.ics/?token=",
      )
  ) {
    globals.api_key_set = true;
    updateInfo();
  } else {
    globals.api_key_set = false;
  }

  document.querySelector<HTMLInputElement>("#staffkey").value =
    await bridge.getLocalStorage("STAFF_KEY");
  if (
    document
      .querySelector<HTMLInputElement>("#staffkey")
      .value.startsWith("ef-skey-")
  )
    staff_init();

  const restored_attendee_type = await bridge.getLocalStorage("ATTENDEE_TYPE");
  if (restored_attendee_type !== "") {
    document.querySelector<HTMLInputElement>("#attendee_type").value =
      restored_attendee_type;
    globals.attendee_type = Number(restored_attendee_type);
  }
}

render();
setFromBridge();
const global_render_interval = setInterval(render, constants.INTERVAL_RENDER);
const global_sync_interval = setInterval(updateInfo, constants.INTERVAL_SYNC);
