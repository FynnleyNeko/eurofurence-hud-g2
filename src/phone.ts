import { bridge } from "./evenrealities.ts";
import { globals } from "./globals.ts";
import { staff_init } from "./staff.ts";
import { updateInfo } from "./calendar.ts";

// Remember previously input settings and auto-initialize with them
export async function setFromBridge() {
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
    staff_init(document.querySelector<HTMLInputElement>("#staffkey").value);

  const restored_attendee_type = await bridge.getLocalStorage("ATTENDEE_TYPE");
  if (restored_attendee_type !== "") {
    document.querySelector<HTMLInputElement>("#attendee_type").value =
      restored_attendee_type;
    globals.attendee_type = Number(restored_attendee_type);
  }
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
      staff_init(document.querySelector<HTMLInputElement>("#staffkey").value);
    }
  });
