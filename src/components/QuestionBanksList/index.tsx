'use client'
import { Avatar, Card, Col, List, Row, Tag, Typography } from 'antd'
import './index.css'
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { SettingOutlined } from '@ant-design/icons'
import Link from 'next/link'

interface Props {
  questionBanksList?: API.QuestionBankVO[]
}

const { Meta } = Card
/**
 * Markdown 浏览器
 * @param props
 * @constructor
 */
const QuestionBanksList = (props: Props) => {
  const { questionBanksList = [] } = props
  const questionBankView = (questionBank: API.QuestionBankVO) => {
    return (
      <Card>
        <Link href={`/bank/${questionBank.id}`}>
          <Card.Meta style={{ marginBottom: 0 }} avatar={<Avatar src={questionBank.picture} />} title={questionBank.title} description={<Typography.Paragraph ellipsis={{ rows: 1, tooltip: true }}>{questionBank.description}</Typography.Paragraph>} />
        </Link>
      </Card>
    )
  }

  return (
    <div className="question-banks-list">
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          column: 4,
        }}
        dataSource={questionBanksList}
        renderItem={item => <List.Item>{questionBankView(item)}</List.Item>}
      />
    </div>
  )
}

export default QuestionBanksList
