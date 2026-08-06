import {
  waitForEvenAppBridge,
  TextContainerProperty,
  TextContainerUpgrade,
  ImageContainerProperty,
  ImageRawDataUpdate,
  CreateStartUpPageContainer,
  OsEventTypeList,
} from "@evenrealities/even_hub_sdk";

const bridge = await waitForEvenAppBridge();

// GLOBALS
const MOCK_TIME = ""; // Set to a datestring to mock that time, leave empty for normal operation
const CON_START = "2026-08-19T02:00:00.000+00:00";
const UI_WIDTH = 576;
const UI_HEIGHT = 90;
//const UI_HEIGHT_BOT = 144;
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const LATE_GRACE = 15 * MINUTES;
const INTERVAL_RENDER = 1 * MINUTES;
const INTERVAL_SYNC = 30 * MINUTES;
const THEME_BRIGHT_PRIMARY = "#fff";
const THEME_BRIGHT_SECONDARY = "#888";
const THEME_BRIGHT_IMAGES = 0.75;
const THEME_DARK_PRIMARY = "#888";
const THEME_DARK_SECONDARY = "#444";
const THEME_DARK_IMAGES = 0.9;

// UI logic states
var compact_mode = 1;
var compact_mode_cur = 1;
var dimmed_mode = true;
var dimmed_mode_cur = true;

// Event storage
var split_raw_events = [];
var all_events = [];
var events = [];

// Frame storage (quadrants)
var tlarr, trarr, blarr, brarr;

