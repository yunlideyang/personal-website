// import React from 'react'
import styles from './index.module.less'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
export default function Unfound() {
  const [time, setTime] = useState(4)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          navigate('/personal-website/home')
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [navigate])
  
  const handleGoHome = () => {
    navigate('/personal-website/home')
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>
          <span className={styles.number}>4</span>
          <span className={styles.zero}>0</span>
          <span className={styles.number}>4</span>
        </div>
        <div className={styles.icon}></div>
        <h1 className={styles.title}>页面未找到</h1>
        <p className={styles.description}>
          抱歉，您访问的页面不存在或已被移除
        </p>
        <div className={styles.timer}>
          {time} 秒后自动跳转到首页...
        </div>
        <button className={styles.homeButton} onClick={handleGoHome}>
          立即返回首页
        </button>
      </div>
    </div>
  )
}
