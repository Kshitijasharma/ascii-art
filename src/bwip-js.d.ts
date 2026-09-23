/// <reference types="vite/client" />

declare module 'bwip-js/browser' {
  interface RenderOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    width?: number;
    includetext?: boolean;
    textxalign?: string;
    barcolor?: string;
    backgroundcolor?: string;
    rotate?: string;
    paddingwidth?: number;
    paddingheight?: number;
    monochrome?: boolean;
    [key: string]: any;
  }

  function toCanvas(
    canvas: string | HTMLCanvasElement,
    opts: RenderOptions
  ): HTMLCanvasElement;

  function toSVG(opts: RenderOptions): string;

  const bwipjs: {
    toCanvas: typeof toCanvas;
    toSVG: typeof toSVG;
  };

  export { toCanvas, toSVG };
  export default bwipjs;
}

declare module 'bwip-js' {
  import * as browserBwip from 'bwip-js/browser';
  export = browserBwip;
}
