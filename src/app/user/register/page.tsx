'use client' // 客户端渲染

import { userLoginUsingPost, userRegisterUsingPost } from '@/api/userController'
import { AppDispatch, RootState } from '@/stores'
import { setLoginUser } from '@/stores/loginUser'
import { AlipayCircleOutlined, LockOutlined, MobileOutlined, TaobaoCircleOutlined, UserOutlined, WeiboCircleOutlined } from '@ant-design/icons'
import { LoginForm, ProConfigProvider, ProForm, ProFormCaptcha, ProFormCheckbox, ProFormText, setAlpha } from '@ant-design/pro-components'
import { Space, Tabs, message, theme } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
const UserRegisterPage: React.FC = () => {
  const [form] = ProForm.useForm()
  const { token } = theme.useToken()
  // 状态管理
  const dispatch = useDispatch<AppDispatch>()

  const router = useRouter()
  // 注册
  const doSubmit = async (values: API.UserRegisterRequest) => {
    let res = await userRegisterUsingPost(values)
    try {
      if (res.code === 0) {
        message.success('注册成功')
        // 跳转至首页
        router.replace('/user/login')
        form.resetFields()
      }
    } catch (e) {
      message.error('注册失败:' + e.message)
    }
  }

  return (
    <div id="userRegisterPage" style={{ backgroundColor: token.colorBgContainer }}>
      <LoginForm form={form} logo={<Image src="/assets/logo.png" alt="logo" width={60} height={60} />} title="面试吧 - 用户注册" subTitle="程序员面试刷题网站" onFinish={doSubmit}>
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
          <ProFormText.Password
            name="checkPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
              placeholder: '请输入确认密码',
            }}
            rules={[
              {
                required: true,
                message: '请输入确认密码！',
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
          已经有账号?
          <Link href="/user/login">登录</Link>
        </div>
      </LoginForm>
    </div>
  )
}
export default UserRegisterPage
