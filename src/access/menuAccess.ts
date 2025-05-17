import menus from "../../config/menu";
import checkAccess from "./checkAccess";

/**
 * 获取有权限、可访问的菜单
 * @param loginUser 登录用户信息
 * @param menuItems 菜单列表
 * @returns 有权限、可访问的菜单列表
 */
const getAccessibleMenus = (loginUser: API.LoginUserVO, menuItems = menus) => {
  return menuItems.filter((item) => {
    // 如果当前菜单没有权限，则不显示
    if (!checkAccess(loginUser, item.access)) {
      return false
    }
    // 如果当前菜单有子菜单，则递归获取子菜单
    if (item.children) {
      item.children = getAccessibleMenus(loginUser, item.children)
    }
    // 如果当前菜单没有子菜单，则返回当前菜单
    return true
  })
}

export default getAccessibleMenus
