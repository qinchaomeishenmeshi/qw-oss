import { isDataPipeUrl } from './is-oss-url';

export function getRelativePathFromUrl(url = ''): string {
  if (isDataPipeUrl(url)) {
    const matchUrl = url.match(/^(http(s)?:)?\/\/([^?]*)/)?.[3] ?? '';
    return matchUrl.split('/').slice(1).join('/') || '';
  }
  if (/\.aliyuncs\.com\/(.+?)(\?|$)/.test(url)) {
    return url.match(/\.aliyuncs\.com\/(.+?)(\?|$)/)?.[1] || '';
  }
  return url;
}
