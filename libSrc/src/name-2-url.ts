import { getOssClient } from "./get-oss-client";

/**
 *
 * @param name 是OssUploadResponse.name，详情见simple-upload.ts的类型
 * @returns 完整url
 */
export async function name2Url(name: string, download = false) {
  const list = name.split("/");
  return await (
    await getOssClient()
  ).signatureUrl(
    name,
    download
      ? {
          response: {
            "content-disposition": `attachment; filename=${encodeURIComponent(
              list[list.length - 1] || "no-titled"
            )}`,
          },
        }
      : undefined
  );
}

export default name2Url;
