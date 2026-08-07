import {
  waitForEvenAppBridge,
  TextContainerProperty,
  TextContainerUpgrade,
  ImageContainerProperty,
  ImageRawDataUpdate,
  CreateStartUpPageContainer,
  OsEventTypeList,
} from "@evenrealities/even_hub_sdk";

const bridge = await waitForEvenAppBridge();

// GLOBALS
const MOCK_TIME = ""; // Set to a datestring to mock that time, leave empty for normal operation
const CON_START = "2026-08-19T02:00:00.000+00:00";
const UI_WIDTH = 576;
const UI_HEIGHT = 90;
const UI_HEIGHT_BOT = 84;
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const LATE_GRACE = 15 * MINUTES;
const DIM_TIMER = 3 * MINUTES;
const INTERVAL_RENDER = 1 * MINUTES;
const INTERVAL_SYNC = 30 * MINUTES;
const THEME_BRIGHT_PRIMARY = "#fff";
const THEME_BRIGHT_SECONDARY = "#888";
const THEME_BRIGHT_IMAGES = 0.75;
const THEME_DARK_PRIMARY = "#888";
const THEME_DARK_SECONDARY = "#444";
const THEME_DARK_IMAGES = 0.9;
const STAFF_PING_URL = "wss://efhudstaff.cub.pink/";

// Attendee type info
// 0 = Attendee
// 1 = Contributor
// 2 = Sponsor
// 3 = SuperSponsor
var attendee_type = 0;

// staff system related keys
var staff_key = undefined;

// warning related states
var last_sync_worked = false;
var api_key_set = false;

// UI logic states
var compact_mode = 2;
var compact_mode_cur = 2;
var dimmed_mode = true;
var dimmed_mode_cur = true;

// Event storage
var split_raw_events = [];
var all_events = [];
var events = [];

// Frame storage (quadrants)
var tlarr, trarr, blarr, brarr;

// Image assets
const img_arrow1 = new Image();
img_arrow1.src = "../assets/arrow1.png";
const img_arrow2 = new Image();
img_arrow2.src = "../assets/arrow2.png";
const img_arrow3 = new Image();
img_arrow3.src = "../assets/arrow3.png";
const img_logo = new Image();
img_logo.src = "../assets/logo.png";
const img_vr = new Image();
img_vr.src = "../assets/vrportal.png";
const club_out = new Image();
club_out.src = "../assets/club_out.png";
const club_cch = new Image();
club_cch.src = "../assets/club_cch.png";
const club_rad = new Image();
club_rad.src = "../assets/club_rad.png";
const img_al = new Image();
img_al.src = "../assets/artists_lounge.png";
const img_as = new Image();
img_as.src = "../assets/artshow.png";
const img_aa = new Image();
img_aa.src = "../assets/artists_alley.png";
const img_dd = new Image();
img_dd.src = "../assets/dealers_den.png";
const warn_sync = new Image();
warn_sync.src = "../assets/wifi_lost.png";
const warn_key = new Image();
warn_key.src = "../assets/key_missing.png";

// Time initialization
const start = new Date(CON_START);
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var now = new Date();

