"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blob2Ab = blob2Ab;
exports.file2Hash = file2Hash;
exports.file2OssName = file2OssName;
var _md = _interopRequireDefault(require("md5"));
var _getExt = _interopRequireDefault(require("./get-ext"));
var _enum = require("../enum");
var _multipartUpload = require("./multipart-upload");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// 返回一个文件唯一名字

/**
 * 将blob转换为array buffer
 */
async function blob2Ab(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('load file error'));
    reader.readAsArrayBuffer(file);
  });
}
async function file2Hash(file, chunkLength = _multipartUpload.defaultMultipartUploadParams.chunkSize) {
  const chunkSize = Math.ceil(file.size / chunkLength);
  const file2Md5 = async (start, end) => {
    const slicedBlob = file.slice(start, end);
    const slicedArrayBuffer = await blob2Ab(slicedBlob);
    const slicedUnit8Array = new Uint8Array(slicedArrayBuffer);
    return (0, _md.default)(slicedUnit8Array);
  };
  const names = [chunkSize, await file2Md5(0, chunkLength)];
  if (chunkSize >= 3) {
    const endIndex = Math.ceil(chunkSize / 2);
    names.push(await file2Md5((endIndex - 1) * chunkLength, endIndex * chunkLength));
  }
  if (chunkSize >= 2) {
    names.push(await file2Md5((chunkSize - 1) * chunkLength, chunkSize * chunkLength));
  }
  return (0, _md.default)(names.join('-'));
}
async function file2OssName(file, options = {}) {
  const {
    dir = _enum.OssDirEnum.DEFAULT,
    chunkLength = _multipartUpload.defaultMultipartUploadParams.chunkSize
  } = options;
  const hashFileName = await file2Hash(file, chunkLength);
  const ext = (0, _getExt.default)(file).toLowerCase();
  const name = `${dir}${hashFileName}${ext ? `.${ext}` : ''}`.replace(/^\//, '');
  return name;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJibG9iMkFiIiwiZmlsZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZGVuZCIsInJlc3VsdCIsIm9uZXJyb3IiLCJFcnJvciIsInJlYWRBc0FycmF5QnVmZmVyIiwiZmlsZTJIYXNoIiwiY2h1bmtMZW5ndGgiLCJkZWZhdWx0TXVsdGlwYXJ0VXBsb2FkUGFyYW1zIiwiY2h1bmtTaXplIiwiTWF0aCIsImNlaWwiLCJzaXplIiwiZmlsZTJNZDUiLCJzdGFydCIsImVuZCIsInNsaWNlZEJsb2IiLCJzbGljZSIsInNsaWNlZEFycmF5QnVmZmVyIiwic2xpY2VkVW5pdDhBcnJheSIsIlVpbnQ4QXJyYXkiLCJtZDUiLCJuYW1lcyIsImVuZEluZGV4IiwicHVzaCIsImpvaW4iLCJmaWxlMk9zc05hbWUiLCJvcHRpb25zIiwiZGlyIiwiT3NzRGlyRW51bSIsIkRFRkFVTFQiLCJoYXNoRmlsZU5hbWUiLCJleHQiLCJnZXRFeHQiLCJ0b0xvd2VyQ2FzZSIsIm5hbWUiLCJyZXBsYWNlIl0sInNvdXJjZXMiOlsiLi4vLi4vbGliU3JjL3NyYy9maWxlLTItaGFzaC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDov5Tlm57kuIDkuKrmlofku7bllK/kuIDlkI3lrZdcbmltcG9ydCBtZDUgZnJvbSAnbWQ1J1xuaW1wb3J0IGdldEV4dCBmcm9tICcuL2dldC1leHQnXG5pbXBvcnQgeyBPc3NEaXJFbnVtIH0gZnJvbSAnLi4vZW51bSdcbmltcG9ydCB7IGRlZmF1bHRNdWx0aXBhcnRVcGxvYWRQYXJhbXMgfSBmcm9tICcuL211bHRpcGFydC11cGxvYWQnXG5cbi8qKlxuICog5bCGYmxvYui9rOaNouS4umFycmF5IGJ1ZmZlclxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmxvYjJBYihmaWxlOiBCbG9iKTogUHJvbWlzZTxBcnJheUJ1ZmZlcj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICByZWFkZXIub25sb2FkZW5kID0gKCkgPT4gcmVzb2x2ZShyZWFkZXIucmVzdWx0IGFzIEFycmF5QnVmZmVyKVxuICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4gcmVqZWN0KG5ldyBFcnJvcignbG9hZCBmaWxlIGVycm9yJykpXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGZpbGUpXG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaWxlMkhhc2goZmlsZTogQmxvYiwgY2h1bmtMZW5ndGggPSBkZWZhdWx0TXVsdGlwYXJ0VXBsb2FkUGFyYW1zLmNodW5rU2l6ZSkge1xuICBjb25zdCBjaHVua1NpemUgPSBNYXRoLmNlaWwoZmlsZS5zaXplIC8gY2h1bmtMZW5ndGgpXG4gIGNvbnN0IGZpbGUyTWQ1ID0gYXN5bmMgKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3Qgc2xpY2VkQmxvYiA9IGZpbGUuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICBjb25zdCBzbGljZWRBcnJheUJ1ZmZlciA9IGF3YWl0IGJsb2IyQWIoc2xpY2VkQmxvYilcbiAgICBjb25zdCBzbGljZWRVbml0OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoc2xpY2VkQXJyYXlCdWZmZXIpXG4gICAgcmV0dXJuIG1kNShzbGljZWRVbml0OEFycmF5KVxuICB9XG4gIGNvbnN0IG5hbWVzID0gW2NodW5rU2l6ZSwgYXdhaXQgZmlsZTJNZDUoMCwgY2h1bmtMZW5ndGgpXVxuICBpZiAoY2h1bmtTaXplID49IDMpIHtcbiAgICBjb25zdCBlbmRJbmRleCA9IE1hdGguY2VpbChjaHVua1NpemUgLyAyKVxuICAgIG5hbWVzLnB1c2goYXdhaXQgZmlsZTJNZDUoKGVuZEluZGV4IC0gMSkgKiBjaHVua0xlbmd0aCwgZW5kSW5kZXggKiBjaHVua0xlbmd0aCkpXG4gIH1cbiAgaWYgKGNodW5rU2l6ZSA+PSAyKSB7XG4gICAgbmFtZXMucHVzaChhd2FpdCBmaWxlMk1kNSgoY2h1bmtTaXplIC0gMSkgKiBjaHVua0xlbmd0aCwgY2h1bmtTaXplICogY2h1bmtMZW5ndGgpKVxuICB9XG4gIHJldHVybiBtZDUobmFtZXMuam9pbignLScpKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmlsZTJPc3NOYW1lKFxuICBmaWxlOiBGaWxlLFxuICBvcHRpb25zOiBQYXJ0aWFsPHtcbiAgICBkaXI6IE9zc0RpckVudW07XG4gICAgY2h1bmtMZW5ndGg6IG51bWJlcjtcbiAgfT4gPSB7fVxuKSB7XG4gIGNvbnN0IHsgZGlyID0gT3NzRGlyRW51bS5ERUZBVUxULCBjaHVua0xlbmd0aCA9IGRlZmF1bHRNdWx0aXBhcnRVcGxvYWRQYXJhbXMuY2h1bmtTaXplIH0gPSBvcHRpb25zXG4gIGNvbnN0IGhhc2hGaWxlTmFtZSA9IGF3YWl0IGZpbGUySGFzaChmaWxlLCBjaHVua0xlbmd0aClcbiAgY29uc3QgZXh0ID0gZ2V0RXh0KGZpbGUpLnRvTG93ZXJDYXNlKClcbiAgY29uc3QgbmFtZSA9IGAke2Rpcn0ke2hhc2hGaWxlTmFtZX0ke2V4dCA/IGAuJHtleHR9YCA6ICcnfWAucmVwbGFjZSgvXlxcLy8sICcnKVxuICByZXR1cm4gbmFtZVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQWlFO0FBSmpFOztBQU1BO0FBQ0E7QUFDQTtBQUNPLGVBQWVBLE9BQU8sQ0FBQ0MsSUFBVSxFQUF3QjtFQUM5RCxPQUFPLElBQUlDLE9BQU8sQ0FBQyxDQUFDQyxPQUFPLEVBQUVDLE1BQU0sS0FBSztJQUN0QyxNQUFNQyxNQUFNLEdBQUcsSUFBSUMsVUFBVSxFQUFFO0lBQy9CRCxNQUFNLENBQUNFLFNBQVMsR0FBRyxNQUFNSixPQUFPLENBQUNFLE1BQU0sQ0FBQ0csTUFBTSxDQUFnQjtJQUM5REgsTUFBTSxDQUFDSSxPQUFPLEdBQUcsTUFBTUwsTUFBTSxDQUFDLElBQUlNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzNETCxNQUFNLENBQUNNLGlCQUFpQixDQUFDVixJQUFJLENBQUM7RUFDaEMsQ0FBQyxDQUFDO0FBQ0o7QUFFTyxlQUFlVyxTQUFTLENBQUNYLElBQVUsRUFBRVksV0FBVyxHQUFHQyw2Q0FBNEIsQ0FBQ0MsU0FBUyxFQUFFO0VBQ2hHLE1BQU1BLFNBQVMsR0FBR0MsSUFBSSxDQUFDQyxJQUFJLENBQUNoQixJQUFJLENBQUNpQixJQUFJLEdBQUdMLFdBQVcsQ0FBQztFQUNwRCxNQUFNTSxRQUFRLEdBQUcsT0FBT0MsS0FBYSxFQUFFQyxHQUFXLEtBQUs7SUFDckQsTUFBTUMsVUFBVSxHQUFHckIsSUFBSSxDQUFDc0IsS0FBSyxDQUFDSCxLQUFLLEVBQUVDLEdBQUcsQ0FBQztJQUN6QyxNQUFNRyxpQkFBaUIsR0FBRyxNQUFNeEIsT0FBTyxDQUFDc0IsVUFBVSxDQUFDO0lBQ25ELE1BQU1HLGdCQUFnQixHQUFHLElBQUlDLFVBQVUsQ0FBQ0YsaUJBQWlCLENBQUM7SUFDMUQsT0FBTyxJQUFBRyxXQUFHLEVBQUNGLGdCQUFnQixDQUFDO0VBQzlCLENBQUM7RUFDRCxNQUFNRyxLQUFLLEdBQUcsQ0FBQ2IsU0FBUyxFQUFFLE1BQU1JLFFBQVEsQ0FBQyxDQUFDLEVBQUVOLFdBQVcsQ0FBQyxDQUFDO0VBQ3pELElBQUlFLFNBQVMsSUFBSSxDQUFDLEVBQUU7SUFDbEIsTUFBTWMsUUFBUSxHQUFHYixJQUFJLENBQUNDLElBQUksQ0FBQ0YsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUN6Q2EsS0FBSyxDQUFDRSxJQUFJLENBQUMsTUFBTVgsUUFBUSxDQUFDLENBQUNVLFFBQVEsR0FBRyxDQUFDLElBQUloQixXQUFXLEVBQUVnQixRQUFRLEdBQUdoQixXQUFXLENBQUMsQ0FBQztFQUNsRjtFQUNBLElBQUlFLFNBQVMsSUFBSSxDQUFDLEVBQUU7SUFDbEJhLEtBQUssQ0FBQ0UsSUFBSSxDQUFDLE1BQU1YLFFBQVEsQ0FBQyxDQUFDSixTQUFTLEdBQUcsQ0FBQyxJQUFJRixXQUFXLEVBQUVFLFNBQVMsR0FBR0YsV0FBVyxDQUFDLENBQUM7RUFDcEY7RUFDQSxPQUFPLElBQUFjLFdBQUcsRUFBQ0MsS0FBSyxDQUFDRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0I7QUFFTyxlQUFlQyxZQUFZLENBQ2hDL0IsSUFBVSxFQUNWZ0MsT0FHRSxHQUFHLENBQUMsQ0FBQyxFQUNQO0VBQ0EsTUFBTTtJQUFFQyxHQUFHLEdBQUdDLGdCQUFVLENBQUNDLE9BQU87SUFBRXZCLFdBQVcsR0FBR0MsNkNBQTRCLENBQUNDO0VBQVUsQ0FBQyxHQUFHa0IsT0FBTztFQUNsRyxNQUFNSSxZQUFZLEdBQUcsTUFBTXpCLFNBQVMsQ0FBQ1gsSUFBSSxFQUFFWSxXQUFXLENBQUM7RUFDdkQsTUFBTXlCLEdBQUcsR0FBRyxJQUFBQyxlQUFNLEVBQUN0QyxJQUFJLENBQUMsQ0FBQ3VDLFdBQVcsRUFBRTtFQUN0QyxNQUFNQyxJQUFJLEdBQUksR0FBRVAsR0FBSSxHQUFFRyxZQUFhLEdBQUVDLEdBQUcsR0FBSSxJQUFHQSxHQUFJLEVBQUMsR0FBRyxFQUFHLEVBQUMsQ0FBQ0ksT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7RUFDOUUsT0FBT0QsSUFBSTtBQUNiIn0=