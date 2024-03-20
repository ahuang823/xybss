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
    data,
    baseUrl: 'http://localhost:9527'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
