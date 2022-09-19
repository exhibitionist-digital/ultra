import { crayon } from "https://deno.land/x/crayon@3.3.2/mod.ts";
import { Color } from "https://deno.land/x/color/mod.ts";

export function gradient(string: string, size = 6) {
  const chars: string[] = string.split("");
  for (const [index, char] of chars.entries()) {
    const rgb = Color.hsl(305 - (size * index), 100, 70).toType("rgb")
    const eightbit = rgbToAnsi8(rgb.channels[0], rgb.channels[1], rgb.channels[2]);
    chars[index] = crayon.ansi8(eightbit)(char);
  }
  return chars.join("");
}

export function c(option: number, string?: string) {
  const chars = `(${option})`;
  const rgb = Color.hsl(285 - (20 * option), 100, 70).toType("rgb")
  const eightbit = rgbToAnsi8(rgb.channels[0], rgb.channels[1], rgb.channels[2]);
  return crayon.ansi8(eightbit)(string ?? chars);
}

function rgbToAnsi8(r: number, g: number, b: number): number {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  return r >> 4 === g >> 4 && g >> 4 === b >> 4
    ? r < 8 ? 16 : r > 248 ? 231 : Math.round(((r - 8) / 247) * 24) + 232
    : 16 +
      36 * Math.round((r / 255) * 5) +
      6 * Math.round((g / 255) * 5) +
      Math.round((b / 255) * 5);
}