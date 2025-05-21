'use client'
import { Button, Card, List } from 'antd'
import './index.css'
import TagList from '../TagList'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Title from 'antd/es/typography/Title'
import MdViewer from '../MdViewer'
import useAddUserSignInRecord from '@/hooks/useAddUserSignInRecord'

interface Props {
  questionBankId?: number
  questionId?: number
  questionList?: API.QuestionVO[]
  cardTitle?: string
}

/**
 * Markdown 浏览器
 * @param props
 * @constructor
 */
const QuestionCard = (props: Props) => {
  const { questionBankId, questionId, questionList, cardTitle } = props
  const question = questionList?.find(item => item.id == questionId)
  const [showAnswer, setShowAnswer] = useState(true)

  // useEffect(() => {
  useAddUserSignInRecord()
  // }, [])
  return (
    <div className="question-card">
      <Card
        title={
          <div className="mb-2 p-2">
            <Title level={2}>{question?.title}</Title>
            <TagList tags={question?.tagList} />
          </div>
        }
        extra={<Button onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? '隐藏' : '显示'}答案</Button>}
      >
        <div className="question-content">
          <div className="text-xl my-4">{question?.content}</div>
        </div>
      </Card>

      <Card title="推荐答案" className="question-answer !mt-4 ">
        <div>
          {showAnswer ? (
            <MdViewer value={question?.answer} />
          ) : (
            <div className="h-[400px] flex justify-center items-center">
              <div className="flex flex-col justify-center items-center gap-2">
                <Image src="/assets/eye-slash.png" alt="eye-slash" width={48} height={48} />
                <Button type="primary" onClick={() => setShowAnswer(true)}>
                  显示答案
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default QuestionCard
