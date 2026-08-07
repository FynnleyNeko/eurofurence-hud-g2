export type Audience =
  | "everyone"
  | "sponsor"
  | "superSponsor"
  | "artists"
  | "dealers"
  | "staff"
  | "ticketed";

export type VenueStatus = "setup" | "preview" | "open" | "event" | "teardown";

export interface EurofurenceEvent {
  title: string;
  start: string;
  end: string;
  audience: Audience[];
  status: VenueStatus;
}

export interface EurofurenceSchedule {
  artistsLounge: EurofurenceEvent[];
  artShow: EurofurenceEvent[];
  artistsAlley: EurofurenceEvent[];
  dealersDen: EurofurenceEvent[];
  vrPortal: EurofurenceEvent[];
  cchClub: EurofurenceEvent[];
  outsideClub: EurofurenceEvent[];
  codaClub: EurofurenceEvent[];
}

export const eurofurenceSchedule: EurofurenceSchedule = {
  artistsLounge: [
    {
      title: "Artists' Lounge – Let's be creative together! (Wed)",
      start: "2026-08-19T14:00:00+02:00",
      end: "2026-08-20T03:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Artists' Lounge – Let's be creative together! (Thu)",
      start: "2026-08-20T10:00:00+02:00",
      end: "2026-08-21T03:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Artists' Lounge – Let's be creative together! (Fri)",
      start: "2026-08-21T10:00:00+02:00",
      end: "2026-08-22T03:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Artists' Lounge – Let's be creative together! (Sat)",
      start: "2026-08-22T10:00:00+02:00",
      end: "2026-08-23T00:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
  ],
  artShow: [
    {
      title: "Art Show  –  Check-In and setup for artists",
      start: "2026-08-19T13:00:00+02:00",
      end: "2026-08-19T20:00:00+02:00",
      audience: ["artists"],
      status: "setup",
    },
    {
      title: "Art Show – Setup for artists (finish)",
      start: "2026-08-19T20:00:00+02:00",
      end: "2026-08-19T21:00:00+02:00",
      audience: ["artists"],
      status: "setup",
    },
    {
      title: "Art Show – Vernissage",
      start: "2026-08-19T21:00:00+02:00",
      end: "2026-08-20T00:00:00+02:00",
      audience: ["ticketed"],
      status: "event",
    },
    {
      title: "Art Show – Setup for artists",
      start: "2026-08-20T11:00:00+02:00",
      end: "2026-08-20T12:00:00+02:00",
      audience: ["artists"],
      status: "setup",
    },
    {
      title: "Art Show – Super Sponsors only",
      start: "2026-08-20T12:00:00+02:00",
      end: "2026-08-20T13:00:00+02:00",
      audience: ["superSponsor"],
      status: "preview",
    },
    {
      title: "Art Show – Sponsors and Super Sponsors only",
      start: "2026-08-20T13:00:00+02:00",
      end: "2026-08-20T14:00:00+02:00",
      audience: ["sponsor"],
      status: "preview",
    },
    {
      title: "Art Show",
      start: "2026-08-20T14:00:00+02:00",
      end: "2026-08-20T18:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Art Show - Life Drawing Session (A lesson on light)",
      start: "2026-08-20T18:00:00+02:00",
      end: "2026-08-20T19:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Dealers' Den & Art Show Party – Dealers, artists and staff only!",
      start: "2026-08-20T20:00:00+02:00",
      end: "2026-08-20T22:00:00+02:00",
      audience: ["dealers", "artists", "staff"],
      status: "event",
    },
    {
      title: "Art Show – Midnight Canvas",
      start: "2026-08-20T22:00:00+02:00",
      end: "2026-08-21T01:00:00+02:00",
      audience: ["ticketed"],
      status: "event",
    },
    {
      title: "Art Show – Setup for artists",
      start: "2026-08-21T12:00:00+02:00",
      end: "2026-08-21T13:00:00+02:00",
      audience: ["artists"],
      status: "setup",
    },
    {
      title: "Art Show",
      start: "2026-08-21T13:00:00+02:00",
      end: "2026-08-21T18:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Art Show – Closing & Auction",
      start: "2026-08-21T18:00:00+02:00",
      end: "2026-08-21T21:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Art Show – Sales and pickup",
      start: "2026-08-22T13:00:00+02:00",
      end: "2026-08-22T19:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Art Show - Artist Payout and unsold Art pickup",
      start: "2026-08-22T19:00:00+02:00",
      end: "2026-08-22T21:00:00+02:00",
      audience: ["artists"],
      status: "teardown",
    },
    {
      title: "Art Show – Unsold Art pickup and teardown",
      start: "2026-08-22T21:00:00+02:00",
      end: "2026-08-22T22:00:00+02:00",
      audience: ["artists"],
      status: "teardown",
    },
  ],
  artistsAlley: [
    {
      title: "Artist Alley – Thu",
      start: "2026-08-20T11:00:00+02:00",
      end: "2026-08-21T02:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Artist Alley – Fri",
      start: "2026-08-21T10:00:00+02:00",
      end: "2026-08-22T02:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Artist Alley – Sat",
      start: "2026-08-22T10:00:00+02:00",
      end: "2026-08-23T02:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
  ],
  dealersDen: [
    {
      title: "Dealers' Den – Registration & Setup",
      start: "2026-08-19T17:00:00+02:00",
      end: "2026-08-19T21:00:00+02:00",
      audience: ["dealers"],
      status: "setup",
    },
    {
      title: "Dealers' Den – Registration & Setup",
      start: "2026-08-20T10:00:00+02:00",
      end: "2026-08-20T12:00:00+02:00",
      audience: ["dealers"],
      status: "setup",
    },
    {
      title: "Dealers' Den – Super Sponsors only",
      start: "2026-08-20T12:00:00+02:00",
      end: "2026-08-20T13:00:00+02:00",
      audience: ["superSponsor"],
      status: "preview",
    },
    {
      title: "Dealers' Den – Sponsors and Super Sponsors only",
      start: "2026-08-20T13:00:00+02:00",
      end: "2026-08-20T14:00:00+02:00",
      audience: ["sponsor"],
      status: "preview",
    },
    {
      title: "Dealers' Den",
      start: "2026-08-20T14:00:00+02:00",
      end: "2026-08-20T18:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Dealers' Den Closing – Dealers only",
      start: "2026-08-20T18:00:00+02:00",
      end: "2026-08-20T18:30:00+02:00",
      audience: ["dealers"],
      status: "teardown",
    },
    {
      title: "Dealers' Den – Registration & Setup",
      start: "2026-08-21T12:00:00+02:00",
      end: "2026-08-21T13:00:00+02:00",
      audience: ["dealers"],
      status: "setup",
    },
    {
      title: "Dealers' Den",
      start: "2026-08-21T13:00:00+02:00",
      end: "2026-08-21T18:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Dealers' Den Closing – Dealers only",
      start: "2026-08-21T18:00:00+02:00",
      end: "2026-08-21T18:30:00+02:00",
      audience: ["dealers"],
      status: "teardown",
    },
    {
      title: "Dealers' Den – Registration & Setup",
      start: "2026-08-22T11:00:00+02:00",
      end: "2026-08-22T12:00:00+02:00",
      audience: ["dealers"],
      status: "setup",
    },
    {
      title: "Dealers' Den",
      start: "2026-08-22T12:00:00+02:00",
      end: "2026-08-22T18:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "Dealers' Den Teardown – Dealers only",
      start: "2026-08-22T18:00:00+02:00",
      end: "2026-08-22T20:00:00+02:00",
      audience: ["dealers"],
      status: "teardown",
    },
  ],
  vrPortal: [
    {
      title: "VR Portal – Wed",
      start: "2026-08-19T15:00:00+02:00",
      end: "2026-08-20T03:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "VR Portal – Thu",
      start: "2026-08-20T13:00:00+02:00",
      end: "2026-08-21T03:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "VR Portal – Fri",
      start: "2026-08-21T13:00:00+02:00",
      end: "2026-08-22T03:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
    {
      title: "VR Portal – Sat",
      start: "2026-08-22T13:00:00+02:00",
      end: "2026-08-23T00:00:00+02:00",
      audience: ["everyone"],
      status: "open",
    },
  ],
  cchClub: [
    {
      title: "Opening Ceremony Seating",
      start: "2026-08-19T16:30:00+02:00",
      end: "2026-08-19T17:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Opening Ceremony",
      start: "2026-08-19T17:00:00+02:00",
      end: "2026-08-19T18:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Festival of Frequencies",
      start: "2026-08-19T22:00:00+02:00",
      end: "2026-08-20T04:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Enter the Arena Seating",
      start: "2026-08-20T14:00:00+02:00",
      end: "2026-08-20T14:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Enter the Arena",
      start: "2026-08-20T14:30:00+02:00",
      end: "2026-08-20T16:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "FTT Improv Panel Seating",
      start: "2026-08-20T17:30:00+02:00",
      end: "2026-08-20T18:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "FTT Improv Panel",
      start: "2026-08-20T18:00:00+02:00",
      end: "2026-08-20T20:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "The Sound Circus",
      start: "2026-08-20T22:30:00+02:00",
      end: "2026-08-21T03:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Taiko Workshop",
      start: "2026-08-21T14:00:00+02:00",
      end: "2026-08-21T16:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Taiko Bastards Seating",
      start: "2026-08-21T17:00:00+02:00",
      end: "2026-08-21T17:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Taiko Bastards",
      start: "2026-08-21T17:30:00+02:00",
      end: "2026-08-21T19:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "The Time-Travel Tent",
      start: "2026-08-21T22:30:00+02:00",
      end: "2026-08-22T03:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Paws on Fire Seating",
      start: "2026-08-22T13:00:00+02:00",
      end: "2026-08-22T13:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Paws on Fire",
      start: "2026-08-22T13:30:00+02:00",
      end: "2026-08-22T15:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "BigBlueDance",
      start: "2026-08-22T22:30:00+02:00",
      end: "2026-08-23T05:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
  ],
  outsideClub: [
    {
      title: "PHC",
      start: "2026-08-19T15:00:00+02:00",
      end: "2026-08-19T16:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Overworked Animals",
      start: "2026-08-19T18:00:00+02:00",
      end: "2026-08-19T19:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "PHC",
      start: "2026-08-19T20:00:00+02:00",
      end: "2026-08-19T22:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "PHC",
      start: "2026-08-20T15:00:00+02:00",
      end: "2026-08-20T22:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "WHSPRS",
      start: "2026-08-21T16:00:00+02:00",
      end: "2026-08-21T17:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "PHC",
      start: "2026-08-21T17:30:00+02:00",
      end: "2026-08-21T22:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "PHC",
      start: "2026-08-22T15:00:00+02:00",
      end: "2026-08-22T17:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Large Group Dance",
      start: "2026-08-22T17:00:00+02:00",
      end: "2026-08-22T17:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "PHC",
      start: "2026-08-22T17:30:00+02:00",
      end: "2026-08-22T22:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
  ],
  codaClub: [
    {
      title: "Drum and Bass",
      start: "2026-08-19T17:00:00+02:00",
      end: "2026-08-19T18:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Modular Techno",
      start: "2026-08-19T19:30:00+02:00",
      end: "2026-08-19T20:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "SloFluffCon Party",
      start: "2026-08-19T22:00:00+02:00",
      end: "2026-08-20T00:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "FurGroove",
      start: "2026-08-20T00:30:00+02:00",
      end: "2026-08-20T03:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Deep Paws 2026",
      start: "2026-08-20T17:00:00+02:00",
      end: "2026-08-20T18:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "LOCKED CLUB BY GO W!LD",
      start: "2026-08-21T00:30:00+02:00",
      end: "2026-08-21T03:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "KPop",
      start: "2026-08-21T15:00:00+02:00",
      end: "2026-08-21T16:30:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Animalz",
      start: "2026-08-21T22:00:00+02:00",
      end: "2026-08-22T03:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Yes It’s Warm!",
      start: "2026-08-22T19:00:00+02:00",
      end: "2026-08-22T21:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "Winter's Embrace X Dunkelfelltanz",
      start: "2026-08-22T22:00:00+02:00",
      end: "2026-08-23T03:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
    {
      title: "EF Nightclub",
      start: "2026-08-23T18:00:00+02:00",
      end: "2026-08-24T03:00:00+02:00",
      audience: ["everyone"],
      status: "event",
    },
  ],
};
