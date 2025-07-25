export function getRandomTrianglifyParams(): {
  xColor: [string, string];
  yColor: [string, string];
  variance: number;
  cellSize: number;
} {
  const colors = [
    '#FE9A00',
    '#e58b00',
    '#cb7b00',
    '#b26c00',
    '#ffa419',
    '#ffae32',
    '#ffb84c',
    '#101828',
    '#000000',
    '#010204',
    '#090d16',
    '#17233a',
    '#1f2e4c',
    '#26395f',
    '#F9FAFB',
    '#eaedf1',
    '#dae1e7',
    '#cbd4dc',
  ];

  function getRandomColorTuple(): [string, string] {
    const getRandom = () => colors[Math.floor(Math.random() * colors.length)];
    return [getRandom(), getRandom()];
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
