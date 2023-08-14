"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOssNameFromUrl = getOssNameFromUrl;
function getOssNameFromUrl(url) {
  const splits = url.split('/');
  let i = 3;
  let resultString = '';
  while (!splits[i].includes('?')) {
    resultString = resultString + '/' + splits[i++];
  }
  if (splits[i].includes('?')) {
    resultString = resultString + '/' + splits[i].split('?')[0];
  } else {
    throw new Error(`获取oss name失败。url为${url}`);
  }
  console.log(resultString);
  // 把一开头的斜杠去掉
  return resultString.slice(1);
  // if (splits[3].includes('?')) return splits[3].split('?')[0]
  // return splits[3] + '/' + splits[4].split('?')[0]
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRPc3NOYW1lRnJvbVVybCIsInVybCIsInNwbGl0cyIsInNwbGl0IiwiaSIsInJlc3VsdFN0cmluZyIsImluY2x1ZGVzIiwiRXJyb3IiLCJjb25zb2xlIiwibG9nIiwic2xpY2UiXSwic291cmNlcyI6WyIuLi8uLi9saWJTcmMvc3JjL2dldC1vc3MtbmFtZS1mcm9tLXVybC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2V0T3NzTmFtZUZyb21VcmwodXJsOiBzdHJpbmcpIHtcbiAgY29uc3Qgc3BsaXRzID0gdXJsLnNwbGl0KCcvJylcbiAgbGV0IGkgPSAzXG4gIGxldCByZXN1bHRTdHJpbmcgPSAnJ1xuICB3aGlsZSAoIXNwbGl0c1tpXS5pbmNsdWRlcygnPycpKSB7XG4gICAgcmVzdWx0U3RyaW5nID0gcmVzdWx0U3RyaW5nICsgJy8nICsgc3BsaXRzW2krK11cbiAgfVxuICBpZiAoc3BsaXRzW2ldLmluY2x1ZGVzKCc/JykpIHtcbiAgICByZXN1bHRTdHJpbmcgPSByZXN1bHRTdHJpbmcgKyAnLycgKyBzcGxpdHNbaV0uc3BsaXQoJz8nKVswXVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihg6I635Y+Wb3NzIG5hbWXlpLHotKXjgIJ1cmzkuLoke3VybH1gKVxuICB9XG4gIGNvbnNvbGUubG9nKHJlc3VsdFN0cmluZylcbiAgLy8g5oqK5LiA5byA5aS055qE5pac5p2g5Y675o6JXG4gIHJldHVybiByZXN1bHRTdHJpbmcuc2xpY2UoMSlcbiAgLy8gaWYgKHNwbGl0c1szXS5pbmNsdWRlcygnPycpKSByZXR1cm4gc3BsaXRzWzNdLnNwbGl0KCc/JylbMF1cbiAgLy8gcmV0dXJuIHNwbGl0c1szXSArICcvJyArIHNwbGl0c1s0XS5zcGxpdCgnPycpWzBdXG59Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBTyxTQUFTQSxpQkFBaUIsQ0FBQ0MsR0FBVyxFQUFFO0VBQzdDLE1BQU1DLE1BQU0sR0FBR0QsR0FBRyxDQUFDRSxLQUFLLENBQUMsR0FBRyxDQUFDO0VBQzdCLElBQUlDLENBQUMsR0FBRyxDQUFDO0VBQ1QsSUFBSUMsWUFBWSxHQUFHLEVBQUU7RUFDckIsT0FBTyxDQUFDSCxNQUFNLENBQUNFLENBQUMsQ0FBQyxDQUFDRSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDL0JELFlBQVksR0FBR0EsWUFBWSxHQUFHLEdBQUcsR0FBR0gsTUFBTSxDQUFDRSxDQUFDLEVBQUUsQ0FBQztFQUNqRDtFQUNBLElBQUlGLE1BQU0sQ0FBQ0UsQ0FBQyxDQUFDLENBQUNFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUMzQkQsWUFBWSxHQUFHQSxZQUFZLEdBQUcsR0FBRyxHQUFHSCxNQUFNLENBQUNFLENBQUMsQ0FBQyxDQUFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzdELENBQUMsTUFBTTtJQUNMLE1BQU0sSUFBSUksS0FBSyxDQUFFLG9CQUFtQk4sR0FBSSxFQUFDLENBQUM7RUFDNUM7RUFDQU8sT0FBTyxDQUFDQyxHQUFHLENBQUNKLFlBQVksQ0FBQztFQUN6QjtFQUNBLE9BQU9BLFlBQVksQ0FBQ0ssS0FBSyxDQUFDLENBQUMsQ0FBQztFQUM1QjtFQUNBO0FBQ0YifQ==