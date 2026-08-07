import { constants } from "./constants.ts";
import { setFromBridge } from "./phone.ts";
import { render } from "./renderer.ts";
import { updateInfo } from "./calendar.ts";

render();
setFromBridge();
setInterval(render, constants.INTERVAL_RENDER);
setInterval(updateInfo, constants.INTERVAL_SYNC);
