import { gradient } from "./styling.ts";

export async function ask<T = string>(question = ":", answers?: T[]) {
  await Deno.stdout.write(new TextEncoder().encode(question + " "));
  const buf = new Uint8Array(1024);
  const n = <number> await Deno.stdin.read(buf);
  const answer = new TextDecoder().decode(buf.subarray(0, n));
  if (answers) {
    return answers[parseInt(answer.trim())] || answers[0];
  }
  return answer.trim();
}

export async function confirm(question = "Are you sure?") {
  let a: string;
  while (
    !/^(y|n)$/i.test(a = (await ask(question + gradient(" [y/n]", 12))).trim())
    // deno-lint-ignore no-empty
  ) {
  }
  return a.toLowerCase() === "y";
}
