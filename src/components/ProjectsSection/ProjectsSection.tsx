import { Link } from 'react-router-dom'
import styles from './ProjectsSection.module.less'
import BrandIcon from '../BrandIcons/BrandIcons'
import { detectBrandFromLink } from '../../utils/brandLink'

type Project = {
    name: string
    description: string
    highlights: string[]
    stack: string[]
    links: { label: string, url: string }[]
}

const projects: Project[] = [
    {
        name: 'My Notebook（移动端）',
        description: '移动端笔记应用：登录/注册、笔记分类、列表、详情与发布。',
        highlights: ['登录/注册流程', '笔记分类与列表', '发布/新增与详情页'],
        stack: ['React', 'Vite', 'React Router'],
        links: [
            { label: '项目页', url: '/personal-website/project/my-notebook' },
            { label: '在线预览', url: 'http://8.140.243.124:5173/login' },
            { label: '仓库', url: 'https://gitee.com/liu-chefeng/my-notebook' },
        ],
    },
    {
        name: 'Dashboard Demo',
        description: '一个数据看板 Demo，演示布局、卡片、列表与交互模式。',
        highlights: ['响应式布局', '列表/筛选', '可复用卡片组件'],
        stack: ['React', 'TypeScript'],
        links: [
            { label: 'GitHub', url: 'https://github.com/' },
        ],
    },
    {
        name: 'API Client Toolkit',
        description: '一个请求层封装示例，用统一方式处理错误与返回值。',
        highlights: ['统一拦截器', '错误收敛', '易测可替换'],
        stack: ['Axios', 'TypeScript'],
        links: [
            { label: '文档', url: 'https://github.com/' },
        ],
    },
]

function hashToIndex(input: string, mod: number) {
    let hash = 0
    for (let i = 0; i < input.length; i += 1) {
        hash = (hash * 31 + input.charCodeAt(i)) | 0
    }
    return Math.abs(hash) % mod
}

function getShellClass(name: string) {
    const idx = hashToIndex(name, 3)
    if (idx === 0) return styles.shellA
    if (idx === 1) return styles.shellB
    return styles.shellC
}

export default function ProjectsSection() {
    return (
        <section id="projects" className={styles.section}>
            <header className={styles.sectionHeader}>
                <h2 className={styles.title}>项目</h2>
                <p className={styles.subtitle}>先用假数据占位，后续替换为真实项目</p>
            </header>

            <div className={styles.grid}>
                {projects.map((p) => (
                    <div key={p.name} className={`${styles.cardWrap} ${getShellClass(p.name)}`}>
                        <article className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>{p.name}</h3>
                                <div className={styles.stack}>
                                    {p.stack.map((s) => (
                                        <span key={s} className={styles.tag}>{s}</span>
                                    ))}
                                </div>
                            </div>
                            <p className={styles.description}>{p.description}</p>
                            <ul className={styles.highlights}>
                                {p.highlights.map((h) => (
                                    <li key={h} className={styles.highlight}>{h}</li>
                                ))}
                            </ul>
                            <div className={styles.links}>
                                {p.links.map((l) => (
                                    l.url.startsWith('/personal-website/') ? (
                                        <Link key={l.label} className={styles.link} to={l.url}>
                                            <span>{l.label}</span>
                                        </Link>
                                    ) : (
                                        <a key={l.label} className={styles.link} href={l.url} target="_blank" rel="noreferrer">
                                            {(() => {
                                                const brand = detectBrandFromLink(l)
                                                return brand ? <BrandIcon className={styles.linkIcon} name={brand} /> : null
                                            })()}
                                            <span>{l.label}</span>
                                        </a>
                                    )
                                ))}
                            </div>
                        </article>
                    </div>
                ))}
            </div>
        </section>
    )
}
