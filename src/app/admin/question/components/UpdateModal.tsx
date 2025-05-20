import { RootState } from '@/stores'
import { updateQuestionUsingPost } from '../../../../api/questionController'
import { ProColumns, ProTable } from '@ant-design/pro-components'

import { message, Modal } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'

interface Props {
  oldData?: API.Question
  visible: boolean
  columns: ProColumns<API.Question>[]
  onSubmit: (values: API.QuestionAddRequest) => void
  onCancel: () => void
}

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
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = props => {
  const { oldData, visible, columns, onSubmit, onCancel } = props
  // 获取当前登录用户
  const loginUser = useSelector((state: RootState) => state.loginUser)
  if (!oldData?.id) {
    return <></>
  }

  // 表单转换
  const initValues = { ...oldData }
  if (oldData.tags && oldData.tags.length > 0) {
    initValues.tags = JSON.parse(oldData.tags || '[]')
  }

  return (
    <Modal
      destroyOnHidden
      title={'更新'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.()
      }}
    >
      <ProTable
        type="form"
        columns={columns}
        form={{
          initialValues: initValues,
        }}
        onSubmit={async (values: API.QuestionUpdateRequest) => {
          const success = await handleUpdate({
            ...values,
            id: oldData.id as any,
            reviewerId: loginUser.id,
            reviewTime: new Date(),
          })
          if (success) {
            onSubmit?.(values)
          }
        }}
      />
    </Modal>
  )
}
export default UpdateModal
