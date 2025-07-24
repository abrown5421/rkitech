export function getRandomTrianglifyParams(): {
  xColor: [string, string];
  yColor: [string, string];
  variance: number;
  cellSize: number;
} {
  function getRandomHexColor(): string {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16);
    return '#' + hex.padStart(6, '0').toUpperCase();
  }

  function getRandomColorTuple(): [string, string] {
    return [getRandomHexColor(), getRandomHexColor()];
  }

  const variance = +(Math.random() * (1 - 0.01) + 0.01).toFixed(2);
  const cellSize = Math.floor(Math.random() * (100 - 20 + 1)) + 20;

  return {
    xColor: getRandomColorTuple(),
    yColor: getRandomColorTuple(),
    variance,
    cellSize,
  };
}
