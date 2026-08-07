import { imageFromURL } from "./util.ts";

export const constants = {
  // global config
  MOCK_TIME: "2026-08-19T12:14:00.000+02:00", // Set to a datestring to mock that time, leave empty for normal operation
  UI_WIDTH: 576,
  UI_HEIGHT: 90,
  UI_HEIGHT_BOT: 84,
  SECONDS: 1000,
  MINUTES: 60 * 1000,
  LATE_GRACE: 15 * 60 * 1000,
  DIM_TIMER: 3 * 60 * 1000,
  INTERVAL_RENDER: 1 * 60 * 1000,
  INTERVAL_SYNC: 30 * 60 * 1000,
  THEME_BRIGHT_PRIMARY: "#fff",
  THEME_BRIGHT_SECONDARY: "#888",
  THEME_BRIGHT_IMAGES: 0.75,
  THEME_DARK_PRIMARY: "#888",
  THEME_DARK_SECONDARY: "#444",
  THEME_DARK_IMAGES: 0.9,
  STAFF_PING_URL: "wss://efhudstaff.cub.pink/",

  // Image assets
  IMG_ARROW1: imageFromURL("../assets/arrow1.png"),
  IMG_ARROW2: imageFromURL("../assets/arrow2.png"),
  IMG_ARROW3: imageFromURL("../assets/arrow3.png"),
  IMG_LOGO: imageFromURL("../assets/logo.png"),
  IMG_VR: imageFromURL("../assets/vrportal.png"),
  CLUB_OUT: imageFromURL("../assets/club_out.png"),
  CLUB_CCH: imageFromURL("../assets/club_cch.png"),
  CLUB_RAD: imageFromURL("../assets/club_rad.png"),
  IMG_AL: imageFromURL("../assets/artists_lounge.png"),
  IMG_AS: imageFromURL("../assets/artshow.png"),
  IMG_AA: imageFromURL("../assets/artists_alley.png"),
  IMG_DD: imageFromURL("../assets/dealers_den.png"),
  WARN_SYNC: imageFromURL("../assets/wifi_lost.png"),
  WARN_KEY: imageFromURL("../assets/key_missing.png"),

  // Date statics
  START: new Date("2026-08-19T02:00:00.000+00:00"),
  DAYNAMES: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
