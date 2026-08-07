import { globals } from "./globals.ts";
import { constants } from "./constants.ts";

// Takes a date object and turns it into a string containing "--m" or "--h--m"
export function datefuzzy(date: Date): string {
  let mins = (date.getTime() - globals.now.getTime()) / constants.MINUTES;
  let timestring: string;

  if (mins >= 60) {
    let hours = Math.floor(mins / 60);
    mins = Math.floor(mins % 60);
    timestring = hours + "h" + mins + "m";
  } else {
    timestring = Math.floor(mins) + "m";
  }

  return timestring;
}

// Clock string helper
export function getClock(): string {
  return `${constants.DAYNAMES[globals.now.getDay()]} ${(globals.now.getHours() < 10 ? "0" : "") + globals.now.getHours()}:${(globals.now.getMinutes() < 10 ? "0" : "") + globals.now.getMinutes()}`;
}

// Con day string helper
export function getDay(): string {
  return `Day ${globals.now.getDate() - constants.START.getDate() >= 0 ? globals.now.getDate() - constants.START.getDate() + 1 : globals.now.getDate() - constants.START.getDate()}`;
}

// Image object from src URL
export function imageFromURL(src: string): HTMLImageElement {
  const image = new Image();
  image.src = src;
  return image;
}

// Turn canvas into frame data for the G2
export async function canvasToPng(
  canvas: HTMLCanvasElement,
): Promise<number[]> {
  const dataUrl = await canvas.toDataURL("image/png");
  const binary = await atob(dataUrl.split(",")[1]);
  const bytes: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    bytes.push(binary.charCodeAt(i));
  }
  return bytes;
}
