import request from '@/utils/request'
// export function login(data) {
//   return request({
//     url: '/vue-element-admin/user/login',
//     method: 'post',
//     data,
//     baseUrl: 'http://localhost:9527'
//   })
// }
export function login(data) {
  return request({
    url: '/sysLogin',
    method: 'post',
    data
    // baseUrl: 'http://localhost:9527'
  })
}

// export function getInfo1(token) {
//   return request({
//     url: '/user/getUserInfoByToken',
//     method: 'get',
//     params: { token }
//     // data
//   })
// }

export function getInfo() {
  return request({
    url: '/user/getUserInfoByToken',
    method: 'get'
    // baseUrl: 'http://localhost:9527'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
