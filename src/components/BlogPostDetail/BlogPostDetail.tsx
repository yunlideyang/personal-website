import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getJuejinPostDetail, type BlogPostDetailResponse } from '../../../api/juejinBlogApi'
import { normalizeDisplayTitle, resolvePostTitle } from '../../utils/blogTitle'
import styles from './BlogPostDetail.module.less'
import BrandIcon from '../BrandIcons/BrandIcons'

function sanitizeHtml(html: string) {
    try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        const blockedTags = new Set(['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base'])
        const allowedUrlSchemes = new Set(['http:', 'https:', 'mailto:', 'tel:'])

        const elements = Array.from(doc.body.querySelectorAll('*'))
        for (const el of elements) {
            const tag = el.tagName.toLowerCase()
            if (blockedTags.has(tag)) {
                el.remove()
                continue
            }

            for (const attr of Array.from(el.attributes)) {
                const name = attr.name.toLowerCase()
                const value = attr.value

                if (name.startsWith('on')) {
                    el.removeAttribute(attr.name)
                    continue
                }

                if (name === 'style') {
                    el.removeAttribute(attr.name)
                    continue
                }

                if ((name === 'href' || name === 'src') && typeof value === 'string') {
                    const v = value.trim()
                    if (!v) continue

                    if (v.startsWith('#') || v.startsWith('/')) continue

                    let parsed: URL | null = null
                    try {
                        parsed = new URL(v, window.location.href)
                    } catch {
                        parsed = null
                    }

                    if (!parsed || !allowedUrlSchemes.has(parsed.protocol)) {
                        el.removeAttribute(attr.name)
                    }
                }
            }
        }

        return doc.body.innerHTML
    } catch {
        return ''
    }
}

export default function BlogPostDetail(props: { articleId?: string, backTo?: string }) {
    const { articleId, backTo = '/personal-website/home#blog' } = props
    const [loading, setLoading] = useState(() => Boolean((articleId || '').trim()))
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<BlogPostDetailResponse | null>(null)
    const location = useLocation()
    const routeState = useMemo(() => {
        const s = (location.state as any) || {}
        const title = typeof s.title === 'string' ? normalizeDisplayTitle(s.title) : ''
        const publishedText = typeof s.publishedText === 'string' ? s.publishedText.trim() : ''
        const tags = Array.isArray(s.tags) ? s.tags.filter((t: any) => typeof t === 'string' && t.trim()).map((t: string) => t.trim()) : []
        return { title, publishedText, tags }
    }, [location.state])

    const normalizedId = useMemo(() => {
        const id = (articleId || '').trim()
        return id || null
    }, [articleId])

    useEffect(() => {
        if (!normalizedId) {
            setData(null)
            return
        }

        window.scrollTo(0, 0)

        setData((prev) => (prev?.articleId === normalizedId ? prev : null))
        setLoading(true)
        setError(null)

        getJuejinPostDetail(normalizedId)
            .then((res) => {
                setData(res)
            })
            .catch((e: any) => {
                setError(e?.message || '获取文章失败')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [normalizedId])

    const isRefreshing = loading && !!data
    const isInitialLoading = !data && !error && !!normalizedId

    const contentNode = useMemo(() => {
        if (!data) return null
        if (!data.content) return <div className={styles.stateHint}>文章内容为空</div>
        if (data.contentType === 'html') {
            return <div className={styles.html} dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.content) }} />
        }
        return <pre className={styles.content}>{data.content}</pre>
    }, [data])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link className={styles.backLink} to={backTo}>← 返回</Link>
                    <div className={styles.headerActions}>
                        {data?.url ? (
                            <a className={styles.actionLink} href={data.url} target="_blank" rel="noreferrer">
                                <BrandIcon className={styles.actionIcon} name="juejin" />
                                <span>掘金原文</span>
                            </a>
                        ) : null}
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.container}>
                    {!normalizedId ? (
                        <div className={styles.stateBox}>缺少文章 ID</div>
                    ) : null}

                    {error ? (
                        <div className={styles.stateBoxError}>
                            {error}
                            <div className={styles.stateHint}>
                                请确认后端已实现：GET /api/blog/juejin/posts/:articleId
                            </div>
                        </div>
                    ) : null}

                    {isInitialLoading ? (
                        <article className={`${styles.article} ${styles.skeleton}`}>
                            <div className={styles.skeletonTitle} />
                            <div className={styles.skeletonMeta}>
                                <div className={styles.skeletonPill} />
                                <div className={styles.skeletonPill} />
                                <div className={styles.skeletonPill} />
                            </div>
                            {Array.from({ length: 22 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={idx % 5 === 4 ? styles.skeletonLineShort : styles.skeletonLine}
                                />
                            ))}
                        </article>
                    ) : null}

                    {data ? (
                        <article className={`${styles.article} ${isRefreshing ? styles.blurred : ''}`}>
                            <h1 className={styles.title}>{routeState.title || resolvePostTitle(data) || normalizeDisplayTitle(data.title) || '文章详情'}</h1>
                            <div className={styles.meta}>
                                {(data.publishedText || routeState.publishedText) ? (
                                    <span className={styles.metaText}>
                                        {(() => {
                                            const v = (data.publishedText || routeState.publishedText).trim()
                                            return /^\d{4}-\d{2}-\d{2}$/.test(v) ? `发布于 ${v}` : v
                                        })()}
                                    </span>
                                ) : null}
                                {(data.tags?.length ? data.tags : routeState.tags)?.length ? (
                                    <span className={styles.tags}>
                                        {(data.tags?.length ? data.tags : routeState.tags).map((item) => (
                                            <span key={item} className={styles.tag}>{item}</span>
                                        ))}
                                    </span>
                                ) : null}
                            </div>
                            {contentNode}
                        </article>
                    ) : null}
                </div>
            </main>
        </div>
    )
}
