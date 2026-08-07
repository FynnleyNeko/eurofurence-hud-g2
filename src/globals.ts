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
  split_raw_events: [],
  all_events: [],
  events: [],

  // Current time
  now: new Date(),
};
