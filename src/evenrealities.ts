import {
  waitForEvenAppBridge,
  TextContainerProperty,
  TextContainerUpgrade,
  ImageContainerProperty,
  ImageRawDataUpdate,
  CreateStartUpPageContainer,
  OsEventTypeList,
} from "@evenrealities/even_hub_sdk";

import { globals } from "./globals.ts";
import { constants } from "./constants.ts";
import { render } from "./renderer.ts";

export const bridge = await waitForEvenAppBridge();

// Define initial UI
const text = new TextContainerProperty({
  xPosition: 0,
  yPosition: constants.UI_HEIGHT,
  width: constants.UI_WIDTH,
  height: 288 - constants.UI_HEIGHT - constants.UI_HEIGHT_BOT,
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
  width: constants.UI_WIDTH / 2,
  height: constants.UI_HEIGHT,
  containerID: 2,
  containerName: "tleft",
});
const tright = new ImageContainerProperty({
  xPosition: constants.UI_WIDTH / 2,
  yPosition: 0,
  width: constants.UI_WIDTH / 2,
  height: constants.UI_HEIGHT,
  containerID: 3,
  containerName: "tright",
});
const bleft = new ImageContainerProperty({
  xPosition: 0,
  yPosition: 288 - constants.UI_HEIGHT_BOT,
  width: constants.UI_WIDTH / 2,
  height: constants.UI_HEIGHT_BOT,
  containerID: 4,
  containerName: "bleft",
});
const bright = new ImageContainerProperty({
  xPosition: constants.UI_WIDTH / 2,
  yPosition: 288 - constants.UI_HEIGHT_BOT,
  width: constants.UI_WIDTH / 2,
  height: constants.UI_HEIGHT_BOT,
  containerID: 5,
  containerName: "bright",
});

// Send initial UI
await bridge.createStartUpPageContainer(
  new CreateStartUpPageContainer({
    containerTotalNum: 1,
    textObject: [text],
    imageObject: [tleft, tright, bleft, bright],
  }),
);

// Init input listener
const event_listener = bridge.onEvenHubEvent((event) => {
  const sysType = event.sysEvent?.eventType ?? null;

  // Tap to undim the UI for 3 minutes
  if (event.jsonData?.eventType === undefined) {
    if (globals.dimmed_mode) {
      globals.dimmed_mode = false;
      setTimeout(() => {
        globals.dimmed_mode = true;
      }, constants.DIM_TIMER);
    } else {
      globals.dimmed_mode = true;
    }
    if (globals.dimmed_mode !== globals.dimmed_mode_cur) {
      render();
    }
    return;
  }

  // Swipe up to decrease detail level
  if (event.jsonData?.eventType === 1) {
    if (globals.compact_mode > 0) globals.compact_mode--;
    if (globals.compact_mode !== globals.compact_mode_cur) {
      render();
    }
    return;
  }

  // Swipe down to increase detail level
  if (event.jsonData?.eventType === 2) {
    if (globals.compact_mode < 2) globals.compact_mode++;
    if (globals.compact_mode !== globals.compact_mode_cur) {
      render();
    }
    return;
  }

  // Double click to summon exit modal
  if (event.jsonData?.eventType === 3) {
    bridge.shutDownPageContainer(1);
    return;
  }

  if (
    sysType === OsEventTypeList.SYSTEM_EXIT_EVENT ||
    sysType === OsEventTypeList.ABNORMAL_EXIT_EVENT
  ) {
    event_listener();
  }
});

// Send message text into the pager area
export async function G2pager(message: string) {
  return bridge.textContainerUpgrade(
    new TextContainerUpgrade({
      containerID: 1,
      containerName: "inputslave",
      content: message,
    }),
  );
}

// Send image quadrants onto the display
export async function sendToG2(quadrants: number[][]) {
  let promise: Promise<unknown>;

  if (quadrants.length > 2) {
    promise = Promise.all([
      bridge.updateImageRawData(
        new ImageRawDataUpdate({
          containerID: 2,
          containerName: "tleft",
          imageData: quadrants[0],
        }),
      ),
      bridge.updateImageRawData(
        new ImageRawDataUpdate({
          containerID: 3,
          containerName: "tright",
          imageData: quadrants[1],
        }),
      ),
      bridge.updateImageRawData(
        new ImageRawDataUpdate({
          containerID: 4,
          containerName: "bleft",
          imageData: quadrants[2],
        }),
      ),
      bridge.updateImageRawData(
        new ImageRawDataUpdate({
          containerID: 5,
          containerName: "bright",
          imageData: quadrants[3],
        }),
      ),
    ]);
  } else {
    promise = Promise.all([
      bridge.updateImageRawData(
        new ImageRawDataUpdate({
          containerID: 2,
          containerName: "tleft",
          imageData: quadrants[0],
        }),
      ),
      bridge.updateImageRawData(
        new ImageRawDataUpdate({
          containerID: 3,
          containerName: "tright",
          imageData: quadrants[1],
        }),
      ),
    ]);
  }
  return promise;
}