// Takes a date object and turns it into a string containing "--m" or "--h--m"
function datefuzzy(date) {
  let mins = (date.getTime() - now.getTime()) / MINUTES;
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
  compact_mode_cur = compact_mode;
  dimmed_mode_cur = dimmed_mode;

  // Draw schedule times
  if (compact_mode > 0) {
    ctx.fillStyle = dimmed_mode ? THEME_DARK_PRIMARY : THEME_BRIGHT_PRIMARY;
    ctx.textAlign = "right";
    ctx.font = "15px sans-serif";
    if (events.length >= 1) ctx.fillText(`${datefuzzy(events[0].at)}`, 60, 22);
    if (events.length >= 2) ctx.fillText(`${datefuzzy(events[1].at)}`, 60, 47);
    if (events.length >= 3) ctx.fillText(`${datefuzzy(events[2].at)}`, 60, 72);
  }

  // Draw titles
  ctx.fillStyle = dimmed_mode ? THEME_DARK_SECONDARY : THEME_BRIGHT_SECONDARY;
  ctx.textAlign = "left";
  ctx.font = "15px sans-serif";
  if (compact_mode > 0) {
    if (events.length >= 1)
      ctx.fillText(`${events[0].loc} ${events[0].name}`, 75, 22);
    if (events.length >= 2)
      ctx.fillText(`${events[1].loc} ${events[1].name}`, 75, 47);
    if (events.length >= 3)
      ctx.fillText(`${events[2].loc} ${events[2].name}`, 75, 72);
  } else {
    if (events.length >= 1)
      ctx.fillText(
        `${datefuzzy(events[0].at)} ${events[0].loc} ${events[0].name}`,
        0,
        15,
      );
  }
  if (events.length === 0 && api_key_set)
    ctx.fillText("No more favorites today!", 0, 15);

  // Draw rooms
  ctx.fillStyle = dimmed_mode ? THEME_DARK_PRIMARY : THEME_BRIGHT_PRIMARY;
  ctx.textAlign = "left";
  ctx.font = "15px sans-serif";
  if (compact_mode > 0) {
    if (events.length >= 1) ctx.fillText(`${events[0].loc}`, 75, 22);
    if (events.length >= 2) ctx.fillText(`${events[1].loc}`, 75, 47);
    if (events.length >= 3) ctx.fillText(`${events[2].loc}`, 75, 72);
  } else {
    if (events.length >= 1)
      ctx.fillText(`${datefuzzy(events[0].at)} ${events[0].loc}`, 0, 15);
  }

  // Gracefully handle long titles
  const gradient = ctx.createLinearGradient(
    UI_WIDTH - 150,
    0,
    UI_WIDTH - 90,
    0,
  );
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, "black");
  ctx.fillStyle = gradient;
  ctx.fillRect(UI_WIDTH - 150, 0, 150, 90);

  // Draw API key warning
  if (!api_key_set) {
    ctx.drawImage(warn_key, 140, 35);
    ctx.fillStyle = dimmed_mode ? THEME_DARK_PRIMARY : THEME_BRIGHT_PRIMARY;
    ctx.textAlign = "left";
    ctx.font = "25px sans-serif";
    ctx.fillText("Calendar link not set!", 177, 61);
  }

  // Draw clock
  ctx.fillStyle = dimmed_mode ? THEME_DARK_PRIMARY : THEME_BRIGHT_PRIMARY;
  ctx.textAlign = "right";
  ctx.font = "15px sans-serif";
  ctx.fillText(`${getClock()}`, width, 15);
  if (compact_mode > 0) {
    ctx.fillStyle = dimmed_mode ? THEME_DARK_SECONDARY : THEME_BRIGHT_PRIMARY;
    ctx.fillText(`${getDay()}`, width, 30);

    // Draw event schedule graphic
    if (events.length >= 3) ctx.drawImage(img_arrow3, 60, 0);
    if (events.length === 2) ctx.drawImage(img_arrow2, 60, 0);
    if (events.length === 1) ctx.drawImage(img_arrow1, 60, 0);

    // Draw EF logo
    ctx.drawImage(img_logo, width - 32, 35);

    // Draw sync failure warning
    if (!last_sync_worked) ctx.drawImage(warn_sync, width - 64, 35);

    // Dim image areas to half luminance
    ctx.fillStyle = dimmed_mode
      ? `rgba(0,0,0,${THEME_DARK_IMAGES})`
      : `rgba(0,0,0,${THEME_BRIGHT_IMAGES})`;
    if (events.length > 0) ctx.fillRect(60, 0, 15, 90); // arrows
    ctx.fillRect(width - 64, 35, 64, 32); // ef logo
  }

  // Additional event info wip
  // Design concept: left -> artistry events, right -> entertainment events
  if (compact_mode === 2) {
    // Icons
    ctx.drawImage(img_al, 5, 204);
    ctx.drawImage(img_as, 5, 226);
    ctx.drawImage(img_aa, 5, 248);
    ctx.drawImage(img_dd, 5, 270);
    ctx.drawImage(img_vr, 554, 204);
    ctx.drawImage(club_cch, 554, 226);
    ctx.drawImage(club_out, 554, 248);
    ctx.drawImage(club_rad, 554, 270);

    // Left leaning text objects (artistry related long-run events)
    ctx.fillStyle = dimmed_mode ? "#888" : "#fff";
    ctx.textAlign = "left";
    ctx.font = "15px sans-serif";
    ctx.fillText(artistsLoungeInfo(), 27, 218);
    ctx.fillText(artShowInfo(), 27, 240);
    ctx.fillText(artistsAlleyInfo(), 27, 262);
    ctx.fillText(dealersDenInfo(), 27, 284);

    // Right leaning text objects (club related long-run events)
    ctx.fillStyle = dimmed_mode ? "#888" : "#fff";
    ctx.textAlign = "right";
    ctx.font = "15px sans-serif";
    ctx.fillText(vrPortalInfo(), 549, 218);
    ctx.fillText(cchClubInfo(), 549, 240);
    ctx.fillText(outsideClubInfo(), 549, 262);
    ctx.fillText(codaClubInfo(), 549, 284);

    // Dim image areas to half luminance
    ctx.fillStyle = dimmed_mode
      ? `rgba(0,0,0,${THEME_DARK_IMAGES})`
      : `rgba(0,0,0,${THEME_BRIGHT_IMAGES})`;
    ctx.fillRect(0, 288 - UI_HEIGHT_BOT, 27, UI_HEIGHT_BOT); // left
    ctx.fillRect(width - 27, 288 - UI_HEIGHT_BOT, 27, UI_HEIGHT_BOT); // right
  }

  return canvas;
}

