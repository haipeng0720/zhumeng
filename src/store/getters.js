const getters = {
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  permission_routes: state => state.permission.routes,
  permissions: state => state.user.permissions,
  addRouters: state => state.permission.addRouters,
  baseApi: state => state.api.baseApi,
  staticApi: state => state.api.staticApi

}
export default getters
