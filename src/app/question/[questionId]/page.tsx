'use server'
import { getQuestionBankVoByIdUsingGet } from '@/api/questionBankController'
import { getQuestionVoByIdUsingGet } from '@/api/questionController'
import { addUserSignInUsingPost } from '@/api/userController'
import QuestionCard from '@/components/QuestionCard'
import { Flex, message } from 'antd'
import { useEffect } from 'react'
import { Content } from 'antd/es/layout/layout'

/**
 * 题目详情页
 * @returns
 */
export default async function BankPage({ params }: { params: { questionId: string } }) {
  const { questionId } = params

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

  return (
    <div id="BankQuestionPage" className="h-full">
      <Flex gap={24} className="h-full">
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <QuestionCard questionId={Number(questionId)} questionList={[question]} />
        </Content>
      </Flex>
    </div>
  )
}
