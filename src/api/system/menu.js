import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/menu',
    method: 'delete',
    data: {
      'menuId': id
    }
  })
}

export function edit(data) {
  return request({
    url: '/menu',
    method: 'put',
    data
  })
}

export function treeMenu() {
  return request({
    url: '/menu/tree',
    method: 'get'
  })
}

export function buildMenu() {
  return request({
    url: '/menu/build',
    method: 'get'
  })
}

export function getMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'get'
  })
}

export default { add, edit, del, treeMenu, buildMenu, getMenu }