// Image assets
const img_arrow1 = new Image();
img_arrow1.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAABaCAMAAABQS/w8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACNUExURQAAAA4PDg8ODg4ODh0eHh4eHi4uLi0uLS4tLj09Pjw+PT09PU1MTU1NTFxdXV1cXVxcXGxsbHx8fHt7fIyLjIuMi4uLjJubm5uam6urqquqqqqqqwkJCYODg////4SEhAoKCsnJyYWFhd/f3+Dg4P39/eHh4YeHh8vLy8zMzAsLC4aGht3d3ezs7C8vLwao0b4AAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAADHcBAOgDAAAMdwEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABL8BtoKZm72AAAALxJREFUOE/tjMkSgjAQBeMCrqjgggtGQHBByP9/njOZB2rp2RNdkOp+oVC/6XR7MKHvODDBHQxhwmg8gQlTz4MJs/kCJvi+DxOCZQATVusNTAi3IUzY7Q8wJjpqrU8xSkUJpdZJPfAtk6LP6Aydo3N0hr6gU/QVHd9s3gu0Kh582yRBDRP+147LJ9p1VFmZpk1VkvFg21R00ksDN2clp6EWka/o4df+yg4WyWaoE8MraaB+Sx4+sqWl5RulnldgHLJS78buAAAAAElFTkSuQmCC";
const img_arrow2 = new Image();
img_arrow2.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAABaCAMAAABQS/w8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACQUExURQAAAA4PDg8ODg4ODh0eHh4eHi4uLi0uLS4tLj09Pjw+PT09PU1MTU1NTFxdXV1cXVxcXGxsbHx8fHt7fIyLjIuMi4uLjJubm5uam6urqquqqqqqqwkJCYODg/7+/oSEhAoKCsnJyf///4WFhd/f3+Dg4P39/eHh4YeHh8vLy8zMzAsLC4aGht3d3ezs7C8vL4MloXsAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAADHcBAOgDAAAMdwEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABL8BtoKZm72AAAAMVJREFUOE/tkVkOgkAQBccFXFHBBRdAFsEFYe5/O7unH6iJBzDRijOpehA/VH2m0+3BhL5lwQR7MIQJo/EEJkwdBybM5guY4LouTPCWHkxYrTcwwd/6MGG3P8CYIIyi6BijVJCkTNIMock0zdAndI4u0AU6R5/RGfqCjq8mbyValXd+2iZBDRN+qwP+xf//h8Gy+Ubblqpq3bauKzIeTOuabjo0cHPWcmtqEXmLPnzMV5nBINkOTWJ4Jg3UL8nDW/75DpR6ANL2L7SJi7d7AAAAAElFTkSuQmCC";
const img_arrow3 = new Image();
img_arrow3.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAABaCAYAAABnlQwOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAqJMAAOgDAACokwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADZnn4VeJEjdQAAAbFJREFUWEftlEuOwjAMQA2sAImkF+AIcEh+J4G7ILgCAgmWrNiXjN160qS1O7QrRsqTrImDn0MixgMAcBi9UOWZmcEAP6EPX69XuVljyH8bGGPBWAsWQ0OVM5SMNWCxicafJ1MDDVW2xkCGYfvIJsP7mqz4BhqtJxd37vNgJNGp/WQSMzy912vTV57RyX1eu7hv+8kE/QJ9jMdjt1qt3Pv99rFer91kMonqOKqExOPx6CRoX2hQJXRiG5vNJhQpquR6vXKZzO12C0UX/UvmeQ7DofqGgPeH0WjEWe217/c7r2QejwevSiJ5v9/zSuZwOPCqwt+BXvN0OvENY87ns5tOp76WI0qKgu12y0rJbreTxPjBQtDhFQ66AZU10Z/2A5LckSR3JMkIzm7AEcxZCQ59wCnDWYyfDGnoN0lD/6t+211IckeS3JEvktPQj0lDPw39zvxXeT6fw2Kx4PQzqJ48uFwu7vl8uuVyGf16QsJ9qqN68nxVvUFIXfwFwiRsECKJtAZpk/ZCtBpsKncNUcRSlhpI1MRKpmhrIIgUUSI2UESKxkZRGKKIFOKmb6CL4H4AHSb5hp1szWYAAAAASUVORK5CYII=";
const img_logo = new Image();
img_logo.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAA8nYBAOgDAADydgEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAArIfcnPEIHlAAAA7BJREFUWEetl88vXFEUxw+mfnUrmUbY1LKqYjGNLoakKqFWoiv+AguxUguV1nRTsRA2Iul0IiKSopKKiCgTtdAJiYUREVEUUyIqhCK4vefOuTP3vXdnvEn6Sb6c873n3vfmzbs/BjhMp5+bm2x+fl7blogWFhbY2tqato1kNVtaWsR/l8vFrq+vLe12heAYGMsxNbKaGxsbLMXhEPHExIQYyFwjVVRUpPWR73NzIs7MzGTr6+uWGpLVlKj50dGRoQbV0NDAbm9v2aP8fIP/9+JC9JG5RK1RZDUljY2Nhvzw8DBSc3V1RW6Yz0NDwscaCebNzc2UJXAD+GmRvr4+kR8fH4s8EQ4ODkTfgYEBQ66R1ZyamjLkOBsSZXZ21jDG5OSkIZdK5n8sDA4OQlNTE2UAfDCK7OP3+ykCeNPaCj6fjzIr2jtD5BSSeSLIfm6325BrpDXZ+Pi46PgjEBD517Exkdvhy+io6LO0tCTykZERw9gmaU0hlUTeA3OtbmxFWjMyE/4HcWYAymq+rKpitXW1kUeI/OFTsb6+nmVnZ7Ouri5yo3R2doo2rDk5OSGXiZW0vLycveDSXYtLa7K9vT0agrHe3l6WlZXF0tLTI+3qY57x+yM+1jgfPGCffD5qZWx7ezvSblYSBQZ4H4rCXF5eQlpaGmX2MPe5ubkBh8NBWZQUrrfhMAxf36GiooKyMDMzM8BXNFheXoaMjAxwOp3UYmRxcRGGhoeBP3bgGxDk5uZSC0BycjLs7+8D357JiWJ4JMi36WmxyUj6+/sNNY8LCqglSk5OjqFmmo8hwX0DvyZErSFZDCEznvceVlZWJmJsx6VV0tPTE+nzpLBQ5GbUsU2ymsGVFeqmBxcWFfyEo3zxiQduSrprcVnNuyh+Viw2Gwk+bpxmd6G7lnYzQkKhEHR3d8Pu7i45UfIe5oHX66UMgE9TeOpyURZla2sLPB4PBINBcvRo70wVHjZUPnq97LVy0MBDh/pOIOYXN5ZiPgGVVzU1FIW5z6dYidtNGUBJaSnwWUNZmLq6OoruRntnZlVXV9NnY9oT0vn5OUWMVVRWasfQSbsSxoKPTVF8kpJwWHvY+gokuLzexenpKUX2SOgGAoEARbHhmxRF9kjoBsxnw7OzMyEV9SxoF8NLEU94RkQ6OjosbR/a20VbvulHig1pzZhCUlNT2XO+L0gP43vcQ9Ram9KaMRX6HRIXUn/rra6uCi/ewSOOtGZctdPj/rWzE/kp9q6tTVsbX8D+AVUxcW1yOo0fAAAAAElFTkSuQmCC";
/*
const club_out = new Image();
club_out.src = 
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARBAMAAADJQ1rJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURf///wAAAFXC034AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAAEJJREFUGNNljtERACAIQnED2X/ZIDz7yMvzCVoBTHRIRcd8S6ga45ZkLgG1hHXxaW/Oq+5ar/jWmRtSPo35hFUF+wAVSgYOaINx2QAAAABJRU5ErkJggg==";
const club_cch = new Image();
club_cch.src = 
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARBAMAAADJQ1rJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURf///wAAAFXC034AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAAD1JREFUGNNljlEKADAIQu0Gev/LrnKLQf70MAWRUommPIQwRlM01zcmV+Rie8KmyRHxNYCb4yI8qobnyBIPAr0GHeZiccAAAAAASUVORK5CYII=";
const club_rad = new Image();
club_rad.src = 
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARBAMAAADJQ1rJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAP///6XZn90AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAAEJJREFUGNNdjQEKADAIAvUH+v/PztUWbAZxSRZooeVUxjSBRYL3SHHo7B4aj0NO+vfwZF0fKbPJud8k4npJ7FBTBCxGngP+2sEgPgAAAABJRU5ErkJggg==";
const img_al = new Image();
img_al.src = 
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARBAMAAADJQ1rJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAP///6XZn90AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAAEJJREFUGNNdjQEKADAIAvUH+v/PztUWbAZxSRZooeVUxjSBRYL3SHHo7B4aj0NO+vfwZF0fKbPJud8k4npJ7FBTBCxGngP+2sEgPgAAAABJRU5ErkJggg==";
const img_aa = new Image();
img_aa.src = 
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARBAMAAADJQ1rJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAP///6XZn90AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAAEJJREFUGNNdjQEKADAIAvUH+v/PztUWbAZxSRZooeVUxjSBRYL3SHHo7B4aj0NO+vfwZF0fKbPJud8k4npJ7FBTBCxGngP+2sEgPgAAAABJRU5ErkJggg==";
const img_dd = new Image();
img_dd.src = 
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARBAMAAADJQ1rJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAP///6XZn90AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAAEJJREFUGNNdjQEKADAIAvUH+v/PztUWbAZxSRZooeVUxjSBRYL3SHHo7B4aj0NO+vfwZF0fKbPJud8k4npJ7FBTBCxGngP+2sEgPgAAAABJRU5ErkJggg==";
*/

