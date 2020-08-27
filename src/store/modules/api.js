const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // baseUrl，
    baseApi: baseUrl,
    // windows静态文件地址 ,由于windows系统（F:\com\syyo\images）和linux不同，要在前面加个"/"变成（"/F:\com\syyo\images"）
    staticApi: 'http://localhost' + '/'
    // linux静态文件地址
    // staticApi: 'http://localhost' ,

  }
}

export default api
