'use server'
import { getQuestionBankVoByIdUsingGet } from '@/api/questionBankController'
import { getQuestionVoByIdUsingGet } from '@/api/questionController'
import QuestionCard from '@/components/QuestionCard'
import { Flex, Layout, Menu } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import Title from 'antd/es/typography/Title'
import Link from 'next/link'

/**
 * 题目详情页
 * @returns
 */
export default async function BankPage({ params }: { params: { questionBankId: string; questionId: string } }) {
  const { questionBankId, questionId } = params
  let bank = undefined
  try {
    const res = await getQuestionBankVoByIdUsingGet({
      id: Number(questionBankId),
      needQueryQuestionList: true,
    })
    bank = res.data
  } catch (e) {
    return (
      <div className="p-4 text-red-600">
        <h3>题库加载失败</h3>
        <p>错误原因：{e.message}</p>
      </div>
    )
  }

  if (!bank) {
    return <div>获取题库详情失败,请刷新重试</div>
  }

  let question = undefined
  try {
    const res = await getQuestionVoByIdUsingGet({
      id: Number(questionId),
    })
    question = res.data
  } catch (e) {
    return (
      <div className="p-4 text-red-600">
        <h3>题目加载失败</h3>
        <p>错误原因：{e.message}</p>
      </div>
    )
  }

  if (!question) {
    return <div>获取题目详情失败,请刷新重试</div>
  }

  const questionMenuItemList = bank?.questionPage?.records?.map((q: API.QuestionVO) => ({
    key: q.id,
    label: <Link href={`/bank/${questionBankId}/question/${q.id}`}>{q.title}</Link>,
  }))

  return (
    <div id="BankQuestionPage" className="h-full">
      <Flex gap={24} className="h-full">
        <Sider width={200} theme="light">
          <Title level={4} className="p-4">
            {bank?.title}
          </Title>
          <Menu selectedKeys={[questionId]} mode="inline" defaultSelectedKeys={[questionMenuItemList[0].key]} items={questionMenuItemList} />
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <QuestionCard questionBankId={Number(questionBankId)} questionId={Number(questionId)} questionList={bank?.questionPage?.records} cardTitle={bank?.title} />
        </Content>
      </Flex>
    </div>
  )
}
