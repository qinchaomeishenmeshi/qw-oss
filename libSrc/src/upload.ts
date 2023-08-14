import { TtOss } from "../class";
import { getOssNameFromUrl } from "./get-oss-name-from-url";
import isOssUrl from "./is-oss-url";
import name2Url from "./name-2-url";

export async function getUsableUrlFromOssUrl(ossUrl: string) {
  if (!isOssUrl(ossUrl)) return false;
  let name = getOssNameFromUrl(ossUrl);
  name = decodeURI(name);
  name = decodeURI(name);
  const signedUrl = await name2Url(name);
  return signedUrl;
}

export function upload(...args: Parameters<TtOss["upload"]>) {
  return TtOss.getGlobalInstance().upload(...args);
}

export default upload;
