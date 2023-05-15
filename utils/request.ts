import axios from 'axios'

export const reqUser = axios.create({
  baseURL: '/sign/WeBASE-Sign',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})

export const reqContract = axios.create({
  baseURL: '/contract/WeBASE-Front',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})

// 拦截请求
reqUser.interceptors.request.use(
  (config) => {
    // 在请求被发送之前做一些处理
    console.log('请求拦截器被触发：', config)
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求拦截器出错：', error)
    return Promise.reject(error)
  }
)

reqContract.interceptors.request.use(
  (config) => {
    console.log('请求拦截器被触发：', config)
    return config
  },
  (error) => {
    console.error('请求拦截器出错：', error)
    return Promise.reject(error)
  }
)

// 拦截响应
reqUser.interceptors.response.use(
  (response) => {
    console.log('响应拦截器被触发：', response)
    return response.data
  },
  (error) => {
    console.error('响应拦截器出错：', error)
    return Promise.reject(error.data)
  }
)

reqContract.interceptors.response.use(
  (response) => {
    console.log('响应拦截器被触发：', response)
    return response.data
  },
  (error) => {
    console.error('响应拦截器出错：', error)
    return Promise.reject(error.data)
  }
)
