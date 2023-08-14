import Oss from "ali-oss";
import {
  TtOssOptions,
  TtOssOptionsWithFetch, 
  TtOssOptionsWithApi,
} from "./typings";
import { AliOssInstance, OssApiInfo } from "./typings";
import { multipartUpload } from "./src/multipart-upload";
import { simpleUpload } from "./src/simple-upload";
import { thumb } from "./src/thumb";
import { name2Url } from "./src/name-2-url";
import { isNeedSignOssUrl, isOssUrl } from "./src/is-oss-url";
import { getRelativePathFromUrl } from "./src/get-relative-path-from-url";
import { getOssImageMIME } from "./src/is-support-webp";

export class TtOss {
  // 单例
  private static globalTtOssInstance: TtOss | undefined;
  // TtOss的配置
  TtOssOptions!: TtOssOptions;
  // ali-oss实例
  aliOssClient!: AliOssInstance;
  // 控制promise缓存,手动控制是因为ali-oss没有做promise缓存，多次同时请求时会请求多次接口
  private currentOssClientPromise?: Promise<AliOssInstance>;
  // 控制缓存的标识
  private isUpdatingOssClient = false;
  /**
   * @description: 安装方法
   * @param {options} 配置项
   * @return {TtOss} 单例
   */
  static install(options: TtOssOptions) {
    return new TtOss(options);
  }
  /**
   * @description: 重新安装方法,目前主要用于业务侧更新sts信息
   * @return {TtOss} 新的单例
   */
  static reinstall() {
    const TtOssOptions = this.getGlobalInstance().TtOssOptions;
    this.globalTtOssInstance = undefined;
    return new TtOss(TtOssOptions);
  }
  /**
   * @description: 获取单例
   * @return {TtOss} 单例
   */
  static getGlobalInstance() {
    if (!this.globalTtOssInstance) {
      throw new Error("请先初始化TtOss");
    }
    return this.globalTtOssInstance;
  }
  /**
   * @description: 业务上传
   * @param {File} file
   * @param {object} options
   * @return {Promise<OssUploadResponse>}
   */
  static upload(...args: Parameters<TtOss["upload"]>) {
    return this.getGlobalInstance().upload(...args);
  }
  /**
   * @description: 获取ali-oss实例
   * @return {Promise<AliOssInstance>}
   */
  static getOssClient() {
    return this.getGlobalInstance().getOssClient();
  }
  /**
   * @description: 对src或者oss的name进行签名，并增加缩放、格式等参数并签名
   * @param {string} src url或者oss的name
   * @param {object} options 配置项
   * @return {Promise<string>} 签名后的src
   */
  static thumb(...args: Parameters<typeof thumb>) {
    return thumb(...args);
  }
  /**
   * @description: oss返回的文件name转换成url
   * @param {string} src oss的name
   * @return {Promise<string>} 签名后的src
   */
  static name2Url(...args: Parameters<typeof name2Url>) {
    return name2Url(...args);
  }
  // 是否是oss的url
  /**
   * @description: oss返回的文件name转换成url
   * @param {string} src oss的name
   * @return {Promise<string>} 签名后的src
   */
  static isOssUrl(...args: Parameters<typeof isOssUrl>) {
    return isOssUrl(...args);
  }
  /**
   * @description: 是否是需要签名的url
   * @param {string} url
   * @return {boolean}
   */
  static isNeedSignOssUrl(...args: Parameters<typeof isNeedSignOssUrl>) {
    return isNeedSignOssUrl(...args);
  }
  /**
   * @description: 截取oss的url，只保留name
   * @param {string} url
   * @return {string}
   */
  static getRelativePathFromUrl(
    ...args: Parameters<typeof getRelativePathFromUrl>
  ) {
    return getRelativePathFromUrl(...args);
  }
  // 获取oss的imageMIME，支持webp格式就返回webp
  static getOssImageMIME(...args: Parameters<typeof getOssImageMIME>) {
    return getOssImageMIME(...args);
  }
  constructor(options: TtOssOptions) {
    if (TtOss.globalTtOssInstance) return TtOss.globalTtOssInstance;
    this.TtOssOptions = options;
    TtOss.globalTtOssInstance = this;
  }
  /**
   * @description: 业务上传（实例方法）
   * @param {File} file
   * @param {object} options
   * @return {Promise<OssUploadResponse>}
   */
  upload(
    file: File,
    options?: (
      | Parameters<typeof simpleUpload>[1]
      | Parameters<typeof multipartUpload>[1]
    ) & { chunk?: boolean }
  ) {
    if (!options) return multipartUpload(file);
    else if ("chunked" in options) {
      if (options.chunked) return multipartUpload(file, options);
      else return simpleUpload(file, options);
    } else return multipartUpload(file, options);
  }
  /**
   * @description: 获取ali-oss实例（实例方法）
   * @return {Promise<AliOssInstance>}
   */
  getOssClient() {
    const getCurrentOssClientPromise = async () => {
      if (!this.currentOssClientPromise) {
        this.initOssClient();
        // 原本逻辑是30秒冗余时间，但是发现接口的expiration不是每次请求刷新，所以改为以下逻辑
      } else if (this.aliOssClient?.options?.expiration! < Date.now()) {
        this.updateOssClient();
      }
      return this.currentOssClientPromise!;
    };
    return getCurrentOssClientPromise();
  }

  // 设置ali-oss实例
  private async setAliOssClient() {
    const ossClientOptions = await this.TtOssOptions2AliOssOptions();
    this.aliOssClient = new Oss(ossClientOptions);
    this.isUpdatingOssClient = false;
    return this.aliOssClient;
  }
  // 第一次初始化
  private initOssClient() {
    if (this.isUpdatingOssClient) return;
    this.isUpdatingOssClient = true;
    this.currentOssClientPromise = this.setAliOssClient();
  }
  // 后续过期判断
  private updateOssClient() {
    if (this.isUpdatingOssClient) return;
    this.isUpdatingOssClient = true;
    this.currentOssClientPromise = this.setAliOssClient();
  }
  // TtOss配置项=>ali-oss配置项
  async TtOssOptions2AliOssOptions() {
    if (this.isTtOssOptionsWithFetch(this.TtOssOptions)) {
      const ossApiInfo = await this.TtOssOptions.fetchOssInfo();
      const ossClientOptions = this.ossApiInfo2OssClientOptions(ossApiInfo);
      return ossClientOptions;
    } else if (this.isTtOssOptionsWithApi(this.TtOssOptions)) {
      const ossClientOptions = this.ossApiInfo2OssClientOptions(
        this.TtOssOptions
      );
      return ossClientOptions;
    } else {
      return this.TtOssOptions;
    }
  }
  // 接口oss信息=>前端需要的信息
  ossApiInfo2OssClientOptions(ossApiInfo: OssApiInfo) {
    const {
      accessKeyId,
      accessKeySecret,
      regionId,
      bucketName,
      securityToken,
      expiration,
    } = ossApiInfo;
    return {
      expiration, // 接口返回，ali-oss不需要
      accessKeyId,
      accessKeySecret,
      region: `oss-${regionId}`,
      bucket: bucketName,
      stsToken: securityToken,
    };
  }
  private isTtOssOptionsWithFetch(
    options: TtOssOptions
  ): options is TtOssOptionsWithFetch {
    return !!(options as TtOssOptionsWithFetch).fetchOssInfo;
  }

  private isTtOssOptionsWithApi(
    options: TtOssOptions
  ): options is TtOssOptionsWithApi {
    return !!(options as TtOssOptionsWithApi).securityToken;
  }
}