// Time initialization
const start = new Date(CON_START);
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var now = new Date();

// Takes a date object and turns it into a string containing "--m" or "--h--m"
function datefuzzy(date) {
  let mins = (date.getTime() - now.getTime()) / MINUTES;
  let timestring;

  if (mins >= 60) {
    let hours = Math.floor(mins / 60);
    mins = Math.floor(mins % 60);
    timestring = hours + "h" + mins + "m";
  } else {
    timestring = Math.floor(mins) + "m";
  }

  return timestring;
}

// Renders the full resolution UI to a single canvas
function renderUI(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Show that we acted on globals
  compact_mode_cur = compact_mode;
  dimmed_mode_cur = dimmed_mode;

  // Draw schedule times
  if (compact_mode > 0) {
    ctx.fillStyle = dimmed_mode ? THEME_DARK_PRIMARY : THEME_BRIGHT_PRIMARY;
    ctx.textAlign = "right";
    ctx.font = "15px sans-serif";
    if (events.length >= 1) ctx.fillText(`${datefuzzy(events[0].at)}`, 60, 22);
    if (events.length >= 2) ctx.fillText(`${datefuzzy(events[1].at)}`, 60, 47);
    if (events.length >= 3) ctx.fillText(`${datefuzzy(events[2].at)}`, 60, 72);
  }

  // Draw titles
  ctx.fillStyle = dimmed_mode ? THEME_DARK_SECONDARY : THEME_BRIGHT_SECONDARY;
  ctx.textAlign = "left";
  ctx.font = "15px sans-serif";
  if (compact_mode > 0) {
    if (events.length >= 1)
      ctx.fillText(`${events[0].loc} ${events[0].name}`, 75, 22);
    if (events.length >= 2)
      ctx.fillText(`${events[1].loc} ${events[1].name}`, 75, 47);
    if (events.length >= 3)
      ctx.fillText(`${events[2].loc} ${events[2].name}`, 75, 72);
  } else {
    if (events.length >= 1)
      ctx.fillText(
        `${datefuzzy(events[0].at)} ${events[0].loc} ${events[0].name}`,
        0,
        15,
      );
  }
  if (events.length === 0) ctx.fillText("No more favorites today!", 0, 15);

  // Draw rooms
  ctx.fillStyle = dimmed_mode ? THEME_DARK_PRIMARY : THEME_BRIGHT_PRIMARY;
  ctx.textAlign = "left";
  ctx.font = "15px sans-serif";
  if (compact_mode > 0) {
    if (events.length >= 1) ctx.fillText(`${events[0].loc}`, 75, 22);
    if (events.length >= 2) ctx.fillText(`${events[1].loc}`, 75, 47);
    if (events.length >= 3) ctx.fillText(`${events[2].loc}`, 75, 72);
  } else {
    if (events.length >= 1)
      ctx.fillText(`${datefuzzy(events[0].at)} ${events[0].loc}`, 0, 15);
  }

  // Gracefully handle long titles
  const gradient = ctx.createLinearGradient(
    UI_WIDTH - 150,
    0,
    UI_WIDTH - 90,
    0,
  );
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, "black");
  ctx.fillStyle = gradient;
  ctx.fillRect(UI_WIDTH - 150, 0, 150, 90);

  // Draw clock
  ctx.fillStyle = dimmed_mode ? THEME_DARK_PRIMARY : THEME_BRIGHT_PRIMARY;
  ctx.textAlign = "right";
  ctx.font = "15px sans-serif";
  ctx.fillText(`${getClock()}`, width, 15);
  if (compact_mode > 0) {
    ctx.fillStyle = dimmed_mode ? THEME_DARK_SECONDARY : THEME_BRIGHT_PRIMARY;
    ctx.fillText(`${getDay()}`, width, 30);

    // Draw event schedule graphic
    if (events.length >= 3) ctx.drawImage(img_arrow3, 60, 0);
    if (events.length === 2) ctx.drawImage(img_arrow2, 60, 0);
    if (events.length === 1) ctx.drawImage(img_arrow1, 60, 0);

    // Draw EF logo
    ctx.drawImage(img_logo, width - 32, 35);

    // Dim image areas to half luminance
    ctx.fillStyle = dimmed_mode
      ? `rgba(0,0,0,${THEME_DARK_IMAGES})`
      : `rgba(0,0,0,${THEME_BRIGHT_IMAGES})`;
    if (events.length > 0) ctx.fillRect(60, 0, 15, 90); // arrows
    ctx.fillRect(width - 32, 35, 32, 32); // ef logo
  }

  // Additional event info wip
  /*  if (compact_mode === 2) {
	// Icons
	ctx.drawImage(club_out, 5, 178);
	ctx.drawImage(club_rad, 5, 200);
	ctx.drawImage(img_al, 5, 222);
	ctx.drawImage(img_aa, 5, 244);
	ctx.drawImage(img_dd, 5, 266);
	
	// Text
	ctx.fillStyle = dimmed_mode?'#888':'#fff'
	ctx.textAlign = 'left'
    ctx.font = "15px sans-serif";
	ctx.fillText('status outside stage here', 27, 192);
	ctx.fillText('status coda club here', 27, 214);
	ctx.fillText('status artist lounge here', 27, 236);
	ctx.fillText('status artist alley here', 27, 258);
	ctx.fillText('status dealers den here', 27, 280);
  }*/

  return canvas;
}

