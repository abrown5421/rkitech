export function generateUUIDv4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  bytes[6] = (bytes[6] & 0x0f) | 0x40; 
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const toHex = (b: number) => b.toString(16).padStart(2, '0');

  return [
    toHex(bytes[0]), toHex(bytes[1]), toHex(bytes[2]), toHex(bytes[3]), '-',
    toHex(bytes[4]), toHex(bytes[5]), '-',
    toHex(bytes[6]), toHex(bytes[7]), '-',
    toHex(bytes[8]), toHex(bytes[9]), '-',
    toHex(bytes[10]), toHex(bytes[11]), toHex(bytes[12]), toHex(bytes[13]), toHex(bytes[14]), toHex(bytes[15])
  ].join('');
}
