import { OssDirEnum } from '../enum';
/**
 * 将blob转换为array buffer
 */
export declare function blob2Ab(file: Blob): Promise<ArrayBuffer>;
export declare function file2Hash(file: Blob, chunkLength?: number): Promise<any>;
export declare function file2OssName(file: File, options?: Partial<{
    dir: OssDirEnum;
    chunkLength: number;
}>): Promise<string>;
