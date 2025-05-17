'use client'

export default function TailwindTest() {
  return (
    <div className="p-4 m-4 border border-blue-500 rounded">
      <h2 className="text-xl font-bold text-red-500">Tailwind测试</h2>
      <div className="flex justify-center items-center flex-col bg-gray-100 p-4 mt-2">
        <p className="text-green-500">这是一个居中的列布局</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700">测试按钮</button>
      </div>
    </div>
  )
}
