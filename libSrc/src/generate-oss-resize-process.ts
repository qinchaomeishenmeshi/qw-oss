import { OssProcess, ThumbOptions, OssProcessParamsMap } from "../typings";

const mode2m = {
  fit: "lfit",
  mfit: "mfit",
  // 'scale-down': 'lfit',
  contain: "pad",
  cover: "fill",
  fill: "fixed",
};

const rImageMima = /^image\/(.*)$/;

export function generateOssResizeProcess(options: ThumbOptions): OssProcess {
  if (options.maxRatio && options.maxRatio !== 1) {
    throw new Error("maxRatio only suport 1");
  }
  if (options.style) {
    return {
      style: options.style,
    };
  }
  type ImageProcess = { resize?: OssProcessParamsMap; format?: string };
  const process = { image: {} as ImageProcess };
  let resize: undefined | OssProcessParamsMap;
  if (options.width) {
    resize = {
      ...resize,
      w: options.width,
    };
  }
  if (options.height) {
    resize = {
      ...resize,
      h: options.height,
    };
  }
  if (options.length) {
    resize = {
      ...resize,
      l: options.length,
    };
  }

  if (options.maxRatio && options.maxRatio !== 1) {
    console.warn("maxRatio only support 1");
    options.maxRatio = 1;
  }

  if (!options.maxRatio && resize) {
    resize = {
      ...resize,
      limit: 0,
    };
  }

  if (options.mode && options.mode !== "fit") {
    if (mode2m[options.mode]) {
      resize = {
        ...resize,
        m: mode2m[options.mode],
      };
    } else {
      throw new Error(`do not support mode ${options.mode}`);
    }
  }
  if (options.backgroundColor) {
    resize = {
      ...resize,
      color: options.backgroundColor.replace(/^#/, ""),
    };
  }
  if (resize) {
    process.image.resize = resize;
  }

  if (options.outType) {
    const m = options.outType.match(rImageMima);
    if (m && m[1]) {
      [, process.image.format] = m;
    }
  }
  return process;
}
export default generateOssResizeProcess;
