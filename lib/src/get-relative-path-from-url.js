"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRelativePathFromUrl = getRelativePathFromUrl;
var _isOssUrl = require("./is-oss-url");
function getRelativePathFromUrl(url = '') {
  if ((0, _isOssUrl.isDataPipeUrl)(url)) {
    const matchUrl = url.match(/^(http(s)?:)?\/\/([^?]*)/)?.[3] ?? '';
    return matchUrl.split('/').slice(1).join('/') || '';
  }
  if (/\.aliyuncs\.com\/(.+?)(\?|$)/.test(url)) {
    return url.match(/\.aliyuncs\.com\/(.+?)(\?|$)/)?.[1] || '';
  }
  return url;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRSZWxhdGl2ZVBhdGhGcm9tVXJsIiwidXJsIiwiaXNEYXRhUGlwZVVybCIsIm1hdGNoVXJsIiwibWF0Y2giLCJzcGxpdCIsInNsaWNlIiwiam9pbiIsInRlc3QiXSwic291cmNlcyI6WyIuLi8uLi9saWJTcmMvc3JjL2dldC1yZWxhdGl2ZS1wYXRoLWZyb20tdXJsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzRGF0YVBpcGVVcmwgfSBmcm9tICcuL2lzLW9zcy11cmwnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQYXRoRnJvbVVybCh1cmwgPSAnJyk6IHN0cmluZyB7XG4gIGlmIChpc0RhdGFQaXBlVXJsKHVybCkpIHtcbiAgICBjb25zdCBtYXRjaFVybCA9IHVybC5tYXRjaCgvXihodHRwKHMpPzopP1xcL1xcLyhbXj9dKikvKT8uWzNdID8/ICcnO1xuICAgIHJldHVybiBtYXRjaFVybC5zcGxpdCgnLycpLnNsaWNlKDEpLmpvaW4oJy8nKSB8fCAnJztcbiAgfVxuICBpZiAoL1xcLmFsaXl1bmNzXFwuY29tXFwvKC4rPykoXFw/fCQpLy50ZXN0KHVybCkpIHtcbiAgICByZXR1cm4gdXJsLm1hdGNoKC9cXC5hbGl5dW5jc1xcLmNvbVxcLyguKz8pKFxcP3wkKS8pPy5bMV0gfHwgJyc7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFTyxTQUFTQSxzQkFBc0IsQ0FBQ0MsR0FBRyxHQUFHLEVBQUUsRUFBVTtFQUN2RCxJQUFJLElBQUFDLHVCQUFhLEVBQUNELEdBQUcsQ0FBQyxFQUFFO0lBQ3RCLE1BQU1FLFFBQVEsR0FBR0YsR0FBRyxDQUFDRyxLQUFLLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFO0lBQ2pFLE9BQU9ELFFBQVEsQ0FBQ0UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO0VBQ3JEO0VBQ0EsSUFBSSw4QkFBOEIsQ0FBQ0MsSUFBSSxDQUFDUCxHQUFHLENBQUMsRUFBRTtJQUM1QyxPQUFPQSxHQUFHLENBQUNHLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUU7RUFDN0Q7RUFDQSxPQUFPSCxHQUFHO0FBQ1oifQ==