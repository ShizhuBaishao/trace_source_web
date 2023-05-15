/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 */

interface IRoute {
    path?: string
    icon?: string
    name: string
    routes?: IRoute[]

    checkActive?(pathname: String, route: IRoute): boolean

    exact?: boolean
}

export function routeIsActive(pathname: String, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route)
  }

  return route?.exact
    ? pathname == route?.path
    : (route?.path ? pathname.indexOf(route.path) === 0 : false)
}


const routes: IRoute[] = [
    {
        path: '/pages', // the url
        icon: 'HomeIcon', // the component being exported from icons/index.js
        name: '主页', // name that appear in Sidebar
        exact: true,
    },
    {
        path: '/pages/users',
        icon: 'FormsIcon',
        name: '用户审核',
    },
    {
        path: '/pages/products',
        icon: 'FormsIcon',
        name: '产品管理',
    },
    {
        path: '/pages/distributors',
        icon: 'FormsIcon',
        name: '流通管理',
    },
]

export type {IRoute}
export default routes
