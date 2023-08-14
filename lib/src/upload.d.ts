import { TtOss } from "../class";
export declare function getUsableUrlFromOssUrl(ossUrl: string): Promise<any>;
export declare function upload(...args: Parameters<TtOss["upload"]>): (PromiseLike<{
    name: string;
    url: string;
}> & {
    abort: () => void;
}) | Promise<{
    fileName: string;
    name: string;
    url: string;
}>;
export default upload;
