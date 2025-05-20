import { Tag } from 'antd'
import './index.css'

interface Props {
  tags?: string[]
}

/**
 * Markdown 浏览器
 * @param props
 * @constructor
 */
const TagList = (props: Props) => {
  const { tags = [] } = props

  return (
    <div className="md-viewer">
      {tags?.map((tag: string) => (
        <Tag color="blue" key={tag}>
          {tag}
        </Tag>
      ))}
    </div>
  )
}

export default TagList
