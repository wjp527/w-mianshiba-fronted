'use client' // 客户端渲染
import GlobalFooter from '@/components/GlobalFooter'
import { GithubFilled, LogoutOutlined, SearchOutlined } from '@ant-design/icons'
import { ProLayout } from '@ant-design/pro-components'
import { Dropdown, Input } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import menus from '../../../config/menu'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores'

const SearchInput = () => {
  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        marginInlineEnd: 24,
      }}
      onMouseDown={e => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <Input prefix={<SearchOutlined />} placeholder="搜索题目" variant="borderless" />
    </div>
  )
}

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

  const loginUser = useSelector((state: RootState) => state.loginUser)
  // 在客户端挂载后设置状态
  useEffect(() => {
    setMounted(true)
  }, [])

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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Image src="/assets/logo.png" width={32} height={32} alt="面试吧刷题平台" />
          <span style={{ marginLeft: '10px' }}>刷题吧</span>
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
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ProLayout
        title="刷题吧"
        layout="top"
        logo={<Image src="/assets/logo.png" width={32} height={32} alt="面试吧刷题平台" />}
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
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
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
          return menus
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
