import { QwOss } from '../class'

export function getOssClient() {
  return QwOss.getGlobalInstance().getOssClient()
}
