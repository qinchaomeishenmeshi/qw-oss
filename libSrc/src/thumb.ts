import { isFunction, isNumber } from 'lodash-es'
import * as R from 'ramda'
import { GetValues, OssProcess, ThumbOptions } from '../typings'
import { stringify } from './process'
import { getRelativePathFromUrl } from './get-relative-path-from-url'
import { getOssClient } from './get-oss-client'
import isOssUrl, { isBase64Url, isBlobUrl, isDataPipeUrl, isHttpUrl, isSvgUrl } from './is-oss-url'
import generateOssResizeProcess from './generate-oss-resize-process'

type ObjectFitType = string
type ThumbOptionsWithFit = ThumbOptions & { fit: string }

// 对width/height属性做dpr处理
const calcWithDpr = R.mapObjIndexed((_, key, obj) => {
  const val = obj![key]
  const dpr = window.devicePixelRatio ?? 1
  return ['width', 'height'].includes(key) && isNumber(val) ? parseInt(`${val * dpr}`, 10) : val
}) as (thumbOptions: ThumbOptions) => ThumbOptionsWithFit

// 将thumbOptions上的fit转成mode
const addMode = (thumbOptions: ThumbOptionsWithFit) => {
  const { width, height, fit } = thumbOptions
  const fit2Mode = (fit: ObjectFitType): ThumbOptions['mode'] => {
    switch (true) {
      case fit === 'scale-down':
        return 'fit'
      case (width && !height) || (height && !width):
        // 只有宽度或者只有高度，只能使用mfit
        return 'mfit'
      default:
        return (fit || 'contain') as ThumbOptions['mode']
    }
  }
  const options = {
    ...thumbOptions,
    mode: fit2Mode(fit),
  }
  return options
}

const signedUrlWithProcess = async (src: string, process: OssProcess) => {
  const stringifyProcess = stringify(process)
  const relativePath = getRelativePathFromUrl(src)
  const ossClient = await getOssClient()
  const res: string = await ossClient.signatureUrl(relativePath, {
    process: stringifyProcess,
    response: {
      'content-disposition': 'inline',
    },
  })
  return res
}

const getSignedButNotThumbSrc = async (src: string) => {
  const ossClient = await getOssClient()
  const res: string = await ossClient.signatureUrl(src, {
    response: {
      'content-disposition': 'inline',
    },
  })
  return res
}

// 相对路径默认会进行签名
const needThumb = (src: string, autoSign = true) =>
  isOssUrl(src) || isDataPipeUrl(src) || (autoSign && !isHttpUrl(src) && !isBlobUrl(src) && !isBase64Url(src))

// 签名但不增加thumb参数
const signedButNotThumb = (src: string) => isSvgUrl(getRelativePathFromUrl(src))

export const thumb = async (src: string, options: ThumbOptions) => {
  const getOriginSrc = async () => src
  const thumbOptions2SignedUrl = R.curry(signedUrlWithProcess)(src)
  const getSignedSrc = R.pipe(calcWithDpr, addMode, generateOssResizeProcess, thumbOptions2SignedUrl)
  const getResultUrl = R.cond([
    [() => signedButNotThumb(src), () => getSignedButNotThumbSrc(src)],
    [() => needThumb(src, options.autoSign), () => getSignedSrc(options)],
    [R.T, getOriginSrc],
  ])
  const resultUrl = await getResultUrl()
  return resultUrl
}
