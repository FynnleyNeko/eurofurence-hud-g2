# Eurofurence HUD for Even G2

![Eurofurence HUD](readme/header.png?raw=true)

A smart-glasses HUD that puts your **favorited Eurofurence events** on an [Even G2](https://evenrealities.com) whenever you glance at it. It pulls your personal event list straight from the Eurofurence app via the calendar sync link, renders it to a canvas, and pushes the frames to the glasses display.

## The three UI detail levels

The HUD has three detail levels, cycled with a swipe on the glasses (swipe up to use less, swipe down for more). Each shows only events from the current con day — the list never rolls into tomorrow's events.

### Extended
![Extended mode](readme/glasses_extended.png?raw=true)

Up to three upcoming events with times and rooms, plus live **open / closed / upcoming** status for the day-long venues — Art Show, Artists' Alley, Dealers' Den, VR Portal and the clubs. Venue status respects your **attendee tier** (see setup): sponsor-only events are only shown as open if you're a Sponsor or above.

### Normal *(default)*
![Normal mode](readme/glasses_normal.png?raw=true)

Up to three upcoming favorites with their times and rooms, alongside the current time and con day.

### Small
![Small mode](readme/glasses_compact.png?raw=true)

Just the next-up event and the current time — the minimal, at-a-glance view.

## Glance & gesture controls

- **Auto-dims** the display after 3 minutes of inactivity.
- **Tap** to bring it back to full brightness for another 3 minutes.
- **Swipe up / down** to cycle through the detail levels above.
- **Double-tap** to shut the HUD down.

## Getting started

### 1. Get your calendar link

Open the Eurofurence app (favorite a few events first — the HUD shows nothing until you have some), open the bottom menu → **Settings**, and tap the **link-copy icon** next to *"Add favorites to calendar"*.

![Getting the calendar link](readme/how_to_get_calendar_url.jpg?raw=true)

That copies an `.ics` URL to your clipboard.

### 2. Paste it into the HUD's phone screen

Open the HUD app's phone screen and paste the link into the calendar field:

![Phone setup screen](readme/phone_ui.png?raw=true)

1. Paste the `.ics` URL and press **Sync & Save**.
2. *(Optional)* Pick your **attendee type** — Regular Attendee, Contributor, Sponsor, or Super-Sponsor/Staff. This gates which venue events the Extended view counts as open (e.g. sponsor-only hours).
3. *(Optional, staff only)* Under **Staff mode**, enter your `ef-skey-…` key and press **Get staff alerts** to receive pager messages on the glasses; press **Stop** to disconnect.

The URL, attendee type and staff key are remembered on the device. The calendar is automatically re-synced every 30 minutes and re-rendered every minute, so you can just put the glasses on and go.

## Running it locally

```bash
npm install
npm run dev
```

Then run either:

- **Simulator** (no glasses needed): `npm run simulate`
- **Real glasses**: `npx evenhub qr --url http://<your-ip>:5173` and scan the QR code with the [Even](https://evenrealities.com) companion app.

> For testing you can pin the clock to a specific date by setting `MOCK_TIME` in `src/constants.ts`.

## Building & distributing

```bash
npm run build   # type-check (strict) + production bundle
npm run pack    # wraps dist/ into an .ehpk package
```

## Project structure

| Path | Purpose |
|---|---|
| `index.html` | Phone-side companion UI (calendar link, attendee type, staff mode) |
| `src/main.ts` | Entry point — kicks off the initial render/sync and their intervals |
| `src/constants.ts` | All config: UI dimensions, theme, timings, media, dates |
| `src/globals.ts` | Shared mutable state and the `CalEvent` type |
| `src/util.ts` | Pure helpers — fuzzy time strings, clock/con-day, `canvasToPng` |
| `src/calendar.ts` | Fetches the calendar `.ics`, parses it and fills the render queue |
| `src/events.ts` | Venue status logic (open / closed / upcoming) for the Extended view |
| `src/eurofurenceSchedule.ts` | Hardcoded con schedule data for the venue status |
| `src/renderer.ts` | Draws the full-resolution UI canvas and splits it into quadrants |
| `src/evenrealities.ts` | Even Hub SDK bridge — container setup, frame + message push, input handling |
| `src/staff.ts` | Staff pager WebSocket client |
| `src/phone.ts` | Phone UI wiring — sync button, attendee type, staff controls |
| `public/assets/` | Runtime image assets (icons, logos), served at `/assets` |
| `readme/` | The screenshots used in this document |
| `app.json` | Even Hub package manifest (network permission whitelist, version) |
| `vite.config.ts` | Dev server config (port + LAN host binding for the QR flow) |
| `tsconfig.json` | Strict TypeScript config |

---

*Built with far too much effort for a one-off by [Fynnley](https://zerv.al), [Jake](https://jakefox.de) and my trusty companion Shimmer. Have a fun con!*
