'use server'
import { listQuestionBankVoByPageUsingPost } from '@/api/questionBankController'
import { listQuestionByPageUsingPost, listQuestionVoByPageUsingPost } from '@/api/questionController'
import QuestionBanksList from '@/components/QuestionBanksList'
import QuestionTable from '@/components/QuestionTable'
import { Flex, message } from 'antd'
import Title from 'antd/es/typography/Title'

/**
 * 题目列表页
 * @returns
 */
export default async function QuestionsPage({ searchParams }) {
  // 获取 url 的查询参数
  const { q: searchText } = searchParams

  // 获取题目列表和总条数
  let questionList: any[] = []
  let total = 0
  try {
    const res = await listQuestionVoByPageUsingPost({
      pageSize: 12,
      sortField: 'createTime',
      sortOrder: 'desc',
      title: searchText,
    })
    questionList = res.data.records ?? []
    total = res.data.total ?? 0
  } catch (e) {
    message.error('获取题库失败: ' + e.message)
  }

  return (
    <div id="banksPage" className="max-width-content  w-[1200px]">
      <Flex justify="space-between" align="center">
        <Title level={3}>题目大全</Title>
      </Flex>
      <QuestionTable
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={{
          title: searchText,
        }}
      />
    </div>
  )
}
