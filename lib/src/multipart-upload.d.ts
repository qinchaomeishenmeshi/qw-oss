import { OssDirEnum } from '../enum';
type OssUploadResponse = {
    name: string;
    url: string;
};
type MultipartUploadParams = Partial<typeof defaultMultipartUploadParams>;
export declare const defaultMultipartUploadParams: {
    dir: OssDirEnum;
    chunkSize: number;
    onProgress: (progress: number, loaded: number, total: number) => void;
};
export declare function multipartUpload(file: File, options?: MultipartUploadParams): PromiseLike<OssUploadResponse> & {
    abort: () => void;
};
export default multipartUpload;
