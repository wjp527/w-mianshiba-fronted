import ACCESS_ENUM from "./accessEnum";

/**
 * 权限校验(判断当前登录是否具有某个页面的权限)
 * @param loginUser 登录用户信息
 * @param needAccess 需要具有的权限
 * @returns 
 */
const checkAccess = (
  loginUser: API.LoginUserVO,
  needAccess = ACCESS_ENUM.NOT_LOGIN
) => {
  // 获取当前登录用户具有的权限(如果没有登陆，则默认没有权限)
  const loginUserAccess = loginUser.userRole

  // 如果当前不需要任何权限
  if (needAccess == ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }

  // 如果需要登录才能访问
  if (needAccess == ACCESS_ENUM.USER) {
    if (loginUserAccess == ACCESS_ENUM.NOT_LOGIN) {
      return false
    }
  }

  // 如果需要管理员权限才能访问
  if (needAccess == ACCESS_ENUM.ADMIN) {
    // 必须要有管理员权限，如果没有，则表示无权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false
    }
  }

  return true;
}

export default checkAccess;