'use client'
import CreateModal from './components/CreateModal'
import UpdateModal from './components/UpdateModal'
import { deleteQuestionBankUsingPost, listQuestionBankByPageUsingPost } from '../../../api/questionBankController'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProTable } from '@ant-design/pro-components'

import { Button, message, Popconfirm, PopconfirmProps, Select, Space, Tag, Typography } from 'antd'
import React, { useRef, useState } from 'react'
import UploadPic from '@/components/UploadPic'
import PICTURE_ENUM from '@/constant/PictureEnum'
import REVIEW_ENUM, { REVIEW_ENUM_MAP, REVIEW_ENUM_OPTIONS } from '@/constant/REVIEWEnum'

/**
 * 题库管理页面
 *
 * @constructor
 */
const QuestionBankAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const actionRef = useRef<ActionType>()
  // 当前题库点击的数据
  const [currentRow, setCurrentRow] = useState<API.QuestionBank>()

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete: PopconfirmProps['onConfirm'] = async (row: API.QuestionBank) => {
    const hide = message.loading('正在删除')
    if (!row) return true
    try {
      await deleteQuestionBankUsingPost({
        id: row.id as any,
      })
      hide()
      message.success('删除成功')
      actionRef?.current?.reload()
      return true
    } catch (error: any) {
      hide()
      message.error('删除失败，' + error.message)
      return false
    }
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.QuestionBank>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'text',
    },
    {
      title: '头像',
      dataIndex: 'picture',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        //表单模式渲染【添加和修改】
        if (type === 'form') {
          return (
            <UploadPic
              initialImageUrl={form.getFieldValue('picture')}
              onChange={url => {
                form.setFieldsValue({ picture: url })
              }}
              biz={PICTURE_ENUM.USER_AVATAR}
            />
          )
        }
        // 表格模式渲染
        return defaultRender(_)
      },
    },
    {
      title: '状态',
      dataIndex: 'reviewStatus',
      valueEnum: {
        0: {
          text: '待审核',
        },
        1: {
          text: '审核通过',
        },
        2: {
          text: '审核不通过',
        },
      },
      // 能否区分添加弹窗和修改弹窗，因为在弹窗弹窗不要显示，在修改弹窗显示
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return <Select options={REVIEW_ENUM_OPTIONS} placeholder="请选择审核状态" />
      },
    },
    {
      title: '审核人id',
      dataIndex: 'reviewerId',
      valueType: 'text',
      hideInSearch: true,
      // 输入框禁用
      fieldProps: {
        disabled: true,
      },
      // 能否区分添加弹窗和修改弹窗，因为在弹窗弹窗不要显示，在修改弹窗显示
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        // 修改弹窗展示该信息
        if (type === 'form' && updateModalVisible) {
          return defaultRender(_)
        }
        return null
      },
    },
    {
      title: '审核时间',
      dataIndex: 'reviewTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '审核信息',
      dataIndex: 'reviewMessage',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '编辑时间',
      sorter: true,
      dataIndex: 'editTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record)
              setUpdateModalVisible(true)
            }}
          >
            修改
          </Typography.Link>
          {/* onConfirm={handleDelete(record)} */}

          <Popconfirm title="是否要删除该题库" description="" onConfirm={() => handleDelete(record)} okText="Yes" cancelText="No">
            <Typography.Link type="danger">删除</Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  return (
    <PageContainer>
      <ProTable<API.QuestionBank>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true)
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        /**
         * 触发刷新的场景
         * 1. 组件初始化
         * 2. 分页参数变化
         * 3. 排序条件变化
         * 4. 过滤条件变化
         * 5. 手动刷新
         */
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0]
          const sortOrder = sort?.[sortField] ?? undefined

          const { data, code } = await listQuestionBankByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.QuestionBankQueryRequest)

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          }
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false)
          actionRef.current?.reload()
        }}
        onCancel={() => {
          setCreateModalVisible(false)
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false)
          setCurrentRow(undefined)
          actionRef.current?.reload()
        }}
        onCancel={() => {
          setUpdateModalVisible(false)
        }}
      />
    </PageContainer>
  )
}
export default QuestionBankAdminPage
