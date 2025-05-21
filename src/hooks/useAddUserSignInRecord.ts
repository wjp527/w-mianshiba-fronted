import { addUserSignInUsingPost } from "@/api/userController"
import { useEffect, useState } from "react"

const useAddUserSignInRecord = () => {
  // 声明loading状态和设置loading状态的方法
  const [loading, setLoading] = useState(false)
  const addUserSignIn = async () => {

    // 设置loading状态为true
    setLoading(true)
    try {
      // 调用addUserSignInUsingPost方法进行用户签到
      addUserSignInUsingPost()
      // 输出日志信息
      console.log(123)
    } catch (error) {
      // 捕获异常
    } finally {
      // 输出签到失败的信息
      console.log('签到失败')
      // 设置loading状态为false
      setLoading(false)
    }

  }
  useEffect(() => {
    addUserSignIn()
  }, [])
  return { loading }
}

export default useAddUserSignInRecord
