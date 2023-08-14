import { TtOssOptions } from "./typings";
import { AliOssInstance, OssApiInfo } from "./typings";
import { multipartUpload } from "./src/multipart-upload";
import { simpleUpload } from "./src/simple-upload";
import { thumb } from "./src/thumb";
import { name2Url } from "./src/name-2-url";
import { isNeedSignOssUrl, isOssUrl } from "./src/is-oss-url";
import { getRelativePathFromUrl } from "./src/get-relative-path-from-url";
import { getOssImageMIME } from "./src/is-support-webp";
export declare class TtOss {
    private static globalTtOssInstance;
    TtOssOptions: TtOssOptions;
    aliOssClient: AliOssInstance;
    private currentOssClientPromise?;
    private isUpdatingOssClient;
    /**
     * @description: 安装方法
     * @param {options} 配置项
     * @return {TtOss} 单例
     */
    static install(options: TtOssOptions): TtOss;
    /**
     * @description: 重新安装方法,目前主要用于业务侧更新sts信息
     * @return {TtOss} 新的单例
     */
    static reinstall(): TtOss;
    /**
     * @description: 获取单例
     * @return {TtOss} 单例
     */
    static getGlobalInstance(): TtOss;
    /**
     * @description: 业务上传
     * @param {File} file
     * @param {object} options
     * @return {Promise<OssUploadResponse>}
     */
    static upload(...args: Parameters<TtOss["upload"]>): (PromiseLike<{
        name: string;
        url: string;
    }> & {
        abort: () => void;
    }) | Promise<{
        fileName: string; /**
         * @description: 安装方法
         * @param {options} 配置项
         * @return {TtOss} 单例
         */
        name: string;
        url: string;
    }>;
    /**
     * @description: 获取ali-oss实例
     * @return {Promise<AliOssInstance>}
     */
    static getOssClient(): Promise<AliOssInstance>;
    /**
     * @description: 对src或者oss的name进行签名，并增加缩放、格式等参数并签名
     * @param {string} src url或者oss的name
     * @param {object} options 配置项
     * @return {Promise<string>} 签名后的src
     */
    static thumb(...args: Parameters<typeof thumb>): Promise<any>;
    /**
     * @description: oss返回的文件name转换成url
     * @param {string} src oss的name
     * @return {Promise<string>} 签名后的src
     */
    static name2Url(...args: Parameters<typeof name2Url>): Promise<any>;
    /**
     * @description: oss返回的文件name转换成url
     * @param {string} src oss的name
     * @return {Promise<string>} 签名后的src
     */
    static isOssUrl(...args: Parameters<typeof isOssUrl>): boolean;
    /**
     * @description: 是否是需要签名的url
     * @param {string} url
     * @return {boolean}
     */
    static isNeedSignOssUrl(...args: Parameters<typeof isNeedSignOssUrl>): boolean;
    /**
     * @description: 截取oss的url，只保留name
     * @param {string} url
     * @return {string}
     */
    static getRelativePathFromUrl(...args: Parameters<typeof getRelativePathFromUrl>): string;
    static getOssImageMIME(...args: Parameters<typeof getOssImageMIME>): string;
    constructor(options: TtOssOptions);
    /**
     * @description: 业务上传（实例方法）
     * @param {File} file
     * @param {object} options
     * @return {Promise<OssUploadResponse>}
     */
    upload(file: File, options?: (Parameters<typeof simpleUpload>[1] | Parameters<typeof multipartUpload>[1]) & {
        chunk?: boolean;
    }): (PromiseLike<{
        name: string;
        url: string;
    }> & {
        abort: () => void;
    }) | Promise<{
        fileName: string; /**
         * @description: 安装方法
         * @param {options} 配置项
         * @return {TtOss} 单例
         */
        name: string;
        url: string;
    }>;
    /**
     * @description: 获取ali-oss实例（实例方法）
     * @return {Promise<AliOssInstance>}
     */
    getOssClient(): Promise<AliOssInstance>;
    private setAliOssClient;
    private initOssClient;
    private updateOssClient;
    TtOssOptions2AliOssOptions(): Promise<any>;
    ossApiInfo2OssClientOptions(ossApiInfo: OssApiInfo): {
        expiration: number;
        accessKeyId: string;
        accessKeySecret: string;
        region: string;
        bucket: string;
        stsToken: string;
    };
    private isTtOssOptionsWithFetch;
    private isTtOssOptionsWithApi;
}
