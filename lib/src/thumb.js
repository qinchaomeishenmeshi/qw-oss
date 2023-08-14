"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.thumb = void 0;
var _lodashEs = require("lodash-es");
var R = _interopRequireWildcard(require("ramda"));
var _process = require("./process");
var _getRelativePathFromUrl = require("./get-relative-path-from-url");
var _getOssClient = require("./get-oss-client");
var _isOssUrl = _interopRequireWildcard(require("./is-oss-url"));
var _generateOssResizeProcess = _interopRequireDefault(require("./generate-oss-resize-process"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// 对width/height属性做dpr处理
const calcWithDpr = R.mapObjIndexed((_, key, obj) => {
  const val = obj[key];
  const dpr = window.devicePixelRatio ?? 1;
  return ['width', 'height'].includes(key) && (0, _lodashEs.isNumber)(val) ? parseInt(`${val * dpr}`, 10) : val;
});

// 将thumbOptions上的fit转成mode
const addMode = thumbOptions => {
  const {
    width,
    height,
    fit
  } = thumbOptions;
  const fit2Mode = fit => {
    switch (true) {
      case fit === 'scale-down':
        return 'fit';
      case width && !height || height && !width:
        // 只有宽度或者只有高度，只能使用mfit
        return 'mfit';
      default:
        return fit || 'contain';
    }
  };
  const options = {
    ...thumbOptions,
    mode: fit2Mode(fit)
  };
  return options;
};
const signedUrlWithProcess = async (src, process) => {
  const stringifyProcess = (0, _process.stringify)(process);
  const relativePath = (0, _getRelativePathFromUrl.getRelativePathFromUrl)(src);
  const ossClient = await (0, _getOssClient.getOssClient)();
  const res = await ossClient.signatureUrl(relativePath, {
    process: stringifyProcess,
    response: {
      'content-disposition': 'inline'
    }
  });
  return res;
};
const getSignedButNotThumbSrc = async src => {
  const ossClient = await (0, _getOssClient.getOssClient)();
  const res = await ossClient.signatureUrl(src, {
    response: {
      'content-disposition': 'inline'
    }
  });
  return res;
};

// 相对路径默认会进行签名
const needThumb = (src, autoSign = true) => (0, _isOssUrl.default)(src) || (0, _isOssUrl.isDataPipeUrl)(src) || autoSign && !(0, _isOssUrl.isHttpUrl)(src) && !(0, _isOssUrl.isBlobUrl)(src) && !(0, _isOssUrl.isBase64Url)(src);

// 签名但不增加thumb参数
const signedButNotThumb = src => (0, _isOssUrl.isSvgUrl)((0, _getRelativePathFromUrl.getRelativePathFromUrl)(src));
const thumb = async (src, options) => {
  const getOriginSrc = async () => src;
  const thumbOptions2SignedUrl = R.curry(signedUrlWithProcess)(src);
  const getSignedSrc = R.pipe(calcWithDpr, addMode, _generateOssResizeProcess.default, thumbOptions2SignedUrl);
  const getResultUrl = R.cond([[() => signedButNotThumb(src), () => getSignedButNotThumbSrc(src)], [() => needThumb(src, options.autoSign), () => getSignedSrc(options)], [R.T, getOriginSrc]]);
  const resultUrl = await getResultUrl();
  return resultUrl;
};
exports.thumb = thumb;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjYWxjV2l0aERwciIsIlIiLCJtYXBPYmpJbmRleGVkIiwiXyIsImtleSIsIm9iaiIsInZhbCIsImRwciIsIndpbmRvdyIsImRldmljZVBpeGVsUmF0aW8iLCJpbmNsdWRlcyIsImlzTnVtYmVyIiwicGFyc2VJbnQiLCJhZGRNb2RlIiwidGh1bWJPcHRpb25zIiwid2lkdGgiLCJoZWlnaHQiLCJmaXQiLCJmaXQyTW9kZSIsIm9wdGlvbnMiLCJtb2RlIiwic2lnbmVkVXJsV2l0aFByb2Nlc3MiLCJzcmMiLCJwcm9jZXNzIiwic3RyaW5naWZ5UHJvY2VzcyIsInN0cmluZ2lmeSIsInJlbGF0aXZlUGF0aCIsImdldFJlbGF0aXZlUGF0aEZyb21VcmwiLCJvc3NDbGllbnQiLCJnZXRPc3NDbGllbnQiLCJyZXMiLCJzaWduYXR1cmVVcmwiLCJyZXNwb25zZSIsImdldFNpZ25lZEJ1dE5vdFRodW1iU3JjIiwibmVlZFRodW1iIiwiYXV0b1NpZ24iLCJpc09zc1VybCIsImlzRGF0YVBpcGVVcmwiLCJpc0h0dHBVcmwiLCJpc0Jsb2JVcmwiLCJpc0Jhc2U2NFVybCIsInNpZ25lZEJ1dE5vdFRodW1iIiwiaXNTdmdVcmwiLCJ0aHVtYiIsImdldE9yaWdpblNyYyIsInRodW1iT3B0aW9uczJTaWduZWRVcmwiLCJjdXJyeSIsImdldFNpZ25lZFNyYyIsInBpcGUiLCJnZW5lcmF0ZU9zc1Jlc2l6ZVByb2Nlc3MiLCJnZXRSZXN1bHRVcmwiLCJjb25kIiwiVCIsInJlc3VsdFVybCJdLCJzb3VyY2VzIjpbIi4uLy4uL2xpYlNyYy9zcmMvdGh1bWIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNGdW5jdGlvbiwgaXNOdW1iZXIgfSBmcm9tICdsb2Rhc2gtZXMnXG5pbXBvcnQgKiBhcyBSIGZyb20gJ3JhbWRhJ1xuaW1wb3J0IHsgR2V0VmFsdWVzLCBPc3NQcm9jZXNzLCBUaHVtYk9wdGlvbnMgfSBmcm9tICcuLi90eXBpbmdzJ1xuaW1wb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSAnLi9wcm9jZXNzJ1xuaW1wb3J0IHsgZ2V0UmVsYXRpdmVQYXRoRnJvbVVybCB9IGZyb20gJy4vZ2V0LXJlbGF0aXZlLXBhdGgtZnJvbS11cmwnXG5pbXBvcnQgeyBnZXRPc3NDbGllbnQgfSBmcm9tICcuL2dldC1vc3MtY2xpZW50J1xuaW1wb3J0IGlzT3NzVXJsLCB7IGlzQmFzZTY0VXJsLCBpc0Jsb2JVcmwsIGlzRGF0YVBpcGVVcmwsIGlzSHR0cFVybCwgaXNTdmdVcmwgfSBmcm9tICcuL2lzLW9zcy11cmwnXG5pbXBvcnQgZ2VuZXJhdGVPc3NSZXNpemVQcm9jZXNzIGZyb20gJy4vZ2VuZXJhdGUtb3NzLXJlc2l6ZS1wcm9jZXNzJ1xuXG50eXBlIE9iamVjdEZpdFR5cGUgPSBzdHJpbmdcbnR5cGUgVGh1bWJPcHRpb25zV2l0aEZpdCA9IFRodW1iT3B0aW9ucyAmIHsgZml0OiBzdHJpbmcgfVxuXG4vLyDlr7l3aWR0aC9oZWlnaHTlsZ7mgKflgZpkcHLlpITnkIZcbmNvbnN0IGNhbGNXaXRoRHByID0gUi5tYXBPYmpJbmRleGVkKChfLCBrZXksIG9iaikgPT4ge1xuICBjb25zdCB2YWwgPSBvYmohW2tleV1cbiAgY29uc3QgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gPz8gMVxuICByZXR1cm4gWyd3aWR0aCcsICdoZWlnaHQnXS5pbmNsdWRlcyhrZXkpICYmIGlzTnVtYmVyKHZhbCkgPyBwYXJzZUludChgJHt2YWwgKiBkcHJ9YCwgMTApIDogdmFsXG59KSBhcyAodGh1bWJPcHRpb25zOiBUaHVtYk9wdGlvbnMpID0+IFRodW1iT3B0aW9uc1dpdGhGaXRcblxuLy8g5bCGdGh1bWJPcHRpb25z5LiK55qEZml06L2s5oiQbW9kZVxuY29uc3QgYWRkTW9kZSA9ICh0aHVtYk9wdGlvbnM6IFRodW1iT3B0aW9uc1dpdGhGaXQpID0+IHtcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBmaXQgfSA9IHRodW1iT3B0aW9uc1xuICBjb25zdCBmaXQyTW9kZSA9IChmaXQ6IE9iamVjdEZpdFR5cGUpOiBUaHVtYk9wdGlvbnNbJ21vZGUnXSA9PiB7XG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICBjYXNlIGZpdCA9PT0gJ3NjYWxlLWRvd24nOlxuICAgICAgICByZXR1cm4gJ2ZpdCdcbiAgICAgIGNhc2UgKHdpZHRoICYmICFoZWlnaHQpIHx8IChoZWlnaHQgJiYgIXdpZHRoKTpcbiAgICAgICAgLy8g5Y+q5pyJ5a695bqm5oiW6ICF5Y+q5pyJ6auY5bqm77yM5Y+q6IO95L2/55SobWZpdFxuICAgICAgICByZXR1cm4gJ21maXQnXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gKGZpdCB8fCAnY29udGFpbicpIGFzIFRodW1iT3B0aW9uc1snbW9kZSddXG4gICAgfVxuICB9XG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgLi4udGh1bWJPcHRpb25zLFxuICAgIG1vZGU6IGZpdDJNb2RlKGZpdCksXG4gIH1cbiAgcmV0dXJuIG9wdGlvbnNcbn1cblxuY29uc3Qgc2lnbmVkVXJsV2l0aFByb2Nlc3MgPSBhc3luYyAoc3JjOiBzdHJpbmcsIHByb2Nlc3M6IE9zc1Byb2Nlc3MpID0+IHtcbiAgY29uc3Qgc3RyaW5naWZ5UHJvY2VzcyA9IHN0cmluZ2lmeShwcm9jZXNzKVxuICBjb25zdCByZWxhdGl2ZVBhdGggPSBnZXRSZWxhdGl2ZVBhdGhGcm9tVXJsKHNyYylcbiAgY29uc3Qgb3NzQ2xpZW50ID0gYXdhaXQgZ2V0T3NzQ2xpZW50KClcbiAgY29uc3QgcmVzOiBzdHJpbmcgPSBhd2FpdCBvc3NDbGllbnQuc2lnbmF0dXJlVXJsKHJlbGF0aXZlUGF0aCwge1xuICAgIHByb2Nlc3M6IHN0cmluZ2lmeVByb2Nlc3MsXG4gICAgcmVzcG9uc2U6IHtcbiAgICAgICdjb250ZW50LWRpc3Bvc2l0aW9uJzogJ2lubGluZScsXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHJlc1xufVxuXG5jb25zdCBnZXRTaWduZWRCdXROb3RUaHVtYlNyYyA9IGFzeW5jIChzcmM6IHN0cmluZykgPT4ge1xuICBjb25zdCBvc3NDbGllbnQgPSBhd2FpdCBnZXRPc3NDbGllbnQoKVxuICBjb25zdCByZXM6IHN0cmluZyA9IGF3YWl0IG9zc0NsaWVudC5zaWduYXR1cmVVcmwoc3JjLCB7XG4gICAgcmVzcG9uc2U6IHtcbiAgICAgICdjb250ZW50LWRpc3Bvc2l0aW9uJzogJ2lubGluZScsXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHJlc1xufVxuXG4vLyDnm7jlr7not6/lvoTpu5jorqTkvJrov5vooYznrb7lkI1cbmNvbnN0IG5lZWRUaHVtYiA9IChzcmM6IHN0cmluZywgYXV0b1NpZ24gPSB0cnVlKSA9PlxuICBpc09zc1VybChzcmMpIHx8IGlzRGF0YVBpcGVVcmwoc3JjKSB8fCAoYXV0b1NpZ24gJiYgIWlzSHR0cFVybChzcmMpICYmICFpc0Jsb2JVcmwoc3JjKSAmJiAhaXNCYXNlNjRVcmwoc3JjKSlcblxuLy8g562+5ZCN5L2G5LiN5aKe5YqgdGh1bWLlj4LmlbBcbmNvbnN0IHNpZ25lZEJ1dE5vdFRodW1iID0gKHNyYzogc3RyaW5nKSA9PiBpc1N2Z1VybChnZXRSZWxhdGl2ZVBhdGhGcm9tVXJsKHNyYykpXG5cbmV4cG9ydCBjb25zdCB0aHVtYiA9IGFzeW5jIChzcmM6IHN0cmluZywgb3B0aW9uczogVGh1bWJPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGdldE9yaWdpblNyYyA9IGFzeW5jICgpID0+IHNyY1xuICBjb25zdCB0aHVtYk9wdGlvbnMyU2lnbmVkVXJsID0gUi5jdXJyeShzaWduZWRVcmxXaXRoUHJvY2Vzcykoc3JjKVxuICBjb25zdCBnZXRTaWduZWRTcmMgPSBSLnBpcGUoY2FsY1dpdGhEcHIsIGFkZE1vZGUsIGdlbmVyYXRlT3NzUmVzaXplUHJvY2VzcywgdGh1bWJPcHRpb25zMlNpZ25lZFVybClcbiAgY29uc3QgZ2V0UmVzdWx0VXJsID0gUi5jb25kKFtcbiAgICBbKCkgPT4gc2lnbmVkQnV0Tm90VGh1bWIoc3JjKSwgKCkgPT4gZ2V0U2lnbmVkQnV0Tm90VGh1bWJTcmMoc3JjKV0sXG4gICAgWygpID0+IG5lZWRUaHVtYihzcmMsIG9wdGlvbnMuYXV0b1NpZ24pLCAoKSA9PiBnZXRTaWduZWRTcmMob3B0aW9ucyldLFxuICAgIFtSLlQsIGdldE9yaWdpblNyY10sXG4gIF0pXG4gIGNvbnN0IHJlc3VsdFVybCA9IGF3YWl0IGdldFJlc3VsdFVybCgpXG4gIHJldHVybiByZXN1bHRVcmxcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBb0U7QUFBQTtBQUFBO0FBS3BFO0FBQ0EsTUFBTUEsV0FBVyxHQUFHQyxDQUFDLENBQUNDLGFBQWEsQ0FBQyxDQUFDQyxDQUFDLEVBQUVDLEdBQUcsRUFBRUMsR0FBRyxLQUFLO0VBQ25ELE1BQU1DLEdBQUcsR0FBR0QsR0FBRyxDQUFFRCxHQUFHLENBQUM7RUFDckIsTUFBTUcsR0FBRyxHQUFHQyxNQUFNLENBQUNDLGdCQUFnQixJQUFJLENBQUM7RUFDeEMsT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQ0MsUUFBUSxDQUFDTixHQUFHLENBQUMsSUFBSSxJQUFBTyxrQkFBUSxFQUFDTCxHQUFHLENBQUMsR0FBR00sUUFBUSxDQUFFLEdBQUVOLEdBQUcsR0FBR0MsR0FBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUdELEdBQUc7QUFDaEcsQ0FBQyxDQUF3RDs7QUFFekQ7QUFDQSxNQUFNTyxPQUFPLEdBQUlDLFlBQWlDLElBQUs7RUFDckQsTUFBTTtJQUFFQyxLQUFLO0lBQUVDLE1BQU07SUFBRUM7RUFBSSxDQUFDLEdBQUdILFlBQVk7RUFDM0MsTUFBTUksUUFBUSxHQUFJRCxHQUFrQixJQUEyQjtJQUM3RCxRQUFRLElBQUk7TUFDVixLQUFLQSxHQUFHLEtBQUssWUFBWTtRQUN2QixPQUFPLEtBQUs7TUFDZCxLQUFNRixLQUFLLElBQUksQ0FBQ0MsTUFBTSxJQUFNQSxNQUFNLElBQUksQ0FBQ0QsS0FBTTtRQUMzQztRQUNBLE9BQU8sTUFBTTtNQUNmO1FBQ0UsT0FB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