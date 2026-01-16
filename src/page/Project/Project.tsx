import { Link, useParams } from 'react-router-dom'
import styles from './index.module.less'
import BrandIcon from '../../components/BrandIcons/BrandIcons'
import { detectBrandFromLink } from '../../utils/brandLink'

type ProjectConfig = {
    slug: string
    name: string
    description: string
    repoUrl?: string
    liveUrl?: string
    embedUrl?: string
}

const projects: ProjectConfig[] = [
    {
        slug: 'my-notebook',
        name: 'My Notebook（移动端）',
        description: '移动端笔记应用：登录/注册、笔记分类、列表、详情与发布。',
        repoUrl: 'https://gitee.com/liu-chefeng/my-notebook',
        liveUrl: 'http://8.140.243.124:5173/login',
        embedUrl: 'http://8.140.243.124:5173/login',
    },
]

export default function Project() {
    const { slug } = useParams()
    const project = projects.find((p) => p.slug === slug)

    if (!project) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <div className={styles.headerInner}>
                        <Link className={styles.backLink} to="/personal-website/home#projects">← 返回</Link>
                    </div>
                </header>
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.stateBox}>项目不存在</div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link className={styles.backLink} to="/personal-website/home#projects">← 返回</Link>
                    <div className={styles.headerActions}>
                        {project.repoUrl ? (
                            <a className={styles.actionLink} href={project.repoUrl} target="_blank" rel="noreferrer">
                                {(() => {
                                    const brand = detectBrandFromLink({ url: project.repoUrl })
                                    return brand ? <BrandIcon className={styles.actionIcon} name={brand} /> : null
                                })()}
                                <span>仓库</span>
                            </a>
                        ) : null}
                        {project.liveUrl ? (
                            <a className={styles.actionLink} href={project.liveUrl} target="_blank" rel="noreferrer">在线预览</a>
                        ) : null}
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.hero}>
                        <h1 className={styles.title}>{project.name}</h1>
                        <p className={styles.subtitle}>{project.description}</p>
                    </section>

                    <section className={styles.stage}>
                        <div className={styles.device}>
                            <div className={styles.deviceTop} />
                            <div className={styles.viewport}>
                                {project.embedUrl ? (
                                    <iframe
                                        className={styles.iframe}
                                        src={project.embedUrl}
                                        title={project.name}
                                        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                                        allow="clipboard-read; clipboard-write; fullscreen"
                                    />
                                ) : (
                                    <div className={styles.stateBox}>暂无可嵌入的预览地址</div>
                                )}
                            </div>
                        </div>
                        <aside className={styles.side}>
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>功能梳理</div>
                                <ul className={styles.list}>
                                    <li>登录 / 注册</li>
                                    <li>笔记分类（入口：/noteClass）</li>
                                    <li>笔记列表（/noteList）</li>
                                    <li>笔记详情（/noteDetail）</li>
                                    <li>发布/新增笔记（/notePublish）</li>
                                </ul>
                            </div>
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>说明</div>
                                <div className={styles.note}>
                                    如果你的站点部署在 HTTPS（例如 GitHub Pages），浏览器会阻止在 HTTPS 页面里嵌入 HTTP 的 iframe（混合内容）。
                                    这种情况下请使用“在线预览”按钮在新窗口打开，或给预览站点加 HTTPS。
                                </div>
                            </div>
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    )
}
