'use client' // 客户端渲染

import { Avatar, Card, Col, Row } from 'antd'
import './index.css'
import { UserOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import Image from 'next/image'
import Title from 'antd/es/typography/Title'
import Paragraph from 'antd/es/typography/Paragraph'
import { useState } from 'react'
import CalendarChart from './components/CalendarChart/page'
/**
 * 用户中心页面组件
 *
 * @returns 返回用户中心页面的 JSX 元素
 */
const UserCenterPage: React.FC = () => {
  // 使用 useSelector 来获取登录用户信息
  const loginUser = useSelector((state: RootState) => state.loginUser)
  const user = loginUser

  // 控制菜单栏的 Tab高亮
  const [activetabKey, setActiveTabKey] = useState('record')
  return (
    <div id="UserCenterPage" className="w-full">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card className="flex flex-col items-center justify-center">
            <Avatar src={user.userAvatar} alt="头像" size={72}></Avatar>
            <Card.Meta
              className="text-center"
              title={
                <Title className="mt-2" level={4}>
                  {user.userName}
                </Title>
              }
              description={
                <Paragraph type="secondary">
                  <div>{user.userEmail}</div>
                  <div>{user.userProfile}</div>
                </Paragraph>
              }
            />
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Card>
            <Card
              tabList={[
                {
                  key: 'record',
                  label: '刷题记录',
                },
                {
                  key: 'others',
                  label: '其他',
                },
              ]}
              accessKey={activetabKey}
              onTabChange={key => {
                setActiveTabKey(key)
              }}
            >
              {activetabKey === 'record' && (
                <div>
                  <CalendarChart></CalendarChart>
                </div>
              )}
              {activetabKey === 'others' && <div>其他</div>}
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default UserCenterPage
