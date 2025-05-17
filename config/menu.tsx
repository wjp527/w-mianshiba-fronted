import ACCESS_ENUM from '@/access/accessEnum'
import { CrownOutlined } from '@ant-design/icons'
import { MenuDataItem } from '@ant-design/pro-components'

// 菜单列表
const menus = [
  {
    path: '/',
    name: '主页',
  },
  {
    path: '/banks',
    name: '题库',
  },
  {
    path: '/questions',
    name: '题目',
  },
  {
    path: '/admin',
    name: '管理',
    icon: <CrownOutlined />,
    access: ACCESS_ENUM.ADMIN,
    children: [
      {
        path: '/admin/user',
        name: '用户管理',
        access: ACCESS_ENUM.ADMIN,
      },
    ],
  },
] as MenuDataItem[]

export default menus

// 根据全部路径查找菜单
export const findAllMenudItemByPath = (path: string): MenuDataItem | null => {
  return findMenuItemByPath(menus, path)
}

// 根据路径查找菜单(递归)
export const findMenuItemByPath = (menus: MenuDataItem[], path: string): MenuDataItem | null => {
  for (const menu of menus) {
    if (menu.path === path) {
      return menu
    }

    if (menu.children) {
      const matchedMenuItem = findMenuItemByPath(menu.children, path)
      if (matchedMenuItem) {
        return matchedMenuItem
      }
    }
  }
  return null
}
