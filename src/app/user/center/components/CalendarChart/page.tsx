'use client' // 客户端渲染
import React, { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'

import './index.css'
import dayjs from 'dayjs'
import { getUserSignInRecordUsingPost } from '@/api/userController'
import { message } from 'antd'
/**
 * 刷题记录页面组件
 *
 * @returns 返回用户中心页面的 JSX 元素
 */
const CalendarChart: React.FC = () => {
  const CalendarChart = useRef<HTMLDivElement>(null)

  // 签到日期列表[1,200] 表示 第1 和 第 200 天有签到记录
  const [dataList, setDataList] = useState<number[]>([])

  const getUserSignInRecord = async () => {
    try {
      let res = await getUserSignInRecordUsingPost()
      console.log(res, 'res')
      if (res.code === 0) {
        setDataList(res.data)
      }
    } catch (error) {
      message.error('获取签到记录失败')
    }
  }
  useEffect(() => {
    getUserSignInRecord()
  }, [])
  // 计算图标所需的数据
  const year = new Date().getFullYear()
  const optionData = dataList.map(dasyOfYear => {
    console.log(dasyOfYear, 'dasyOfYear')
    // 计算日期字符串
    const dataStr = dayjs(`${year}-01-01`)
      .add(dasyOfYear - 1, 'day')
      .format('YYYY-MM-DD')
    console.log(dataStr, 'dataStr')
    return [dataStr, 1]
  })

  const option = {
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        // 颜色从灰色到浅绿色
        color: ['#efefef', 'lightgreen'],
      },
    },
    tooltip: {
      position: 'top',
      formatter: '{c}',
    },
    calendar: {
      range: year,
      left: 20,
      cellSize: ['auto', 16],
      yearLabel: {
        position: 'top',
        formatter: `${year} 年刷题记录`,
      },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: optionData,
    },
  }

  return (
    <div className="CalendarChart" ref={CalendarChart}>
      <ReactECharts option={option} />
    </div>
  )
}
export default CalendarChart
