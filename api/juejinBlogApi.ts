import request from '../src/utils/request'

export type BlogPost = {
    title: string
    publishedText?: string
    tags?: readonly string[]
    url: string
}

export type BlogPostListResponse = {
    list: BlogPost[]
    nextCursor: string
}

export type BlogPostDetailResponse = {
    articleId: string
    title: string
    publishedText?: string
    tags?: readonly string[]
    url: string
    content: string
    contentType?: 'markdown' | 'text' | 'html'
}

function unwrapPayload(raw: unknown) {
    if (!raw || typeof raw !== 'object') return raw

    const obj = raw as Record<string, unknown>
    const candidates = ['data', 'result', 'payload']
    for (const key of candidates) {
        const value = obj[key]
        if (value && typeof value === 'object') return value
    }
    return raw
}

function normalizeStringArray(value: unknown): readonly string[] | undefined {
    if (!Array.isArray(value)) return undefined
    const result = value
        .map((v) => (typeof v === 'string' ? v.trim() : ''))
        .filter(Boolean)
    return result.length ? result : undefined
}

function normalizeTagArray(value: unknown): readonly string[] | undefined {
    if (!Array.isArray(value)) return undefined
    const result = value
        .map((v) => {
            if (typeof v === 'string') return v.trim()
            if (!v || typeof v !== 'object') return ''
            const obj = v as any
            const name = obj.tag_name ?? obj.tagName ?? obj.name ?? obj.title ?? ''
            return typeof name === 'string' ? name.trim() : ''
        })
        .filter(Boolean)
    return result.length ? result : undefined
}

function pad2(n: number) {
    return n < 10 ? `0${n}` : String(n)
}

function formatDateToYMD(value: Date) {
    const y = value.getFullYear()
    const m = pad2(value.getMonth() + 1)
    const d = pad2(value.getDate())
    return `${y}-${m}-${d}`
}

function normalizePublishedText(value: unknown): string | undefined {
    if (typeof value === 'string') {
        const v = value.trim()
        if (!v) return undefined
        if (/^\d{10,13}$/.test(v)) {
            const num = Number(v)
            if (Number.isFinite(num)) {
                const ms = num < 1e12 ? num * 1000 : num
                const d = new Date(ms)
                if (!Number.isNaN(d.getTime())) return formatDateToYMD(d)
            }
        }
        return v
    }
    if (typeof value !== 'number') return undefined
    const num = Number.isFinite(value) ? value : NaN
    if (!Number.isFinite(num)) return undefined
    const ms = num < 1e12 ? num * 1000 : num
    const d = new Date(ms)
    if (Number.isNaN(d.getTime())) return undefined
    return formatDateToYMD(d)
}

function normalizeContentType(value: unknown): BlogPostDetailResponse['contentType'] {
    if (typeof value !== 'string') return undefined
    const v = value.trim().toLowerCase()
    if (v === 'html') return 'html'
    if (v === 'markdown' || v === 'md') return 'markdown'
    if (v === 'text' || v === 'plain') return 'text'
    return undefined
}

function looksLikeHtml(content: string) {
    const v = content.trim()
    if (!v.startsWith('<')) return false
    if (v.startsWith('<!--')) return true
    return /<\/[a-z][\s\S]*>/i.test(v)
}

function cleanUrl(value: unknown) {
    if (typeof value !== 'string') return ''
    return value.trim().replace(/^`+|`+$/g, '').replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '')
}

function extractJuejinArticleIdFromUrl(url: string) {
    const match = /\/post\/(\d+)/.exec(url)
    return match?.[1] || null
}

function normalizeListResponse(raw: unknown): BlogPostListResponse {
    const source = unwrapPayload(raw) as any
    const list = Array.isArray(source?.list) ? source.list : []
    const nextCursor = typeof source?.nextCursor === 'string' ? source.nextCursor : String(source?.nextCursor ?? '')

    const seenKey = new Set<string>()
    return {
        list: list
            .map((item: any) => ({
                title: typeof item?.title === 'string' ? item.title.trim() : String(item?.title ?? '').trim(),
                publishedText: typeof item?.publishedText === 'string' ? item.publishedText : undefined,
                tags: normalizeStringArray(item?.tags),
                url: cleanUrl(item?.url ?? ''),
            }))
            .map((p: BlogPost) => {
                const articleId = extractJuejinArticleIdFromUrl(p.url)
                if (!articleId) return p
                return { ...p, url: `https://juejin.cn/post/${articleId}` }
            })
            .filter((p: BlogPost) => Boolean(p.title) && Boolean(p.url))
            .filter((p: BlogPost) => {
                const articleId = extractJuejinArticleIdFromUrl(p.url)
                const key = articleId ? `post:${articleId}` : `url:${p.url}|title:${p.title}`
                if (seenKey.has(key)) return false
                seenKey.add(key)
                return true
            }),
        nextCursor: nextCursor || '0',
    }
}

function normalizeDetailResponse(raw: unknown): BlogPostDetailResponse {
    const source = unwrapPayload(raw) as any
    const detailSource = source?.article && typeof source.article === 'object' ? source.article : source

    const content = typeof detailSource?.content === 'string'
        ? detailSource.content
        : typeof detailSource?.mark_content === 'string'
            ? detailSource.mark_content
            : typeof detailSource?.markdown === 'string'
                ? detailSource.markdown
                : typeof detailSource?.html === 'string'
                    ? detailSource.html
                    : ''

    const normalizedType = normalizeContentType(detailSource?.contentType ?? detailSource?.content_type)
    const inferredType: BlogPostDetailResponse['contentType'] = normalizedType ?? (looksLikeHtml(content) ? 'html' : 'markdown')

    const tags = normalizeTagArray(detailSource?.tags)
        ?? normalizeTagArray(detailSource?.tag_list)
        ?? normalizeStringArray(detailSource?.tags)
        ?? normalizeStringArray(detailSource?.tag_list)

    const publishedText = normalizePublishedText(detailSource?.publishedText)
        ?? normalizePublishedText(detailSource?.published_text)
        ?? normalizePublishedText(detailSource?.published_at)
        ?? normalizePublishedText(detailSource?.ctime)
        ?? normalizePublishedText(detailSource?.create_time)
        ?? normalizePublishedText(detailSource?.created_at)
        ?? (typeof detailSource?.publishedText === 'string' ? detailSource.publishedText : undefined)

    return {
        articleId: typeof detailSource?.articleId === 'string'
            ? detailSource.articleId
            : typeof detailSource?.article_id === 'string'
                ? detailSource.article_id
                : String(detailSource?.articleId ?? detailSource?.article_id ?? ''),
        title: typeof detailSource?.title === 'string' ? detailSource.title : String(detailSource?.title ?? ''),
        publishedText,
        tags,
        url: typeof detailSource?.url === 'string' ? detailSource.url : String(detailSource?.url ?? ''),
        content,
        contentType: inferredType,
    }
}

export async function getJuejinPosts(params: { cursor?: string, limit?: number } = {}) {
    const { cursor = '0', limit = 20 } = params
    const raw = await request({
        url: '/blog/juejin/posts',
        method: 'get',
        params: { cursor, limit },
    })
    return normalizeListResponse(raw)
}

export async function getJuejinPostDetail(articleId: string) {
    const raw = await request({
        url: `/blog/juejin/posts/${encodeURIComponent(articleId)}`,
        method: 'get',
    })
    return normalizeDetailResponse(raw)
}
