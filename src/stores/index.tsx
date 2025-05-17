/**
 * 全局管理是维护在浏览器里面，我们只能在客户端进行获取
 */
import { configureStore } from '@reduxjs/toolkit'
import loginUserReducer from './loginUser'
const store = configureStore({
  // 注册 reducer
  reducer: {
    // 在这里存放状态
    loginUser: loginUserReducer,
  },
})

// 用于类型推断和提示
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