// Divide main canvas into quadrants
function split(where, fullCanvas) {
  const canvas = document.createElement("canvas");
  canvas.width = UI_WIDTH / 2;
  if (where.startsWith("t")) {
    canvas.height = UI_HEIGHT;
  } else {
    //canvas.height = UI_HEIGHT_BOT
  }

  const ctx = canvas.getContext("2d")!;

  if (where === "tl") ctx.drawImage(fullCanvas, 0, 0);
  if (where === "tr") ctx.drawImage(fullCanvas, -(UI_WIDTH / 2), 0);
  /*  if(where === 'bl') ctx.drawImage(fullCanvas,0, -UI_HEIGHT_BOT);
  if(where === 'br') ctx.drawImage(fullCanvas, - ( UI_WIDTH/2 ), -UI_HEIGHT_BOT);*/

  return canvas;
}

// Turn canvas into frame data for the G2
async function canvasToPng(canvas, target) {
  const dataUrl = await canvas.toDataURL("image/png");
  const binary = await atob(dataUrl.split(",")[1]);
  const bytes: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    bytes.push(binary.charCodeAt(i));
  }
  if (target === "tl") tlarr = bytes;
  if (target === "tr") trarr = bytes;
  if (target === "bl") blarr = bytes;
  if (target === "br") brarr = bytes;
}

