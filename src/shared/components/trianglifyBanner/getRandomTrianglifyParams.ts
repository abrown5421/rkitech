export function getRandomTrianglifyParams() {
  function getRandomHexColor() {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16);
    return '#' + hex.padStart(6, '0').toUpperCase();
  }
  function getRandomColorArray() {
    return [getRandomHexColor(), getRandomHexColor()];
  }
  const variance = +(Math.random() * (1 - 0.01) + 0.01).toFixed(2);
  const cellSize = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
  const xColor = getRandomColorArray();
  const yColor = getRandomColorArray();
  return { xColor, yColor, variance, cellSize };
}