'use client' // 客户端渲染

import { userLoginUsingPost } from '@/api/userController'
import { AppDispatch, RootState } from '@/stores'
import { setLoginUser } from '@/stores/loginUser'
import { AlipayCircleOutlined, LockOutlined, MobileOutlined, TaobaoCircleOutlined, UserOutlined, WeiboCircleOutlined } from '@ant-design/icons'
import { LoginForm, ProConfigProvider, ProForm, ProFormCaptcha, ProFormCheckbox, ProFormText, setAlpha } from '@ant-design/pro-components'
import { Space, Tabs, message, theme } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
const UserLoginPage: React.FC = () => {
  const [form] = ProForm.useForm()
  const { token } = theme.useToken()
  // 状态管理
  const dispatch = useDispatch<AppDispatch>()

  const router = useRouter()
  // 登录
  const doSubmit = async (values: API.UserLoginRequest) => {
    let res = await userLoginUsingPost(values)
    try {
      if (res.code === 0) {
        message.success('登录成功')
        // 保存用户登录状态
        dispatch(setLoginUser(res.data))
        // 跳转至首页
        router.replace('/')
        form.resetFields()
      }
    } catch (e) {
      message.error('登录失败:' + e.message)
    }
  }

  return (
    <div id="userLoginPage" style={{ backgroundColor: token.colorBgContainer }}>
      <LoginForm form={form} logo={<Image src="/assets/logo.png" alt="logo" width={60} height={60} />} title="面试吧 - 用户登录" subTitle="程序员面试刷题网站" onFinish={doSubmit}>
        <>
          <ProFormText
            name="userAccount"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'请输入用户账号'}
            rules={[
              {
                required: true,
                message: '请输入用户账号!',
              },
            ]}
          />
          <ProFormText.Password
            name="userPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
              placeholder: '请输入密码',
            }}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </>

        <div
          style={{
            marginBlockEnd: 24,
            textAlign: 'end',
          }}
        >
          还没有账号?
          <Link href="/user/register">注册</Link>
        </div>
      </LoginForm>
    </div>
  )
}
export default UserLoginPage