// Clock string helper
function getClock() {
  return `${dayNames[now.getDay()]} ${(now.getHours() < 10 ? "0" : "") + now.getHours()}:${(now.getMinutes() < 10 ? "0" : "") + now.getMinutes()}`;
}

// Con day string helper
function getDay() {
  return `Day ${now.getDate() - start.getDate() >= 0 ? now.getDate() - start.getDate() + 1 : now.getDate() - start.getDate()}`;
}

// Main render manager: update time -> throw out old events (replenish queue if needed) -> render -> split -> send
async function render() {
  const render_start = new Date();
  if (MOCK_TIME != "") {
    now = new Date(MOCK_TIME);
  } else {
    now = new Date();
  }

  try {
    if (events[0].at.getTime() - now.getTime() < -900000) {
      events.shift();
      replenishQueue();
    }
  } catch (e) {} // just try, don't stress

  const fullrender = await renderUI(576, 90);
  const frame_tl = split("tl", fullrender);
  const frame_tr = split("tr", fullrender);
  /*  const frame_bl = split('bl', fullrender);
  const frame_br = split('br', fullrender);*/

  await Promise.all([
    canvasToPng(frame_tl, "tl"),
    canvasToPng(frame_tr, "tr"),
    /*  canvasToPng(frame_bl,'bl'),
  canvasToPng(frame_br,'br'),*/
  ]);

  await Promise.all([
    bridge.updateImageRawData(
      new ImageRawDataUpdate({
        containerID: 2,
        containerName: "tleft",
        imageData: tlarr,
      }),
    ),
    bridge.updateImageRawData(
      new ImageRawDataUpdate({
        containerID: 3,
        containerName: "tright",
        imageData: trarr,
      }),
    ),
    /*    bridge.updateImageRawData(new ImageRawDataUpdate({
      containerID: 4,
      containerName: 'bleft',
      imageData: blarr,
    })),
    bridge.updateImageRawData(new ImageRawDataUpdate({
      containerID: 5,
      containerName: 'bright',
      imageData: brarr,
    })),*/
  ]);

  const render_end = new Date();
  document.getElementById("results_last_render").innerText =
    `Last render (every minute): ${(now.getHours() < 10 ? "0" : "") + now.getHours()}:${(now.getMinutes() < 10 ? "0" : "") + now.getMinutes()}:${(now.getSeconds() < 10 ? "0" : "") + now.getSeconds()} (${render_end.getTime() - render_start.getTime()} ms)`;
}

