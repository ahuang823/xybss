// download.js
// 导入
import { saveAs as FileSaver } from 'file-saver'
// 使用
function fileDownload(URL, fileName) {
  // 在方法内使用该代码片段
  const oReq = new XMLHttpRequest()
  oReq.open('GET', URL, true)// URL 为下载的URL地址
  oReq.responseType = 'blob'
  oReq.onload = function() {
    const file = new Blob([oReq.response], {
      type: 'blob'
    })
    FileSaver.saveAs(file, fileName) // fileName为文件名
  }
  oReq.send()
}

export default fileDownload
