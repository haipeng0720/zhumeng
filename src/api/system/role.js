import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/role',
    method: 'delete',
    data: {
      'roleId': id
    }
  })
}

export function edit(data) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}

export function getRole(roleId) {
  return request({
    url: '/role/' + roleId,
    method: 'get'
  })
}

export function listRole(data) {
  return request({
    url: '/role/list/' + data.pageNum + '/' + data.pageSize,
    method: 'get',
    data
  })
}

export function auth(data) {
  return request({
    url: '/role/auth',
    method: 'put',
    data
  })
}
export default { add, edit, del, getRole, listRole, auth }