// Handles filling the displayed events queue recursively from the raw event data
function replenishQueue() {
  if (events.length < 3) {
    let day_end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      4,
    );
    let next_up = new Date("2069-04-20T00:00:00.000+00:00");
    let next_index;

    for (var i = 0; i < all_events.length; i++) {
      if (all_events[i].at.getTime() - next_up.getTime() < 0) {
        // Is this the soonest event seen so far in the loop?
        if (
          !all_events[i].queued &&
          all_events[i].at.getTime() - now.getTime() > -900000
        ) {
          // Has it not been queued before and isn't already over? (15 min start grace)
          if (all_events[i].at.getTime() < day_end.getTime()) {
            // Is it "today" (con days go until 2AM technically, to fix clubs rolling)
            next_index = i;
            next_up = all_events[i].at;
          }
        }
      }
    }

    if (next_index != undefined) {
      events.push(all_events[next_index]);
      all_events[next_index].queued = true;
      replenishQueue();
    }
  }
}

// Takes the split up raw events array and turns them into the objects needed for the queue
async function parseEvents() {
  split_raw_events.forEach((event) => {
    let at = event.match(/^DTSTART:.*$/gm);
    let loc = event.match(/^LOCATION:.*$/gm);
    let name = event.match(/^SUMMARY:.*$/gm);

    if (at === null) return;
    if (loc === null) loc = [""];
    if (name === null) name = [""];

    // Get:  20260822T090000Z
    // Need: 2026-08-19T04:33:42.000+00:00

    let time = at[0].replace(
      /DTSTART:([0-9]{4})([0-9]{2})([0-9]{2})T([0-9]{2})([0-9]{2})([0-9]{2})Z/,
      "$1-$2-$3T$4:$5:$6.000+00:00",
    );

    all_events.push({
      at: new Date(time),
      loc: loc[0]
        .replace("LOCATION:", "")
        .replace("CCH ", "")
        .replace("Radisson ", "")
        .split(" – ")[0],
      name: name[0].replace("SUMMARY:", "").replaceAll("\\", ""),
      queued: false,
    });
  });
  document.getElementById("results_last_sync").innerText =
    `Last sync (every 30 mins): ${(now.getHours() < 10 ? "0" : "") + now.getHours()}:${(now.getMinutes() < 10 ? "0" : "") + now.getMinutes()}:${(now.getSeconds() < 10 ? "0" : "") + now.getSeconds()} (${all_events.length} Events)`;

  replenishQueue();
  render();
}

// Fetches the calendar from Euforuence backend and splits+filters them into a preliminary unformatted array
async function updateInfo() {
  const res = await fetch(await bridge.getLocalStorage("CALENDAR_URL"));
  const text = await res.text();
  if (text.includes("BEGIN:VCALENDAR")) {
    let temp = text.split("BEGIN:VEVENT");
    temp.forEach((event) => {
      split_raw_events.push(
        event
          .split("\n")
          .filter(
            (line) =>
              line.startsWith("DTSTART") ||
              line.startsWith("SUMMARY") ||
              line.startsWith("LOCATION"),
          )
          .join("\n"),
      );
    });
    parseEvents();
  }
}

