// A single favorited/queued calendar event as parsed from the iCal feed
export interface CalEvent {
  at: Date;
  loc: string;
  name: string;
  queued: boolean;
}

export var globals = {
  // Attendee type info
  // 0 : Attendee
  // 1 : Contributor
  // 2 : Sponsor
  // 3 : SuperSponsor
  attendee_type: 0,

  // warning related states
  last_sync_worked: false,
  api_key_set: false,

  // UI logic states
  compact_mode: 1,
  compact_mode_cur: 1,
  dimmed_mode: true,
  dimmed_mode_cur: true,

  // Event storage
  split_raw_events: [] as string[],
  all_events: [] as CalEvent[],
  events: [] as CalEvent[],

  // Current time
  now: new Date(),
};
