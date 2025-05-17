// 默认服务端渲染

import React from 'react'
import Link from 'next/link'
/**
 * 全局底部栏组件
 * @returns React.FC<{}> 返回一个函数组件类型，该组件接收一个空对象作为props参数。

 */
export default function GlobalFooter() {
  const currentYear = new Date().getFullYear()
  return (
    <div className="global-footer flex justify-center items-center flex-col">
      <div>© {currentYear} 面试刷题平台</div>
      <div>备案号 苏ICP备2025155289号-1</div>
      <Link href="https://github.com/wjp527" target="_blank">
        wjp
      </Link>
    </div>
  )
}