// Define initial UI
const text = new TextContainerProperty({
  xPosition: 0,
  yPosition: UI_HEIGHT,
  width: UI_WIDTH,
  //height: 288 - UI_HEIGHT - UI_HEIGHT_BOT,
  height: 288 - UI_HEIGHT,
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
  width: UI_WIDTH / 2,
  height: UI_HEIGHT,
  containerID: 2,
  containerName: "tleft",
});
const tright = new ImageContainerProperty({
  xPosition: UI_WIDTH / 2,
  yPosition: 0,
  width: UI_WIDTH / 2,
  height: UI_HEIGHT,
  containerID: 3,
  containerName: "tright",
});
/*const bleft = new ImageContainerProperty({
  xPosition: 0,
  yPosition: 288-UI_HEIGHT_BOT,
  width: UI_WIDTH/2,
  height: UI_HEIGHT_BOT,
  containerID: 4,
  containerName: 'bleft',
})
const bright = new ImageContainerProperty({
  xPosition: UI_WIDTH/2,
  yPosition: 288-UI_HEIGHT_BOT,
  width: UI_WIDTH/2,
  height: UI_HEIGHT_BOT,
  containerID: 5,
  containerName: 'bright',
})*/

// Send initial UI
const result = await bridge.createStartUpPageContainer(
  new CreateStartUpPageContainer({
    containerTotalNum: 1,
    textObject: [text],
    //imageObject: [tleft, tright, bleft, bright],
    imageObject: [tleft, tright],
  }),
);

// Init input listener
const unsubscribe = bridge.onEvenHubEvent((event) => {
  const sysType = event.sysEvent?.eventType ?? null;
  const textType = event.textEvent?.eventType ?? null;

  // Tap to undim the UI for 3 minutes
  if (event.jsonData.eventType === undefined) {
    if (dimmed_mode) {
      dimmed_mode = false;
      setTimeout(() => {
        dimmed_mode = true;
      }, 180000);
    } else {
      dimmed_mode = true;
    }
    if (dimmed_mode != dimmed_mode_cur) {
      render();
    }
    return;
  }

  // Swipe up to decrease detail level
  if (event.jsonData.eventType === 1) {
    if (compact_mode > 0) compact_mode--;
    if (compact_mode != compact_mode_cur) {
      render();
    }
    return;
  }

  // Swipe down to increase detail level
  if (event.jsonData.eventType === 2) {
    //if (compact_mode < 2) compact_mode++;
    if (compact_mode < 1) compact_mode++;
    if (compact_mode != compact_mode_cur) {
      render();
    }
    return;
  }

  // Double click to summon exit modal
  if (event.jsonData.eventType === 3) {
    bridge.shutDownPageContainer(1);
    return;
  }

  if (
    sysType === OsEventTypeList.SYSTEM_EXIT_EVENT ||
    sysType === OsEventTypeList.ABNORMAL_EXIT_EVENT
  ) {
    unsubscribe();
  }
});

// Register listener for "sync & save" button
document.getElementById("sync").addEventListener("click", function (event) {
  bridge.setLocalStorage(
    "CALENDAR_URL",
    document.querySelector<HTMLInputElement>("#url").value,
  );
  updateInfo();
});

// Remember previously input link and auto-initialize with it
async function setFromBridge() {
  document.querySelector<HTMLInputElement>("#url").value =
    await bridge.getLocalStorage("CALENDAR_URL");
  if (document.querySelector<HTMLInputElement>("#url").value != "")
    updateInfo();
}

render();
setFromBridge();
setInterval(render, INTERVAL_RENDER);
setInterval(updateInfo, INTERVAL_SYNC);