// Divide main canvas into quadrants
function split(where, fullCanvas) {
  const canvas = document.createElement("canvas");
  canvas.width = UI_WIDTH / 2;
  if (where.startsWith("t")) {
    canvas.height = UI_HEIGHT;
  } else {
    canvas.height = UI_HEIGHT_BOT;
  }

  const ctx = canvas.getContext("2d")!;

  if (where === "tl") ctx.drawImage(fullCanvas, 0, 0);
  if (where === "tr") ctx.drawImage(fullCanvas, -(UI_WIDTH / 2), 0);
  if (where === "bl") ctx.drawImage(fullCanvas, 0, -288 + UI_HEIGHT_BOT);
  if (where === "br")
    ctx.drawImage(fullCanvas, -(UI_WIDTH / 2), -288 + UI_HEIGHT_BOT);

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
  if (target === "tl") tlarr = bytes;
  if (target === "tr") trarr = bytes;
  if (target === "bl") blarr = bytes;
  if (target === "br") brarr = bytes;
}

// Clock string helper
function getClock() {
  return `${dayNames[now.getDay()]} ${(now.getHours() < 10 ? "0" : "") + now.getHours()}:${(now.getMinutes() < 10 ? "0" : "") + now.getMinutes()}`;
}

// Con day string helper
function getDay() {
  return `Day ${now.getDate() - start.getDate() >= 0 ? now.getDate() - start.getDate() + 1 : now.getDate() - start.getDate()}`;
}

