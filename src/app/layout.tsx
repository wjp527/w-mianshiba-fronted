'use client'
import BasicLayout from '@/layouts/BasicLayout'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { useCallback, useEffect } from 'react'
// 状态管理
import store, { AppDispatch } from '@/stores'
import { Provider, useDispatch } from 'react-redux'
import { getLoginUserUsingGet } from '@/api/userController'
import { setLoginUser } from '@/stores/loginUser'
import { usePathname } from 'next/navigation'
import ACCESS_ENUM from '@/access/accessEnum'
import AccessLayout from '@/access/AccessLayout'
/**
 * 全局初始化逻辑
 * @param param0
 * @returns
 */
const InitLayout: React.FC<Readonly<{ children: React.ReactNode }>> = ({ children }) => {
  // 获取到当前路径
  const pathname = usePathname()
  // 状态管理
  const dispatch = useDispatch<AppDispatch>()
  /**
   * 全局初始化函数，有全局单次调用的代码，都可以写到这里
   */
  const doInitLoginUser = useCallback(async () => {
    const res = await getLoginUserUsingGet()
    if (res.data) {
      // 更新全局用户状态，将返回数据转换为需要的格式
      const res = await getLoginUserUsingGet()
      dispatch(setLoginUser(res.data))
    } else {
      // 模拟登录
    }
  }, [])

  useEffect(() => {
    // 登录和注册页面不进行获取登录信息
    if (!pathname.startsWith('/user/login') && !pathname.startsWith('/user/register')) {
      doInitLoginUser()
    }
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
              <BasicLayout>
                {/* 全局权限校验器 */}
                <AccessLayout>{children}</AccessLayout>
              </BasicLayout>
            </InitLayout>
          </Provider>
        </AntdRegistry>
      </body>
    </html>
  )
}
