import axios from 'axios'
import qs from 'qs'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  async (config) => {
    // 修复axios发送get请求且data为未定义时，Content-Type被删除的错误
    if (config.data === undefined) {
      config.data = null
    }

    // get请求映射params参数
    if (config.params) {
      let url = config.url + '?' + qs.stringify(config.params)
      config.params = {}
      config.url = url
    }

    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    if (res.config.responseDataFilter) {
      return Promise.resolve(res.config.responseDataFilter(res.data))
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }

    return Promise.reject(error)
  }
)

export default service
