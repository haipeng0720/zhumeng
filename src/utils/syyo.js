const baseURL = process.env.VUE_APP_BASE_API

// 通用下载方法
export function download(fileName, uuid) {
  window.location.href = baseURL + '/file/download?fileName=' + fileName + '&uuid=' + uuid
}

// 性别格式化
export function sexFormat(sex) {
  if (sex === 1) {
    return '男'
  } else {
    return '女'
  }
}
