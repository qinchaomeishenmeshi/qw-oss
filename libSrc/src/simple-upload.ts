import { OssDirEnum } from "../enum";
import { file2OssName } from "./file-2-hash";
import { getOssClient } from "./get-oss-client";

export type OssUploadResponse = {
  name: string;
  url: string;
};

type SimpleUploadParams = Partial<typeof defaultMultipartUploadParams>;
const defaultMultipartUploadParams = {
  dir: OssDirEnum.DEFAULT,
};

export async function simpleUpload(
  file: File,
  options: SimpleUploadParams = defaultMultipartUploadParams
) {
  const { dir } = {
    ...defaultMultipartUploadParams,
    ...options,
  };
  const client = await getOssClient();
  const ossKey = await file2OssName(file, {
    dir,
  });
  // console.log(client)
  // console.log(Object.keys(client))
  const res: OssUploadResponse = await client.put(`${ossKey}`, file, {
    headers: {
      // 指定该Object被下载时的内容编码格式。
      "Content-Encoding": "UTF-8",
    },
  });
  const result = {
    ...res,
    fileName:file.name
  }
  console.log(result);
  // console.log(client.signatureUrl(res.name))
  return result;
}

export default simpleUpload;
