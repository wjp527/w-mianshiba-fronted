'use client'
import BasicLayout from '@/layouts/BasicLayout'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { useCallback, useEffect } from 'react'
// 状态管理
import store from '@/stores'
import { Provider } from 'react-redux'
import { getLoginUserUsingGet } from '@/api/userController'
import { setLoginUser } from '@/stores/loginUser'
/**
 * 全局初始化逻辑
 * @param param0
 * @returns
 */
const InitLayout: React.FC<Readonly<{ children: React.ReactNode }>> = ({ children }) => {
  /**
   * 全局初始化函数，有全局单次调用的代码，都可以写到这里
   */
  const doInitLoginUser = useCallback(async () => {
    const res = await getLoginUserUsingGet()
    if (res.data) {
      // 更新全局用户状态
    } else {
      // 模拟登录
      setTimeout(() => {
        const testUser = {
          userName: '测试用户',
          userAvatar: '/assets/logo.png',
          userRole: 'guest',
        }
        store.dispatch(setLoginUser(testUser))
      }, 3000)
    }
  }, [])

  useEffect(() => {
    doInitLoginUser()
  }, [])

  return children
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body>
        <AntdRegistry>
          {/* 状态管理 */}
          <Provider store={store}>
            {/* 初始化 */}
            <InitLayout>
              {/* 布局 */}
              <BasicLayout>{children}</BasicLayout>
            </InitLayout>
          </Provider>
        </AntdRegistry>
      </body>
    </html>
  )
}
