import { OssDirEnum } from '../enum'
import { file2OssName } from './file-2-hash'
import { getOssClient } from './get-oss-client'

type OssUploadResponse = {
  name: string
  url: string
}

async function getUploadId(file: File, { client, name }: { client: any; name?: string }) {
  const res = await client.initMultipartUpload(`${name || file.name}`, {
    headers: {
      'Content-Type': file.type ?? 'application/octet-stream',
    },
  })
  console.log(res)
  return res.uploadId as number
}

type MultipartUploadParams = Partial<typeof defaultMultipartUploadParams>

export const defaultMultipartUploadParams = {
  dir: OssDirEnum.DEFAULT,
  chunkSize: 1024 * 1024,
  onProgress: (progress: number, loaded: number, total: number) => {},
}

/**
 * 分片上传。支持onProgress（进度查询）、断点续传、中断。
 * @param file
 * @param options
 * @returns
 * @example //不使用中断时的语法
 * await multipartUpload(file[, options])
 * @example //使用中断时的语法
 * const controller = multipartUpload(file[, options])
 * //异步触发abort函数
 * setTimeout(() => controller.abort(), 3000)
 * await controller
 */
const uploadLocalStorage = {
  get(key: string) {
    const name = localStorage.getItem(`uploadName:${key}`) as string
    const uploadId = +(localStorage.getItem(`uploadId:${key}`) || '')
    return {
      name,
      uploadId,
    }
  },
  set(key: string, uploadId: string) {
    localStorage.setItem(`uploadId:${key}`, `${uploadId}`)
    localStorage.setItem(`uploadName:${key}`, key)
  },
  remove(key: string) {
    localStorage.removeItem(`uploadId:${key}`)
    localStorage.removeItem(`uploadName:${key}`)
  },
}
export function multipartUpload(file: File, options: MultipartUploadParams = defaultMultipartUploadParams) {
  let abortController: AbortController | undefined
  const _upload = async () => {
    try {
      abortController = new AbortController()
    } catch (error) {
      abortController = undefined
    }

    const { dir, chunkSize, onProgress } = {
      ...defaultMultipartUploadParams,
      ...options,
    }

    const name = await file2OssName(file, {
      dir,
      chunkLength: chunkSize,
    })

    const detectAbort = () => {
      if (abortController && abortController.signal?.aborted) {
        uploadLocalStorage.remove(name)
        throw new Error('检测到中断触发')
      }
    }
    detectAbort()

    const client = await getOssClient()
    const uploadId = await getUploadId(file, {
      client,
      name,
    })
    uploadLocalStorage.set(name, `${uploadId}`)
    if (!uploadId) throw new Error('获取uploadId失败')
    const chunkLength = Math.ceil(file.size / chunkSize)
    const doneList = []
    const parts = await client.listParts(name, uploadId.toString())
    const startIdx = +parts.nextPartNumberMarker || 0
    if (startIdx > 0 && startIdx < chunkLength) {
      parts.parts.forEach((part: { PartNumber: number; ETag: string }) =>
        doneList.push({ number: +part.PartNumber, etag: part.ETag })
      )
    }
    for (let i = startIdx; i < chunkLength; i++) {
      const start = chunkSize * i
      const end = Math.min(start + chunkSize, file.size)
      const part = await client.uploadPart(name, uploadId.toString(), i + 1, file, start, end)
      console.log(`chunk size: ${end - start}`)
      console.log(`Upload part${i + 1} finished`)
      doneList.push({ number: i + 1, etag: part.etag })
      onProgress(+((100 * end) / file.size).toFixed(2), end, file.size)
      detectAbort()
    }
    // console.log(doneList)
    const uploadResult = await client.completeMultipartUpload(name, uploadId.toString(), doneList)
    console.log(uploadResult)
    uploadLocalStorage.remove(name)
    return uploadResult
  }
  return {
    then(...args: any[]) {
      return _upload().then(...args)
    },
    abort() {
      if (abortController === undefined) {
        throw new Error('上传还未开始')
      } else if (!('AbortController' in globalThis)) {
        console.warn('当前浏览器缺乏AbortController支持')
      } else abortController.abort()
    },
  } as PromiseLike<OssUploadResponse> & { abort: () => void }
}

export default multipartUpload

// const a = multipartUpload(new File()));
// a.abort()
// const res = await a
