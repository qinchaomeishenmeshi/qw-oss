import { OssDirEnum } from "../enum";
export type OssUploadResponse = {
    name: string;
    url: string;
};
type SimpleUploadParams = Partial<typeof defaultMultipartUploadParams>;
declare const defaultMultipartUploadParams: {
    dir: OssDirEnum;
};
export declare function simpleUpload(file: File, options?: SimpleUploadParams): Promise<{
    fileName: string;
    name: string;
    url: string;
}>;
export default simpleUpload;
