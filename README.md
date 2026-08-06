# Eurofurence HUD for Even G2

![Demo screen](/assets/readme/header.png?raw=true)

Simple HUD to display your favorited events from the Eurofurence app on your glasses, via the calendar sync URL found in Settings.

Comes with 2 UI modes:
- Normal -> Up to 3 events shown in addition to time and current con day
- Small -> Only the next up event and current time

Each will only show events for the current day, they won't roll over to show you tomorrows first event if you are at the end of your current experience.

Auto-dims after 3 minutes and can be brought back to full brightness with a simple tap!

## Usage

![Demo screen](/assets/readme/screenshot.jpg?raw=true)

1. Open the Eurofurence app
2. Log into your account and favorite some events
3. Open the bottom menu and go to Settings
4. Click the link copy icon next to "Sync calendar with phone"
5. Paste the link into the Eurofurence HUD app and press "sync & save"

The app is now set up and will automatically remember and resync whenever summoned from the glasses

## Run

```bash
npm install
npm run dev
```

Then either:
- **Simulator:** `npm run simulate`
- **Real glasses:** `npx evenhub qr --url http://<your-ip>:5173` and scan with the Even Hub companion app.

## Pretty up the code for legibility

```bash
npm run format
```

Code in /src will be formatted in a unified way to ensure indentation and style is mostly consistent.

## Pack for distribution

```bash
npm run pack
```

Produces an `.ehpk` file.

## What's in here

| File | Purpose |
|---|---|
| `/assets` | Folder containing assets, only ef30.png is used directly, the rest is baked into main.ts as base64 |
| `index.html` | Phone-side UI for entering calendar link |
| `src/main.ts` | Application code / G2 view renderer. |
| `app.json` | Even Hub manifest. |
| `tsconfig.json` | Standard Vite vanilla-ts config. |
| `vite.config.ts` | Dev server on port 5173, host binding for LAN QR access. |
