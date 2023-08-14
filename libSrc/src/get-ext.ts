// TODO: 暂时只是写了图片类型
const rArr = [/^image\/(\w+)$/, /^(?:text|application)\/(json)$/]
const type2ext: { [mime: string]: string } = {}
/**
 * 将mimeType转成后缀名
 * @param mime mimeType
 */
export const mimeToExt = (mime: string) => {
  mime = mime.toLowerCase()
  if (type2ext[mime]) return type2ext[mime]
  for (let i = 0; i < rArr.length; i++) {
    const r = rArr[i]
    const m = mime.match(r)
    if (m) {
      return m[1]
    }
  }
  return ''
}

const rExt = /\.\w+$/
/**
 * 获取目标的文件名
 * @param target
 */
export function getFileName(target: File | string) {
  if (target instanceof File) return target.name
  const queryIndex = target.indexOf('?')
  if (queryIndex !== -1) {
    target = target.substring(0, queryIndex)
  }
  const lastSlashIndex = target.lastIndexOf('/')
  if (lastSlashIndex !== -1) {
    target = target.substr(lastSlashIndex + 1)
  }
  return target
}

/**
 * 获取目标的后缀名
 * @param target
 */
export function getExt(target: string | File) {
  let file: File | undefined
  let name: string | undefined
  if (target instanceof File) {
    file = target;
    ({ name } = target)
  } else {
    name = target
  }

  if (name) {
    target = getFileName(name)
    const extIndex = target.search(rExt)
    if (extIndex !== -1) {
      return target.substring(extIndex + 1)
    }
  }

  if (file) {
    const mime = file.type
    if (mime) {
      return mimeToExt(mime)
    }
  }
  return ''
}

export default getExt
