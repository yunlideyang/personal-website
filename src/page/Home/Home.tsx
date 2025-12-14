import { useEffect, useState } from 'react'
import styles from './index.module.less'
import testApi from '../../../api/testApi'
export default function Home() {
    const [data, setData] = useState<string>("开发者")
    useEffect(() => {
        testApi()
            .then((data: any) => setData(data.message))
    }, [])
    return (
        <div className={styles.home}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.greeting}>
                        <h1 className={styles.title}>你好，我是</h1>
                        <h2 className={styles.name}>{data}</h2>
                    </div>

                    <div className={styles.intro}>
                        <p className={styles.description}>
                            专注于创造优雅、高效的解决方案
                        </p>
                        <p className={styles.subDescription}>
                            用代码构建美好的数字世界
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <a href="#about" className={styles.button}>
                            了解更多
                        </a>
                        <a href="#contact" className={`${styles.button} ${styles.buttonSecondary}`}>
                            联系我
                        </a>
                    </div>
                </div>

                <div className={styles.decorative}>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                </div>
            </div>
        </div>
    )
}
