import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // console.log('getToken()', getToken())
      config.headers['Authorization'] = getToken()
    }
    // console.log('config()', config)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    res.code = Number(res.code)
    console.log(res)
    console.log('code', res.code)

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      console.log('code', Number(res.code) !== 200)
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      console.log('res.code !== 200', res.code)
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        console.log('res.code === 50008 || res.code === 50012 || res.code === 50014', res.code)

        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      console.log('else')
      return res
    }
  },
  error => {
    console.log('requset.js//err:' + error) // for debug
    Message({
      message: error,
      type: 'error',
      duration: 10 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
