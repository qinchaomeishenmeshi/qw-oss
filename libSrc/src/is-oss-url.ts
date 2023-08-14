export function isOssUrl(url: string) {
  return url.split('/')[2]?.endsWith('aliyuncs.com')
}

export function isNeedSignOssUrl(input: string) {
  return isOssUrl(input) && !input.includes('frontend') && !input.includes('sdtc-public-picture')
}

export const isDataPipeUrl = (url: string) => {
  const rDataPipe = /(&|\?)ch=2($|&)/
  return rDataPipe.test(url)
}

export const isHttpUrl = (url: string) => {
  const rHttp = /^http(s)?/
  return rHttp.test(url)
}

export const isBlobUrl = (url: string) => {
  const rBlob = /^blob/
  return rBlob.test(url)
}

export const isBase64Url = (url: string) => {
  const rBase64 = /^data:.*base64/
  return rBase64.test(url)
}

export const isSvgUrl = (url: string) => {
  const rSvg = /.svg$/
  return rSvg.test(url)
}

export default isOssUrl