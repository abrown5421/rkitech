declare module "trianglify" {
  interface TrianglifyOptions {
    width: number;
    height: number;
    cell_size?: number;
    variance?: number;
    seed?: string;
    x_colors?: string[] | string;
    y_colors?: string[] | string;
    color_space?: string;
    color_function?: Function;
    stroke_width?: number;
  }

  interface TrianglifyPattern {
    toCanvas: (canvas?: HTMLCanvasElement) => HTMLCanvasElement;
    toSVG: () => SVGElement;
    toDataURL: () => string;
  }

  export default function trianglify(options: TrianglifyOptions): TrianglifyPattern;
}