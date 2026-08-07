import { globals } from "./globals.ts";
import { constants } from "./constants.ts";
import { sendToG2 } from "./evenrealities.ts";
import { getDay, getClock, canvasToPng, datefuzzy } from "./util.ts";
import { replenishQueue } from "./calendar.ts";
import {
  artistsLoungeInfo,
  artShowInfo,
  artistsAlleyInfo,
  dealersDenInfo,
  vrPortalInfo,
  cchClubInfo,
  outsideClubInfo,
  codaClubInfo,
} from "./events.ts";

// Main render manager: update time -> throw out old events (replenish queue if needed) -> render -> split -> send
export async function render() {
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
  const fullrender = await draw_canvas();

  // Lower quadrants only have to be updated when they aren't invisible or need to be cleared
  if (
    globals.compact_mode_cur !== globals.compact_mode ||
    globals.compact_mode > 1
  ) {
    await sendToG2(
      await Promise.all([
        canvasToPng(quadrantize("tl", fullrender)),
        canvasToPng(quadrantize("tr", fullrender)),
        canvasToPng(quadrantize("bl", fullrender)),
        canvasToPng(quadrantize("br", fullrender)),
      ]),
    );
  } else {
    await sendToG2(
      await Promise.all([
        canvasToPng(quadrantize("tl", fullrender)),
        canvasToPng(quadrantize("tr", fullrender)),
      ]),
    );
  }

  // Show that we acted on globals
  globals.compact_mode_cur = globals.compact_mode;
  globals.dimmed_mode_cur = globals.dimmed_mode;

  const render_end = new Date();
  document.getElementById("results_last_render").innerText =
    `Last render (every minute): ${(globals.now.getHours() < 10 ? "0" : "") + globals.now.getHours()}:${(globals.now.getMinutes() < 10 ? "0" : "") + globals.now.getMinutes()}:${(globals.now.getSeconds() < 10 ? "0" : "") + globals.now.getSeconds()} (${render_end.getTime() - render_start.getTime()} ms)`;
}

// Renders the full resolution UI to a single canvas
function draw_canvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 576;
  canvas.height = 288;
  const ctx = canvas.getContext("2d")!;

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
  ctx.fillText(`${getClock()}`, canvas.width, 15);
  if (globals.compact_mode > 0) {
    ctx.fillStyle = globals.dimmed_mode
      ? constants.THEME_DARK_SECONDARY
      : constants.THEME_BRIGHT_PRIMARY;
    ctx.fillText(`${getDay()}`, canvas.width, 30);

    // Draw event schedule graphic
    if (globals.events.length >= 3) ctx.drawImage(constants.IMG_ARROW3, 60, 0);
    if (globals.events.length === 2) ctx.drawImage(constants.IMG_ARROW2, 60, 0);
    if (globals.events.length === 1) ctx.drawImage(constants.IMG_ARROW1, 60, 0);

    // Draw EF logo
    ctx.drawImage(constants.IMG_LOGO, canvas.width - 32, 35);

    // Draw sync failure warning
    if (!globals.last_sync_worked)
      ctx.drawImage(constants.WARN_SYNC, canvas.width - 64, 35);

    // Dim image areas to half luminance
    ctx.fillStyle = globals.dimmed_mode
      ? `rgba(0,0,0,${constants.THEME_DARK_IMAGES})`
      : `rgba(0,0,0,${constants.THEME_BRIGHT_IMAGES})`;
    if (globals.events.length > 0) ctx.fillRect(60, 0, 15, 90); // arrows
    ctx.fillRect(canvas.width - 64, 35, 64, 32); // ef logo
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
    ctx.fillRect(
      0,
      canvas.height - constants.UI_HEIGHT_BOT,
      27,
      constants.UI_HEIGHT_BOT,
    ); // left
    ctx.fillRect(
      canvas.width - 27,
      canvas.height - constants.UI_HEIGHT_BOT,
      27,
      constants.UI_HEIGHT_BOT,
    );
  }

  return canvas;
}

// Divide main canvas into quadrants
function quadrantize(where, fullCanvas) {
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
