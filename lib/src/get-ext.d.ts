/**
 * 将mimeType转成后缀名
 * @param mime mimeType
 */
export declare const mimeToExt: (mime: string) => string;
/**
 * 获取目标的文件名
 * @param target
 */
export declare function getFileName(target: File | string): string;
/**
 * 获取目标的后缀名
 * @param target
 */
export declare function getExt(target: string | File): string;
export default getExt;
