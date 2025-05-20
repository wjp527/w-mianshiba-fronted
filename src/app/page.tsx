'use server'

import Title from 'antd/es/typography/Title'

import { Divider, Flex, message } from 'antd'
import './globals.css'
import Link from 'next/link'
import { listQuestionBankVoByPageUsingPost } from '@/api/questionBankController'
import { listQuestionVoByPageUsingPost } from '@/api/questionController'
import QuestionBanksList from '@/components/QuestionBanksList'
import Question from '@/components/Question'

/**
 * 服务端渲染的组件，必须要加async
 * @returns
 */
export default async function HomePage() {
  let questionBankList: any[] = []
  let questionList: any[] = []
  try {
    const res = await listQuestionBankVoByPageUsingPost({
      pageSize: 12,
      sortField: 'createTime',
      sortOrder: 'desc',
    })
    questionBankList = res.data.records ?? []
  } catch (e) {
    message.error('获取题库失败: ' + e.message)
  }

  try {
    const res = await listQuestionVoByPageUsingPost({
      pageSize: 12,
      sortField: 'createTime',
      sortOrder: 'desc',
    })
    console.log(res.data, 'res.data ')
    questionList = res.data.records ?? []
  } catch (e) {}

  return (
    <div id="homePage" className=" max-width-content p-4">
      <Flex justify="space-between" align="center">
        <Title level={3}>最新题库</Title>
        <Link href="/banks">查看更多</Link>
      </Flex>

      <QuestionBanksList questionBanksList={questionBankList} />

      <Divider />

      <Flex justify="space-between" align="center">
        <Title level={3}>最新题目</Title>
        <Link href="/questions">查看更多</Link>
      </Flex>
      <Question questionList={questionList} />
    </div>
  )
}
