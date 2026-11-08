
export async function verifySignature(body, signature, secret) {
  if (!signature || !secret) return false;

  const hex = signature.replace(/^sha256=/i, "");

  if (!/^[0-9a-f]{64}$/i.test(hex)) return false;

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signed = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(body))
  );

  const received = Uint8Array.from(
    hex.match(/.{2}/g),
    pair => parseInt(pair, 16)
  );

  let difference = 0;

  for (let i = 0; i < signed.length; i++) {
    difference |= signed[i] ^ received[i];
  }

  return difference === 0;
}
