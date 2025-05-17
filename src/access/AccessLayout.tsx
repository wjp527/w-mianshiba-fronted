import { usePathname } from 'next/navigation'
import menus, { findAllMenudItemByPath } from '../../config/menu'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores'
import ACCESS_ENUM from './accessEnum'
import Forbbien from '@/app/forbidden'
import checkAccess from './checkAccess'

/**
 * 统一权限校验拦截器
 * @param param0
 * @returns
 */
const InitAccessLayout: React.FC<Readonly<{ children: React.ReactNode }>> = ({ children }) => {
  const pathname = usePathname()
  // 获取当前登录用户
  const loginUser = useSelector((state: RootState) => state.loginUser)
  const menu = findAllMenudItemByPath(pathname)
  // 校验权限
  const needAccess = menu?.access ?? ACCESS_ENUM.NOT_LOGIN
  // 是否具有该页面的权限
  const canAccess = checkAccess(loginUser, needAccess)
  if (!canAccess) {
    return <Forbbien />
  }
  return children
}

export default InitAccessLayout
