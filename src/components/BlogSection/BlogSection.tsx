import styles from './BlogSection.module.less'
import { Link } from 'react-router-dom'
import { normalizeDisplayTitle } from '../../utils/blogTitle'
import BrandIcon from '../BrandIcons/BrandIcons'

export type BlogPost = {
    title: string
    publishedText?: string
    tags?: readonly string[]
    url: string
}

export default function BlogSection(props: { posts: readonly BlogPost[], profileUrl: string }) {
    const { posts, profileUrl } = props
    const getArticleId = (url: string) => {
        const match = url.trim().replace(/^`+|`+$/g, '').match(/\/post\/(\d+)/)
        return match?.[1] || null
    }
    return (
        <section id="blog" className={styles.section}>
            <header className={styles.sectionHeader}>
                <h2 className={styles.title}>博客</h2>
                <div className={styles.headerRight}>
                    <a className={styles.profileLink} href={profileUrl} target="_blank" rel="noreferrer">
                        <BrandIcon className={styles.profileIcon} name="juejin" />
                        查看全部文章
                    </a>
                </div>
            </header>

            <div className={styles.list}>
                {posts.map((p) => {
                    const articleId = getArticleId(p.url)
                    const key = `${p.url}|${p.title}`
                    const Item = articleId ? (
                        <div key={key} className={styles.itemWrap}>
                            <Link
                                className={styles.item}
                                to={`/personal-website/blog/${articleId}`}
                                state={{
                                    title: normalizeDisplayTitle(p.title),
                                    publishedText: p.publishedText || '',
                                    tags: p.tags || [],
                                }}
                            >
                                <div className={styles.itemMain}>
                                    <div className={styles.itemTitle}>{normalizeDisplayTitle(p.title)}</div>
                                    <div className={styles.itemMeta}>
                                        {p.publishedText ? <span className={styles.metaText}>{p.publishedText}</span> : null}
                                        {p.tags?.length ? (
                                            <span className={styles.metaTags}>
                                                {p.tags.map((t) => (
                                                    <span key={t} className={styles.tag}>{t}</span>
                                                ))}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={styles.arrow}>→</div>
                            </Link>
                        </div>
                    ) : (
                        <div key={key} className={styles.itemWrap}>
                            <a className={styles.item} href={p.url} target="_blank" rel="noreferrer">
                                <div className={styles.itemMain}>
                                    <div className={styles.itemTitle}>{normalizeDisplayTitle(p.title)}</div>
                                    <div className={styles.itemMeta}>
                                        {p.publishedText ? <span className={styles.metaText}>{p.publishedText}</span> : null}
                                        {p.tags?.length ? (
                                            <span className={styles.metaTags}>
                                                {p.tags.map((t) => (
                                                    <span key={t} className={styles.tag}>{t}</span>
                                                ))}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={styles.arrow}>→</div>
                            </a>
                        </div>
                    )
                    return Item
                })}
            </div>
        </section>
    )
}
