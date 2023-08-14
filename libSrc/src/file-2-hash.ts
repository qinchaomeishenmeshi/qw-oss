// 返回一个文件唯一名字
import md5 from 'md5'
import getExt from './get-ext'
import { OssDirEnum } from '../enum'
import { defaultMultipartUploadParams } from './multipart-upload'

/**
 * 将blob转换为array buffer
 */
export async function blob2Ab(file: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('load file error'))
    reader.readAsArrayBuffer(file)
  })
}

export async function file2Hash(file: Blob, chunkLength = defaultMultipartUploadParams.chunkSize) {
  const chunkSize = Math.ceil(file.size / chunkLength)
  const file2Md5 = async (start: number, end: number) => {
    const slicedBlob = file.slice(start, end)
    const slicedArrayBuffer = await blob2Ab(slicedBlob)
    const slicedUnit8Array = new Uint8Array(slicedArrayBuffer)
    return md5(slicedUnit8Array)
  }
  const names = [chunkSize, await file2Md5(0, chunkLength)]
  if (chunkSize >= 3) {
    const endIndex = Math.ceil(chunkSize / 2)
    names.push(await file2Md5((endIndex - 1) * chunkLength, endIndex * chunkLength))
  }
  if (chunkSize >= 2) {
    names.push(await file2Md5((chunkSize - 1) * chunkLength, chunkSize * chunkLength))
  }
  return md5(names.join('-'))
}

export async function file2OssName(
  file: File,
  options: Partial<{
    dir: OssDirEnum;
    chunkLength: number;
  }> = {}
) {
  const { dir = OssDirEnum.DEFAULT, chunkLength = defaultMultipartUploadParams.chunkSize } = options
  const hashFileName = await file2Hash(file, chunkLength)
  const ext = getExt(file).toLowerCase()
  const name = `${dir}${hashFileName}${ext ? `.${ext}` : ''}`.replace(/^\//, '')
  return name
}