// Main render manager: update time -> throw out old events (replenish queue if needed) -> render -> split -> send
async function render() {
  const render_start = new Date();
  if (MOCK_TIME !== "") {
    now = new Date(MOCK_TIME);
  } else {
    now = new Date();
  }

  if (events[0]?.at.getTime() - now.getTime() < -LATE_GRACE) {
    events.shift();
    replenishQueue();
  }

  const fullrender = await renderUI(576, 288);
  const frame_tl = split("tl", fullrender);
  const frame_tr = split("tr", fullrender);
  const frame_bl = split("bl", fullrender);
  const frame_br = split("br", fullrender);

  await Promise.all([
    canvasToPng(frame_tl, "tl"),
    canvasToPng(frame_tr, "tr"),
    canvasToPng(frame_bl, "bl"),
    canvasToPng(frame_br, "br"),
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
    `Last render (every minute): ${(now.getHours() < 10 ? "0" : "") + now.getHours()}:${(now.getMinutes() < 10 ? "0" : "") + now.getMinutes()}:${(now.getSeconds() < 10 ? "0" : "") + now.getSeconds()} (${render_end.getTime() - render_start.getTime()} ms)`;
}

// Handles filling the displayed events queue recursively from the raw event data
function replenishQueue() {
  if (events.length < 3) {
    let day_end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      4,
    );
    let next_up = new Date("2069-04-20T00:00:00.000+00:00");
    let next_index;

    for (var i = 0; i < all_events.length; i++) {
      if (all_events[i].at.getTime() - next_up.getTime() < 0) {
        // Is this the soonest event seen so far in the loop?
        if (
          !all_events[i].queued &&
          all_events[i].at.getTime() - now.getTime() > -LATE_GRACE
        ) {
          // Has it not been queued before and isn't already over? (15 min start grace)
          if (all_events[i].at.getTime() < day_end.getTime()) {
            // Is it "today" (con days go until 2AM technically, to fix clubs rolling)
            next_index = i;
            next_up = all_events[i].at;
          }
        }
      }
    }

    if (next_index !== undefined) {
      events.push(all_events[next_index]);
      all_events[next_index].queued = true;
      replenishQueue();
    }
  }
}

// Takes the split up raw events array and turns them into the objects needed for the queue
async function parseEvents() {
  all_events = []; // Clear before repopulating
  split_raw_events.forEach((event) => {
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

    all_events.push({
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
    `Last sync (every 30 mins): ${(now.getHours() < 10 ? "0" : "") + now.getHours()}:${(now.getMinutes() < 10 ? "0" : "") + now.getMinutes()}:${(now.getSeconds() < 10 ? "0" : "") + now.getSeconds()} (${all_events.length} Events)`;

  replenishQueue();
  render();
}

// Fetches the calendar from Euforuence backend and splits+filters them into a preliminary unformatted array
async function updateInfo() {
  const res = await fetch(await bridge.getLocalStorage("CALENDAR_URL"));

  if (!res.ok) {
    last_sync_worked = false;
    return;
  } else {
    last_sync_worked = true;
  }

  const text = await res.text();
  if (text.includes("BEGIN:VCALENDAR")) {
    split_raw_events = []; // Clear before repopulating
    let temp = text.split("BEGIN:VEVENT");
    temp.forEach((event) => {
      split_raw_events.push(
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
  yPosition: UI_HEIGHT,
  width: UI_WIDTH,
  height: 288 - UI_HEIGHT - UI_HEIGHT_BOT,
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
  width: UI_WIDTH / 2,
  height: UI_HEIGHT,
  containerID: 2,
  containerName: "tleft",
});
const tright = new ImageContainerProperty({
  xPosition: UI_WIDTH / 2,
  yPosition: 0,
  width: UI_WIDTH / 2,
  height: UI_HEIGHT,
  containerID: 3,
  containerName: "tright",
});
const bleft = new ImageContainerProperty({
  xPosition: 0,
  yPosition: 288 - UI_HEIGHT_BOT,
  width: UI_WIDTH / 2,
  height: UI_HEIGHT_BOT,
  containerID: 4,
  containerName: "bleft",
});
const bright = new ImageContainerProperty({
  xPosition: UI_WIDTH / 2,
  yPosition: 288 - UI_HEIGHT_BOT,
  width: UI_WIDTH / 2,
  height: UI_HEIGHT_BOT,
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
    if (dimmed_mode) {
      dimmed_mode = false;
      setTimeout(() => {
        dimmed_mode = true;
      }, DIM_TIMER);
    } else {
      dimmed_mode = true;
    }
    if (dimmed_mode !== dimmed_mode_cur) {
      render();
    }
    return;
  }

  // Swipe up to decrease detail level
  if (event.jsonData.eventType === 1) {
    if (compact_mode > 0) compact_mode--;
    if (compact_mode !== compact_mode_cur) {
      render();
    }
    return;
  }

  // Swipe down to increase detail level
  if (event.jsonData.eventType === 2) {
    if (compact_mode < 2) compact_mode++;
    if (compact_mode !== compact_mode_cur) {
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
    api_key_set = true;
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
    attendee_type =
      Number(document.querySelector<HTMLInputElement>("#attendee_type").value);
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
    api_key_set = true;
    updateInfo();
  } else {
    api_key_set = false;
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
    attendee_type = Number(restored_attendee_type);
  }
}

render();
setFromBridge();
const global_render_interval = setInterval(render, INTERVAL_RENDER);
const global_sync_interval = setInterval(updateInfo, INTERVAL_SYNC);
