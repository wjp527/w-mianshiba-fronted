'use server'
import { getQuestionBankVoByIdUsingGet } from '@/api/questionBankController'
import Question from '@/components/Question'
import { Avatar, Button, Card, Divider } from 'antd'
import Meta from 'antd/es/card/Meta'
import Paragraph from 'antd/es/typography/Paragraph'
import Title from 'antd/es/typography/Title'

/**
 * 题库详情页
 * @returns
 */
export default async function BankPage({ params }: { params: { questionBankId: string } }) {
  const { questionBankId } = params
  let bank = undefined
  try {
    const res = await getQuestionBankVoByIdUsingGet({
      id: Number(questionBankId),
      needQueryQuestionList: true,
      // pageSize: 200,
    })
    console.log(res, 'res')
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

  // 获取到第一条数据
  let firstQuestionId
  if (bank.questionPage?.records && bank.questionPage.records.length > 0) {
    firstQuestionId = bank.questionPage.records[0].id
  }

  return (
    <div id="banksPage" className=" max-width-content p-4 w-[1200px]">
      <Card variant="borderless">
        <Meta
          style={{ marginBottom: 0 }}
          avatar={<Avatar src={bank.picture} size={72} />}
          title={<Title level={3}>{bank.title}</Title>}
          description={
            <>
              <Paragraph>{bank.description}</Paragraph>
              <Button type="primary" href={`/bank/${questionBankId}/question/${firstQuestionId}`} target="_blank" disabled={!firstQuestionId}>
                开始刷题
              </Button>
            </>
          }
        />
      </Card>

      <Divider />
      <Question questionBankId={questionBankId} questionList={bank.questionPage.records} cardTitle={`题目列表 (${bank.questionPage.total}) `} />
    </div>
  )
}
