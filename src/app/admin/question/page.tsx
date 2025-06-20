'use client'
import CreateModal from './components/CreateModal'
import UpdateModal from './components/UpdateModal'
import { batchRemoveQuestionsUsingPost, deleteQuestionUsingPost, listQuestionByPageUsingPost } from '../../../api/questionController'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProTable } from '@ant-design/pro-components'

import { Button, message, Popconfirm, PopconfirmProps, Select, Space, Table, Tag, Typography } from 'antd'
import React, { useRef, useState } from 'react'
import UploadPic from '@/components/UploadPic'
import PICTURE_ENUM from '@/constant/PictureEnum'
import REVIEW_ENUM, { REVIEW_ENUM_MAP, REVIEW_ENUM_OPTIONS } from '@/constant/REVIEWEnum'
import TagList from '@/components/TagList'
import MdEditor from '@/components/MdEditor'
import UpdateBankModal from './components/UpdateBankModal'
import BatchAddQuestionToBankModal from './components/BatchAddQuestionToBankModal'
import BatchRemoveQuestionToBankModal from './components/BatchRemoveQuestionToBankModal'

/**
 * 题目管理页面
 *
 * @constructor
 */
const QuestionAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  // 是否显示题目所属题库窗口
  const [updateBankModalVisible, setUpdateBankModalVisible] = useState<boolean>(false)
  const actionRef = useRef<ActionType>()
  // 当前题目点击的数据
  const [currentRow, setCurrentRow] = useState<API.Question>()
  // 是否显示批量添加题目到题库窗口
  const [batchAddQuestionToBankModalVisible, setBatchAddQuestionToBankModalVisible] = useState<boolean>(false)
  // 是否显示批量从题库移除题目窗口
  const [batchRemoveQuestionToBankModalVisible, setBatchRemoveQuestionToBankModalVisible] = useState<boolean>(false)
  // 选中的题目id列表
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete: PopconfirmProps['onConfirm'] = async (row: API.Question) => {
    const hide = message.loading('正在删除')
    if (!row) return true
    try {
      await deleteQuestionUsingPost({
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
   * 批量删除题目
   */
  const handleBatchDelete = async () => {
    const hide = message.loading('正在删除')
    try {
      const res = await batchRemoveQuestionsUsingPost({
        questionIdList: selectedRowKeys,
      })
      if (res.code == 0) {
        message.success('删除成功')
        actionRef.current?.reload()
      }
    } catch (error) {
      message.error('删除失败，' + error.message)
    } finally {
      hide()
    }
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.Question>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '所属题库',
      dataIndex: 'questionBankId',
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
    },

    {
      title: '标签',
      dataIndex: 'tags',
      valueType: 'select',
      // 专门为 valueType 为 select的列
      fieldProps: {
        mode: 'tags',
      },
      hideInSearch: true,
      // 表格渲染
      render: (_, record) => {
        const tags = record.tags ? JSON.parse(record.tags) : []
        return <TagList tags={tags} />
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return <MdEditor />
      },
    },
    {
      title: '答案',
      dataIndex: 'answer',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return <MdEditor />
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
          text: '通过',
        },
        2: {
          text: '拒绝',
        },
      },
      // 能否区分添加弹窗和修改弹窗，因为在弹窗弹窗不要显示，在修改弹窗显示
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return <Select options={REVIEW_ENUM_OPTIONS} placeholder="请选择审核状态" />
      },
    },
    {
      title: '浏览量',
      dataIndex: 'viewNum',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '点赞数',
      dataIndex: 'thumbNum',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '收藏数',
      dataIndex: 'favourNum',
      valueType: 'digit',
      hideInSearch: true,
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

          <Typography.Link
            onClick={() => {
              setCurrentRow(record)
              setUpdateBankModalVisible(true)
            }}
          >
            修改所属题库
          </Typography.Link>
          <Popconfirm title="是否要删除该题目" description="" onConfirm={() => handleDelete(record)} okText="Yes" cancelText="No">
            <Typography.Link type="danger">删除</Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  return (
    <PageContainer>
      <ProTable<API.Question>
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

          const { data, code } = await listQuestionByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.QuestionQueryRequest)

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          }
        }}
        columns={columns}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [1],
        }}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          setSelectedRowKeys(selectedRowKeys as number[])
          return (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          )
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Button
                onClick={() => {
                  setBatchAddQuestionToBankModalVisible(true)
                }}
              >
                批量向题库插入题目
              </Button>
              <Button
                onClick={() => {
                  setBatchRemoveQuestionToBankModalVisible(true)
                }}
              >
                批量从题库移除题目
              </Button>

              <Popconfirm title="确认删除" description="您确定要删除这些题目吗?" onConfirm={handleBatchDelete} onCancel={() => {}} okText="确认" cancelText="取消">
                <Button type="primary" danger>
                  批量删除题目
                </Button>
              </Popconfirm>
            </Space>
          )
        }}
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
      <UpdateBankModal
        questionId={currentRow?.id}
        tags={currentRow?.tags}
        visible={updateBankModalVisible}
        onCancel={() => {
          setUpdateBankModalVisible(false)
        }}
      />

      {/* 批量添加题目到题库 */}
      <BatchAddQuestionToBankModal
        questionIdList={selectedRowKeys}
        visible={batchAddQuestionToBankModalVisible}
        onSubmit={() => {
          setBatchAddQuestionToBankModalVisible(false)
          actionRef.current?.reload()
        }}
        onCancel={() => {
          setBatchAddQuestionToBankModalVisible(false)
        }}
      />

      {/* 批量移除题目到题库 */}
      <BatchRemoveQuestionToBankModal
        questionIdList={selectedRowKeys}
        visible={batchRemoveQuestionToBankModalVisible}
        onSubmit={() => {
          setBatchRemoveQuestionToBankModalVisible(false)
          // 让表格进行重新获取到新数据
          actionRef.current?.reload()
        }}
        onCancel={() => {
          setBatchRemoveQuestionToBankModalVisible(false)
        }}
      />
    </PageContainer>
  )
}
export default QuestionAdminPage
