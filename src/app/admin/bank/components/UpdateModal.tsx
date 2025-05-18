import { RootState } from '@/stores'
import { updateQuestionBankUsingPost } from '../../../../api/questionBankController'
import { ProColumns, ProTable } from '@ant-design/pro-components'

import { message, Modal } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'

interface Props {
  oldData?: API.QuestionBank
  visible: boolean
  columns: ProColumns<API.QuestionBank>[]
  onSubmit: (values: API.QuestionBankAddRequest) => void
  onCancel: () => void
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.QuestionBankUpdateRequest) => {
  const hide = message.loading('正在更新')
  try {
    await updateQuestionBankUsingPost(fields)
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
  if (!oldData) {
    return <></>
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
          initialValues: oldData,
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
