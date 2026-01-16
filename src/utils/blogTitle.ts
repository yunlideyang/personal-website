export function stripJuejinSuffix(title: string) {
    const raw = typeof title === 'string' ? title.trim() : ''
    if (!raw) return ''
    const cleaned = raw.replace(/\s*[-–—]\s*(?:稀土)?掘金\s*$/u, '').trim()
    return cleaned || raw
}

function compactText(value: string) {
    return value.replace(/\s+/g, ' ').trim()
}

export function normalizeDisplayTitle(title: string) {
    const raw = compactText(typeof title === 'string' ? title : '')
    if (!raw) return ''

    const noSiteSuffix = stripJuejinSuffix(raw)
        .replace(/[—–-]\s*$/u, '')
        .trim()

    const parts = noSiteSuffix.split(/\s*(?:\||｜|丨)\s*/u).filter(Boolean)
    for (const part of parts) {
        const candidate = compactText(part)
        if (candidate && candidate.length >= 2 && candidate.length <= 120) return candidate
    }
    return noSiteSuffix || raw
}

export function extractTitleFromHtml(html: string) {
    if (typeof html !== 'string') return null
    const raw = html.trim()
    if (!raw) return null
    if (typeof DOMParser === 'undefined') return null
    try {
        const doc = new DOMParser().parseFromString(raw, 'text/html')
        const heading = doc.body.querySelector('h1,h2,h3')
        const text = heading?.textContent ? compactText(heading.textContent) : ''
        if (!text) return null
        return text
    } catch {
        return null
    }
}

export function extractTitleFromMarkdown(md: string) {
    if (typeof md !== 'string') return null
    const raw = md.replace(/\r\n/g, '\n')
    const lines = raw.split('\n')
    const maxScan = Math.min(lines.length, 40)
    for (let i = 0; i < maxScan; i++) {
        const line = lines[i]
        const trimmed = line.trim()
        if (!trimmed) continue
        const m = /^(#{1,6})\s+(.+?)\s*$/.exec(trimmed)
        if (m?.[2]) return compactText(m[2])
    }
    return null
}

function isReasonableTitle(title: string) {
    const t = compactText(title)
    if (!t) return false
    if (t.length < 2) return false
    if (t.length > 120) return false
    return true
}

export function resolvePostTitle(opts: { title?: string, content?: string, contentType?: 'markdown' | 'text' | 'html' }) {
    const baseTitle = normalizeDisplayTitle(opts.title || '')
    const content = typeof opts.content === 'string' ? opts.content : ''
    const type = opts.contentType

    const extracted = type === 'html'
        ? extractTitleFromHtml(content)
        : type === 'markdown' || type === 'text' || !type
            ? extractTitleFromMarkdown(content)
            : null

    const extractedTitle = extracted ? normalizeDisplayTitle(extracted) : ''
    if (extractedTitle && isReasonableTitle(extractedTitle)) return extractedTitle
    return baseTitle || '文章详情'
}
