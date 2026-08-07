import { globals } from "./globals.ts";
import { datefuzzy } from "./util.ts";
import {
  eurofurenceSchedule,
  Audience,
  EurofurenceEvent,
} from "./eurofurenceSchedule.ts";

function hasAccess(audience: Audience[]) {
  return audience.some((a) => {
    if (a === "everyone") return true;
    if (a === "sponsor") return globals.attendee_type >= 2;
    if (a === "superSponsor") return globals.attendee_type >= 3;
    return false;
  });
}

function mergeSpans(accessible: EurofurenceEvent[]) {
  let sorted = [...accessible].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  let spans: { start: number; end: number }[] = [];
  for (let event of sorted) {
    let start = new Date(event.start).getTime();
    let end = new Date(event.end).getTime();
    let last = spans[spans.length - 1];

    if (last && start <= last.end) {
      last.end = Math.max(last.end, end);
    } else {
      spans.push({ start, end });
    }
  }

  return spans;
}

function venueInfo(events: EurofurenceEvent[], showTitleWhenOpen = false) {
  let accessible = events.filter((event) => hasAccess(event.audience));

  let current = accessible.find(
    (event) =>
      globals.now.getTime() >= new Date(event.start).getTime() &&
      globals.now.getTime() < new Date(event.end).getTime(),
  );
  if (current) {

    let span = mergeSpans(accessible).find(
      (span) =>
        globals.now.getTime() >= span.start && globals.now.getTime() < span.end,
    );
    if (showTitleWhenOpen) return `${current.title} (${datefuzzy(new Date(span.end))})`;
    return `open (${datefuzzy(new Date(span.end))})`;
  }

  let day_end = new Date(
    globals.now.getFullYear(),
    globals.now.getMonth(),
    globals.now.getDate() + 1,
    4,
  );

  let upcoming = accessible
    .filter(
      (event) =>
        new Date(event.start).getTime() > globals.now.getTime() &&
        new Date(event.start).getTime() < day_end.getTime(),
    )
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  if (upcoming.length > 0)
    return "in " + datefuzzy(new Date(upcoming[0].start));

  return "closed";
}

// Returns text info about the Artists Lounges current status
export function artistsLoungeInfo() {
  return venueInfo(eurofurenceSchedule.artistsLounge);
}

// Returns text info about the Art Shows current status
export function artShowInfo() {
  return venueInfo(eurofurenceSchedule.artShow);
}

// Returns text info about the Artists Alleys current status
export function artistsAlleyInfo() {
  return venueInfo(eurofurenceSchedule.artistsAlley);
}

// Returns text info about the Dealers Dens current status
export function dealersDenInfo() {
  return venueInfo(eurofurenceSchedule.dealersDen);
}

// Returns text info about the VR portals current info
export function vrPortalInfo() {
  return venueInfo(eurofurenceSchedule.vrPortal);
}

// Returns text info about the CCH club stages current status
export function cchClubInfo() {
  return venueInfo(eurofurenceSchedule.cchClub, true);
}

// Returns text info about the outside stages current status
export function outsideClubInfo() {
  return venueInfo(eurofurenceSchedule.outsideClub, true);
}

// Returns text info about the Coda Clubs current status
export function codaClubInfo() {
  return venueInfo(eurofurenceSchedule.codaClub, true);
}
