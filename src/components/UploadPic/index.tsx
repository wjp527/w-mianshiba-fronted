import React, { useState, useEffect } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Flex, message, Upload } from 'antd'
import type { GetProp, UploadProps } from 'antd'
import { uploadFileUsingPost } from '@/api/fileController'
import PICTURE_ENUM from '@/constant/PictureEnum'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

/**
 * 图片上传
 */
interface UploadPicProps {
  initialImageUrl?: string
  onChange?: (url: string) => void
  circle?: boolean
  biz?: string // 业务类型
}

/**
 * 生成base64
 * @param img 图片文件
 * @param callback 回调函数
 */
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

/**
 * 校验文件
 * @param file 图片文件
 * @returns
 */
const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('您只能上传JPG/PNG格式的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于2MB!')
  }
  return isJpgOrPng && isLt2M
}

/**
 * 上传文件
 * @param param0
 * @returns
 */
const UploadPic: React.FC<UploadPicProps> = ({ initialImageUrl, onChange, circle = false, biz = PICTURE_ENUM.USER_AVATAR }) => {
  // 加载
  const [loading, setLoading] = useState(false)
  // 图片路径
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl)

  useEffect(() => {
    setImageUrl(initialImageUrl)
  }, [initialImageUrl])

  // 自定义上传函数
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options
    setLoading(true)

    try {
      // 调用上传文件接口
      const res = await uploadFileUsingPost(
        { biz }, // 参数
        {}, // body
        file // 文件
      )

      // 类型断言处理响应
      if (res && res.code === 0) {
        const fileUrl = res.data // 服务器返回的文件URL
        setImageUrl(fileUrl)
        setLoading(false)
        message.success('上传成功')
        // 调用父组件的onChange方法
        if (onChange) {
          onChange(fileUrl)
        }
        onSuccess(res, file)
      } else {
        throw new Error(res?.message || '上传失败')
      }
    } catch (error: any) {
      setLoading(false)
      message.error(`上传失败: ${error.message}`)
      onError(error)
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </button>
  )

  return (
    <Upload name="file" listType={circle ? 'picture-circle' : 'picture-card'} className="avatar-uploader" showUploadList={false} beforeUpload={beforeUpload} customRequest={customUpload}>
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  )
}

export default UploadPic
