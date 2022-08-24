/**
 * Creates a SHA-256 hash of a supplied length of the passed value
 * @param value The string to create a hash of, this is usually the file content.
 * @param length The length of the resulting hash to return
 */
export async function hash(value: string | Uint8Array, length = 8) {
  const msgUint8 = typeof value === "string"
    ? new TextEncoder().encode(value)
    : value;

  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  return hashHex.slice(0, length);
}
