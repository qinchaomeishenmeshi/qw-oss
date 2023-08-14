import type OSS from "ali-oss";
export type GetValues<T> = T extends {
    [P in keyof T]: infer V;
} ? V : never;
export type Mode = "fit" | "mfit" | "contain" | "cover";
export type ThumbOptions = {
    fit?: string;
    autoSign?: boolean;
    mode?: Mode;
    maxRatio?: number;
    width?: number;
    height?: number;
    length?: number;
    outType?: string;
    default?: string;
    backgroundColor?: string;
    style?: string;
};
export type OssValue = string | number | undefined;
export type OssProcessParamsMap = {
    [pramsKey: string]: OssValue;
};
export type OssProcessCommandsMap = {
    [command: string]: OssProcessParamsMap | OssValue;
};
export type OssProcess = {
    [module: string]: OssProcessCommandsMap | OssValue;
};
export type OssParsedResult = {
    url: string;
    process: OssProcess;
};
export interface TtOssOptionsWithFetch extends Omit<OSS.Options, "accessKeyId" | "accessKeySecret"> {
    fetchOssInfo: () => Promise<OssApiInfo>;
}
export interface TtOssOptionsWithApi extends OSS.Options, OssApiInfo {
}
export type TtOssOptions = TtOssOptionsWithFetch | TtOssOptionsWithApi | OSS.Options;
export type OssApiInfo = {
    expiration: number;
    regionId: string;
    bucketName: string;
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
};
export interface AliOssInstance extends OSS {
    options?: OSS.Options & OssApiInfo;
}
