'use server'
import { listQuestionBankVoByPageUsingPost } from '@/api/questionBankController'
import QuestionBanksList from '@/components/QuestionBanksList'
import { Flex, message } from 'antd'
import Title from 'antd/es/typography/Title'

/**
 * 题库列表页
 * @returns
 */
export default async function BanksPage() {
  let questionBankList: any[] = []
  try {
    const res = await listQuestionBankVoByPageUsingPost({
      pageSize: 200,
      sortField: 'createTime',
      sortOrder: 'desc',
    })
    questionBankList = res.data.records ?? []
  } catch (e) {
    message.error('获取题库失败: ' + e.message)
  }

  return (
    <div id="banksPage" className=" max-width-content p-4">
      <Flex justify="space-between" align="center">
        <Title level={3}>题库大全</Title>
      </Flex>

      <QuestionBanksList questionBanksList={questionBankList} />
    </div>
  )
}
