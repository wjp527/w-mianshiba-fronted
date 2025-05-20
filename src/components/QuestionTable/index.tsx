'use client'
import { deleteQuestionUsingPost, listQuestionByPageUsingPost, listQuestionVoByPageUsingPost } from '../../api/questionController'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProTable } from '@ant-design/pro-components'

import { Button, message, Popconfirm, PopconfirmProps, Select, Space, Tag, Typography } from 'antd'
import React, { useRef, useState } from 'react'
import UploadPic from '@/components/UploadPic'
import PICTURE_ENUM from '@/constant/PictureEnum'
import REVIEW_ENUM, { REVIEW_ENUM_MAP, REVIEW_ENUM_OPTIONS } from '@/constant/REVIEWEnum'
import TagList from '@/components/TagList'
import MdEditor from '@/components/MdEditor'
import Link from 'next/link'

interface Props {
  // 默认数据
  defaultQuestionList?: API.QuestionVO[]
  defaultTotal?: number
  defaultSearchParams?: API.QuestionQueryRequest
}
/**
 * 题目表格组件
 *
 * @constructor
 */
const QuestionTable: React.FC = (props: Props) => {
  const { defaultQuestionList, defaultTotal, defaultSearchParams } = props

  const actionRef = useRef<ActionType>()
  // 当前题目点击的数据
  const [currentRow, setCurrentRow] = useState<API.Question>()

  const [questionList, setQuestionList] = useState<API.QuestionVO[]>(defaultQuestionList || [])
  let [total, setTotal] = useState<number>(defaultTotal || 0)

  // 获取首次加载
  const [init, setInit] = useState<boolean>(true)

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.Question>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      render: (_, record) => {
        return <Link href={`/question/${record.id}`}>{record.title}</Link>
      },
    },
    {
      title: '标签',
      dataIndex: 'tagList',
      valueType: 'select',
      // 专门为 valueType 为 select的列
      fieldProps: {
        mode: 'tags',
      },
      // hideInSearch: true,
      // 表格渲染
      render: (_, record) => {
        const tags = record.tagList || []
        return <TagList tags={tags} />
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
  ]
  return (
    <div className="question-table max-width-content">
      <ProTable<API.Question>
        actionRef={actionRef}
        rowKey="id"
        size="large"
        search={{
          labelWidth: 120,
          // filterType: 'light',
        }}
        form={{
          initialValues: {
            title: defaultSearchParams?.title || '',
          },
        }}
        // 默认表格数据
        dataSource={questionList}
        pagination={{
          pageSize: 12,
          showTotal: (total, range) => `总共${total}道题目`,
          total: total,
          // showSizeChanger: true,
        }}
        /**
         * 触发刷新的场景
         * 1. 组件初始化
         * 2. 分页参数变化
         * 3. 排序条件变化
         * 4. 过滤条件变化
         * 5. 手动刷新
         */
        request={async (params, sort, filter) => {
          // 首次请求
          if (init) {
            setInit(false)
            // 如果外层已经传来了默认值，不需要再次请求了
            if (defaultQuestionList && defaultTotal) {
              return
            }
          }
          const sortField = Object.keys(sort)?.[0] || 'createTime'
          const sortOrder = sort?.[sortField] || 'desc'

          const { data, code } = await listQuestionVoByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.QuestionQueryRequest)

          const newData = data?.records || []
          // newData.forEach(item => {
          //   item.tags = JSON.stringify(item.tagList)
          // })
          const total = data?.total || 0
          setQuestionList(newData)
          setTotal(total)

          return {
            success: code === 0,
            data: questionList,
            total: total,
          }
        }}
        columns={columns}
      />
    </div>
  )
}
export default QuestionTable
