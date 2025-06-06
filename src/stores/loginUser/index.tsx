import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/stores/index'
import ACCESS_ENUM from '@/access/accessEnum'

// 默认用户
export const DEFAULT_USER: API.LoginUserVO = {
  userName: '未登录',
  userProfile: '暂无简介',
  userAvatar: '/assets/notLoginUser.png',
  userRole: ACCESS_ENUM.NOT_LOGIN,
}

/**
 * 登录用户全局状态
 */
export const loginUserSlice = createSlice({
  name: 'loginUser',
  initialState: DEFAULT_USER,
  reducers: {
    setLoginUser: (state, action: PayloadAction<API.LoginUserVO>) => {
      return {
        ...action.payload,
      }
    },
  },
})

// 修改状态
export const { setLoginUser } = loginUserSlice.actions

// 导出状态
export const selectLoginUser = (state: RootState) => state.loginUser

// 导出 reducer
export default loginUserSlice.reducer
