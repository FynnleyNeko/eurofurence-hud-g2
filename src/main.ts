import { globals } from "./globals.ts";
import { constants } from "./constants.ts";
import { bridge } from "./evenrealities.ts";
import { setFromBridge } from "./phone.ts";
import { render } from "./renderer.ts";
import { updateInfo } from "./calendar.ts";

render();
setFromBridge();
const global_render_interval = setInterval(render, constants.INTERVAL_RENDER);
const global_sync_interval = setInterval(updateInfo, constants.INTERVAL_SYNC);
