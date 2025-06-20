import { RootState } from '@/stores'
import { updateQuestionUsingPost } from '../../../../api/questionController'

import { Button, Form, message, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { listQuestionBankByPageUsingPost } from '@/api/questionBankController'
import { batchAddQuestionsToBankUsingPost } from '@/api/questionBankQuestionController'

interface Props {
  questionIdList?: number[]
  tags?: string[]
  visible: boolean
  onSubmit: () => void
  onCancel: () => void
}

let options: any[] = []

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.QuestionUpdateRequest) => {
  const hide = message.loading('正在更新')
  try {
    await updateQuestionUsingPost(fields)
    hide()
    message.success('更新成功')
    return true
  } catch (error: any) {
    hide()
    message.error('更新失败，' + error.message)
    return false
  }
}

/**
 * 更新题目所属题库弹窗
 * @param props
 * @constructor
 */
const BatchAddQuestionToBankModal: React.FC<Props> = props => {
  const { questionIdList, visible, onCancel, onSubmit } = props
  // 获取当前登录用户
  const loginUser = useSelector((state: RootState) => state.loginUser)

  const [form] = Form.useForm()

  // 获取题库列表
  const [questionBankList, setQuestionBankList] = useState<API.QuestionBankVO[]>([])
  const getQuestionBankList = async () => {
    const pageSize = 200
    try {
      const questionBankRes = await listQuestionBankByPageUsingPost({
        pageSize,
        sortField: 'createTime',
        sortOrder: 'descend',
      })
      setQuestionBankList(questionBankRes.data.records ?? [])
    } catch (error) {}
  }

  useEffect(() => {
    getQuestionBankList()
  }, [])

  const doSubmit = async (value: API.QuestionBankQuestionBatchAddRequest) => {
    const questionBankId = value.questionBankId
    const hide = message.loading('正在操作')
    if (!questionBankId) {
      return
    }
    try {
      let res = await batchAddQuestionsToBankUsingPost({
        questionIdList,
        questionBankId,
      })

      if (res.code == 0) {
        message.success('添加成功')
        onSubmit?.()
      }
    } catch (error) {
      console.log(error, 'error')
      message.error('添加失败')
    } finally {
      hide()
    }
  }

  return (
    <Modal
      destroyOnHidden
      title={'更新题库'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.()
      }}
    >
      <Form form={form} onFinish={doSubmit}>
        <Form.Item label="所属题库" name="questionBankId">
          <Select
            // defaultValue={JSON.parse(tags as any)}
            options={questionBankList.map(questionBank => {
              return {
                label: questionBank.title,
                value: questionBank.id,
              }
            })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default BatchAddQuestionToBankModal
