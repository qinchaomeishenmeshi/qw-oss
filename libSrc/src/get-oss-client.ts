import { TtOss } from "../class";

export function getOssClient() {
  return TtOss.getGlobalInstance().getOssClient();
}
