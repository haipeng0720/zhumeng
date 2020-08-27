import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/user',
    method: 'delete',
    data: {
      'userId': id
    }
  })
}

export function edit(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function getUser(userId) {
  return request({
    url: '/user/' + userId,
    method: 'get'
  })
}

export function listUser(data) {
  return request({
    url: '/user/list/' + data.pageNum + '/' + data.pageSize,
    method: 'get',
    data
  })
}

export function updatePwd(data) {
  return request({
    url: '/user/pwd',
    method: 'put',
    data
  })
}

export function editAvatar(data) {
  return request({
    url: '/user/avatar',
    method: 'post',
    data
  })
}

export function importUser(data) {
  return request({
    url: '/user/import',
    method: 'post',
    data
  })
}

export function exportUser() {
  return request({
    url: '/user/export',
    method: 'get'
  })
}

export default { add, edit, del, listUser, getUser, updatePwd, editAvatar, importUser, exportUser }

