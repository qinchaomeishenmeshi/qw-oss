**## OSS 上传公共组件-链接阿里 oss**

###### \1. 引入

```javascript
;`import QwOss from 'qw-oss'`
```

###### \2. 初始化

```javascript
   `// 调用接口初始化 oss`

   `const initOss = async () => {`

   		`QwOss.install({ fetchOssInfo: '后端返回 oss 配置的接口/promise 配置对象' })`

   		`QwOss.reinstall()`

   `}
```

###### \3. 上传

```javascript
   `// 上传文件`

   `const uploadFile = async (file: File, { chunked = false, maxSize = 3 }): Promise<IUploadFile *|* *null*> => 	{`

   		`console.log('开始上传---->', file)`
			`// 检查是否初始化 oss`

			`await initOss()`

			`console.log('初始化完成')`
			`try {`

						`if (!file) {`

								`throw new Error('No file selected')`

						`}`

			`const resultFile = await QwOss.upload(file, {`

			`onProgress: (num) => {`

					`setProgress(num)`

			`}`

		`})`

		`setResultFile({`

				`fileName: file.name,`

				`name: resultFile.name,`

				`url: resultFile.name`

		`})`

		`const uploadResult = {`

				`fileName: file.name,`

				`name: resultFile.name,`

				`url: resultFile.name`

		`}`

		`setUploaded(true)`

		`return uploadResult`

	`} catch (err) {`

			`setError(err.message)`

			`Message.error(err.message || '上传失败！')`

	`}`

`}
```
