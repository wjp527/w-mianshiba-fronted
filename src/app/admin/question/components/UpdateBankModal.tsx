import { RootState } from '@/stores'
import { updateQuestionUsingPost } from '../../../../api/questionController'
import { ProColumns, ProTable } from '@ant-design/pro-components'

import { Form, message, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getQuestionBankVoByIdUsingGet, listQuestionBankByPageUsingPost } from '@/api/questionBankController'
import { addQuestionBankQuestionUsingPost, listQuestionBankQuestionByPageUsingPost, removeQuestionBankQuestionUsingPost, updateQuestionBankQuestionUsingPost } from '@/api/questionBankQuestionController'
import { QuestionOutlined } from '@ant-design/icons'

interface Props {
  questionId?: number
  tags?: string[]
  visible: boolean
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
const UpdateBankModal: React.FC<Props> = props => {
  const { questionId, visible, onCancel, tags } = props
  // 获取当前登录用户
  const loginUser = useSelector((state: RootState) => state.loginUser)

  const [form] = Form.useForm()
  const getCurrentQuestionBankIdList = async () => {
    const params = {
      pageSize: 30,
      questionId,
    }
    const res = await listQuestionBankQuestionByPageUsingPost(params)
    const list = (res.data.records ?? []).map(item => item.questionBankId)
    form.setFieldsValue({
      questionBankId: list,
    })
  }
  useEffect(() => {
    if (questionId) {
      getCurrentQuestionBankIdList()
    }
  }, [questionId])

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
      <Form form={form}>
        <Form.Item label="所属题库" name="questionBankId">
          <Select
            mode="multiple"
            // defaultValue={JSON.parse(tags as any)}
            options={questionBankList.map(questionBank => {
              return {
                label: questionBank.title,
                value: questionBank.id,
              }
            })}
            onSelect={async value => {
              const hide = message.loading('正在更新')
              try {
                await addQuestionBankQuestionUsingPost({
                  questionId,
                  questionBankId: value,
                })
                message.success('绑定成功')
                hide()
              } catch (error) {
                message.error('绑定失败: ' + error.message)
                hide()
              }
            }}
            onDeselect={async value => {
              const hide = message.loading('正在更新')
              try {
                await removeQuestionBankQuestionUsingPost({
                  questionId,
                  questionBankId: value,
                })
                message.success('移除成功')
                hide()
              } catch (error) {
                message.error('移除失败: ' + error.message)
                hide()
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default UpdateBankModal
