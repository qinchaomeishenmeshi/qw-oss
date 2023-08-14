export function getOssNameFromUrl(url: string) {
  const splits = url.split('/')
  let i = 3
  let resultString = ''
  while (!splits[i].includes('?')) {
    resultString = resultString + '/' + splits[i++]
  }
  if (splits[i].includes('?')) {
    resultString = resultString + '/' + splits[i].split('?')[0]
  } else {
    throw new Error(`获取oss name失败。url为${url}`)
  }
  console.log(resultString)
  // 把一开头的斜杠去掉
  return resultString.slice(1)
  // if (splits[3].includes('?')) return splits[3].split('?')[0]
  // return splits[3] + '/' + splits[4].split('?')[0]
}