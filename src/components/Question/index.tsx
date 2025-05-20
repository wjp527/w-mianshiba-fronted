'use client'
import { Card, List } from 'antd'
import './index.css'
import TagList from '../TagList'
import Link from 'next/link'

interface Props {
  questionBankId?: number
  questionList?: API.QuestionVO[]
  cardTitle?: string
}

const { Meta } = Card
/**
 * Markdown 浏览器
 * @param props
 * @constructor
 */
const Question = (props: Props) => {
  const { questionBankId, questionList = [], cardTitle = '' } = props
  console.log(questionList, 'questionList')
  return (
    <div className="question-list">
      <Card title={cardTitle}>
        <List
          itemLayout="horizontal"
          dataSource={questionList}
          renderItem={(item, index) => (
            <List.Item extra={<TagList tags={item.tagList} />}>
              <List.Item.Meta title={<Link href={questionBankId ? `/bank/${questionBankId}/question/${item.id}` : `/question/${item.id}`}>{item.title}</Link>} description={item.content} />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default Question
