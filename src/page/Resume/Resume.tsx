import { Link } from 'react-router-dom'
import styles from './index.module.less'
import { resume } from '../../data/resume'
import { useEffect, useMemo, useState } from 'react'
import { getJuejinPosts, type BlogPost } from '../../../api/juejinBlogApi'
import { getOrFetchCached } from '../../utils/cache'
import { extractJuejinArticleIdFromUrl } from '../../utils/juejin'
import { normalizeDisplayTitle } from '../../utils/blogTitle'
import BrandIcon from '../../components/BrandIcons/BrandIcons'
import { detectBrandFromLink } from '../../utils/brandLink'

export default function Resume() {
    const [juejinPosts, setJuejinPosts] = useState<BlogPost[]>([])
    const [juejinLoading, setJuejinLoading] = useState(false)

    useEffect(() => {
        let cancelled = false
        setJuejinLoading(true)
        getOrFetchCached({
            key: 'juejin:posts:limit=3',
            maxAgeMs: 12 * 60 * 60 * 1000,
            fetcher: async () => {
                const res = await getJuejinPosts({ cursor: '0', limit: 3 })
                return res.list
            },
        })
            .then((res) => {
                if (cancelled) return
                setJuejinPosts(Array.isArray(res.value) ? res.value : [])
            })
            .catch(() => {
                if (cancelled) return
                setJuejinPosts([])
            })
            .finally(() => {
                if (cancelled) return
                setJuejinLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [])

    const juejinLinks = useMemo(() => {
        return juejinPosts.map((p) => {
            const articleId = extractJuejinArticleIdFromUrl(p.url)
            return { post: p, articleId }
        })
    }, [juejinPosts])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link className={styles.backLink} to="/personal-website/home#resume">← 返回</Link>
                    <div className={styles.headerActions}>
                        {resume.links.map((l) => (
                            <a key={l.label} className={styles.actionLink} href={l.url} target="_blank" rel="noreferrer">
                                {(() => {
                                    const brand = detectBrandFromLink(l)
                                    return brand ? <BrandIcon className={styles.actionIcon} name={brand} /> : null
                                })()}
                                <span>{l.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.hero}>
                        <h1 className={styles.title}>{resume.basic.name}</h1>
                        <div className={styles.subline}>
                            <span>{resume.basic.intention}</span>
                            <span className={styles.dot}>·</span>
                            <span>{resume.basic.gender}</span>
                        </div>
                        <div className={styles.contact}>
                            <span>{resume.basic.phone}</span>
                            <span className={styles.dot}>·</span>
                            <span>{resume.basic.email}</span>
                        </div>
                    </section>

                    <section className={styles.grid}>
                        <div className={styles.block}>
                            <div className={styles.blockTitle}>专业技能</div>
                            <ul className={styles.list}>
                                {resume.skills.map((s) => (
                                    <li key={s}>{s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.block}>
                            <div className={styles.blockTitle}>个人博客</div>
                            <div className={styles.pills}>
                                {resume.links.map((l) => (
                                    <a key={l.label} className={styles.pill} href={l.url} target="_blank" rel="noreferrer">
                                        {(() => {
                                            const brand = detectBrandFromLink(l)
                                            return brand ? <BrandIcon className={styles.pillIcon} name={brand} /> : null
                                        })()}
                                        <span>{l.label}</span>
                                    </a>
                                ))}
                            </div>
                            {juejinLoading ? (
                                <div className={styles.blogHint}>加载中…</div>
                            ) : juejinLinks.length ? (
                                <ul className={styles.blogList}>
                                    {juejinLinks.map(({ post, articleId }) => (
                                        <li key={`${post.url}|${post.title}`} className={styles.blogItem}>
                                            {articleId ? (
                                                <Link
                                                    className={styles.blogLink}
                                                    to={`/personal-website/blog/${articleId}`}
                                                    state={{
                                                        title: normalizeDisplayTitle(post.title),
                                                        publishedText: post.publishedText || '',
                                                        tags: post.tags || [],
                                                    }}
                                                >
                                                    {normalizeDisplayTitle(post.title)}
                                                </Link>
                                            ) : (
                                                <a className={styles.blogLink} href={post.url} target="_blank" rel="noreferrer">
                                                    {normalizeDisplayTitle(post.title)}
                                                </a>
                                            )}
                                            {post.publishedText ? <div className={styles.blogMeta}>{post.publishedText}</div> : null}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionTitle}>工作经历</div>
                        <div className={styles.cards}>
                            {resume.work.map((w) => (
                                <article key={`${w.company}-${w.period}`} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>
                                            <div className={styles.company}>{w.company}</div>
                                            <div className={styles.role}>{w.role}</div>
                                        </div>
                                        <div className={styles.period}>{w.period}</div>
                                    </div>
                                    <div className={styles.summary}>{w.summary}</div>
                                    <div className={styles.subCards}>
                                        {w.items.map((it) => (
                                            <section key={it.name} className={styles.subCard}>
                                                <div className={styles.subHeader}>
                                                    <div className={styles.subName}>{it.name}</div>
                                                </div>
                                                <div className={styles.subDesc}>{it.description}</div>
                                                <div className={styles.tags}>
                                                    {it.stack.map((t) => (
                                                        <span key={t} className={styles.tag}>{t}</span>
                                                    ))}
                                                </div>
                                                <ul className={styles.list}>
                                                    {it.highlights.map((h) => (
                                                        <li key={h}>{h}</li>
                                                    ))}
                                                </ul>
                                            </section>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionTitle}>项目经历</div>
                        <div className={styles.cards}>
                            {resume.projects.map((p) => (
                                <article key={`${p.name}-${p.period}`} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>
                                            <div className={styles.company}>{p.name}</div>
                                            <div className={styles.role}>{p.description}</div>
                                        </div>
                                        <div className={styles.period}>{p.period}</div>
                                    </div>
                                    <div className={styles.tags}>
                                        {p.stack.map((t) => (
                                            <span key={t} className={styles.tag}>{t}</span>
                                        ))}
                                    </div>
                                    <ul className={styles.list}>
                                        {p.highlights.map((h) => (
                                            <li key={h}>{h}</li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionTitle}>教育经历</div>
                        <article className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitle}>
                                    <div className={styles.company}>{resume.education.school}</div>
                                    <div className={styles.role}>{resume.education.degree} · {resume.education.major}</div>
                                </div>
                                <div className={styles.period}>{resume.education.period}</div>
                            </div>
                            <div className={styles.tags}>
                                {resume.education.courses.map((c) => (
                                    <span key={c} className={styles.tag}>{c}</span>
                                ))}
                            </div>
                        </article>
                    </section>
                </div>
            </main>
        </div>
    )
}
