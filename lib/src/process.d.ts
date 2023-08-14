import { OssProcess } from "../typings";
/**
 * @see https://help.aliyun.com/document_detail/99372.html?spm=a2c4g.11186623.6.737.53f128fbYQN7wk
 * @param processStr process的字符串
 */
export declare function parse(processStr: string): OssProcess;
export declare function parseUrl(url: string): {
    url: any;
    process: OssProcess;
    query: any;
};
export declare function stringify(process: OssProcess): string;
export declare function merge(process: OssProcess, mergeProcess: OssProcess): OssProcess;
export declare function stringifyUrl({ url, process, }: {
    url: string;
    process: OssProcess;
}): any;
