'use client' // 客户端渲染
import GlobalFooter from '@/components/GlobalFooter'
import { GithubFilled, LogoutOutlined } from '@ant-design/icons'
import { ProLayout } from '@ant-design/pro-components'
import { Dropdown, message } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import menus from '../../../config/menu'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/stores'
import './index.css'
import getAccessibleMenus from '@/access/menuAccess'
import { userLogoutUsingPost } from '@/api/userController'
import { useRouter } from 'next/navigation'
import { DEFAULT_USER, setLoginUser } from '@/stores/loginUser'
import SearchInput from './components/SearchInput'

interface Props {
  children: React.ReactNode
}

/**
 * 全局通用布局
 * @param param0 {0: React.ReactNode} 组件的属性，包含子元素。

 * @returns 
 */
export default function BasicLayout({ children }: Props) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const loginUser = useSelector((state: RootState) => state.loginUser)

  // 在客户端挂载后设置状态
  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * 退出登录
   */
  const doUserLogout = async () => {
    try {
      await userLogoutUsingPost()
      message.success('退出成功')
      // 更新用户状态
      dispatch(setLoginUser(DEFAULT_USER))
      // 跳转至登录页面
      router.replace('/user/login')
    } catch (e: any) {
      message.error('退出失败:' + e.message)
    }
  }
  // 初始渲染的简化版布局（服务端和客户端首次渲染都会使用这个）
  if (!mounted) {
    return (
      <div
        id="basicLayout"
        style={{
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <div className="flex items-center">
          <Image src="/assets/logo.png" width={32} height={32} alt="面试吧刷题平台" />
          <span style={{ fontSize: '16px' }}>刷题吧</span>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    )
  }

  // 客户端完全挂载后的完整布局
  return (
    <div
      id="basicLayout"
      style={{
        minHeight: '100vh',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ProLayout
        title=""
        layout="top"
        logo={
          <Link href="/" className="flex items-center">
            <Image src="/assets/logo.png" width={32} height={32} alt="面试吧刷题平台" />
            <span style={{ fontSize: '16px' }}>刷题吧</span>
          </Link>
        }
        location={{
          pathname,
        }}
        siderMenuType="group"
        menu={{
          collapsedShowGroupTitle: true,
        }}
        avatarProps={{
          src: loginUser.userAvatar || '/assets/logo.png',
          size: 'small',
          title: loginUser.userName || '你过来啊',
          render: (props, dom) => {
            if (!loginUser.id) {
              return (
                <Link href="/user/login" className="text-slate-400">
                  {dom}
                </Link>
              )
            }
            return (
              // 添加点击事件
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
                      onClick: doUserLogout,
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            )
          },
        }}
        actionsRender={props => {
          if (props.isMobile) return []
          return [
            <SearchInput key="search" />,
            <a key="github" href="https://github.com/wjp527" target="_blank">
              <GithubFilled key="GithubFilled" />
            </a>,
          ]
        }}
        headerTitleRender={(logo, title, _) => {
          return (
            <a>
              {logo}
              {title}
            </a>
          )
        }}
        footerRender={() => <GlobalFooter />}
        onMenuHeaderClick={e => console.log(e)}
        menuDataRender={() => {
          return getAccessibleMenus(loginUser, menus)
        }}
        menuItemRender={(item, dom) => (
          <Link href={item.path || '/'} target={item.target}>
            {dom}
          </Link>
        )}
      >
        {children}
      </ProLayout>
    </div>
  )
}
