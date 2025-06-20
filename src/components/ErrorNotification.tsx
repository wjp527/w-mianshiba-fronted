'use client'

import { useEffect } from 'react'
import { message } from 'antd'

export default function ErrorNotification({ error }: { error?: string }) {
  useEffect(() => {
    if (error) {
      message.error(error)
    }
  }, [error])

  return null
}
