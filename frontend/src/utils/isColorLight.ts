export function isColorLight(color: string) {
  if (color.startsWith("#")) {
    let c = color.substring(1);
    if (c.length === 3) {
      c = c.split("").map(ch => ch + ch).join("");
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186;
  }

  if (color.startsWith("rgb")) {
    const values = color.match(/\d+/g);
    if (!values) return false;
    const [r, g, b] = values.map(Number);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186;
  }

  return false;
}
