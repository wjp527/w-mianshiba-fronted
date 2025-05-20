// 'use client'
import Search from 'antd/es/input/Search'
import { useRouter } from 'next/navigation'
const SearchInput = () => {
  const router = useRouter()
  return (
    <div
      className="search-input"
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        marginInlineEnd: 24,
      }}
    >
      <Search
        placeholder="搜索题目"
        onSearch={value => {
          router.push(`/questions?q=${value}`)
        }}
      />
    </div>
  )
}

export default SearchInput
