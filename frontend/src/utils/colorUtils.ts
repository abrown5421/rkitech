export function lightenHex(hex: string, percent: number) {
    hex = hex.replace(/^#/, '');
    const num = parseInt(hex, 16);
    let r = (num >> 16) & 0xFF;
    let g = (num >> 8) & 0xFF;
    let b = num & 0xFF;
    r = Math.min(255, Math.floor(r + (255 - r) * percent));
    g = Math.min(255, Math.floor(g + (255 - g) * percent));
    b = Math.min(255, Math.floor(b + (255 - b) * percent));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function darkenHex(hex: string, percent: number) {
    hex = hex.replace(/^#/, '');
    const num = parseInt(hex, 16);
    let r = (num >> 16) & 0xFF;
    let g = (num >> 8) & 0xFF;
    let b = num & 0xFF;

    r = Math.max(0, Math.floor(r * (1 - percent)));
    g = Math.max(0, Math.floor(g * (1 - percent)));
    b = Math.max(0, Math.floor(b * (1 - percent)));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

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
