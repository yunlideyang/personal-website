const defaultBaseUrl = 'http://localhost:3000'

function normalizeBaseUrl(input) {
    const base = input?.trim() || defaultBaseUrl
    return base.replace(/\/+$/, '')
}

function safeJsonParse(text) {
    try {
        return { ok: true, value: JSON.parse(text) }
    } catch {
        return { ok: false, value: text }
    }
}

const baseUrl = normalizeBaseUrl(process.argv[2])
const cursor = process.argv[3] ?? '0'
const limit = process.argv[4] ?? '20'

const url = `${baseUrl}/api/blog/juejin/posts?cursor=${encodeURIComponent(cursor)}&limit=${encodeURIComponent(limit)}`

const res = await fetch(url, { headers: { accept: 'application/json' } })
const text = await res.text()
const parsed = safeJsonParse(text)

console.log('[GET]', url)
console.log('[HTTP]', res.status, res.statusText)

if (!parsed.ok) {
    console.log('[Body]', text.slice(0, 2000))
    process.exit(res.ok ? 0 : 1)
}

const body = parsed.value
console.log('[JSON keys]', Object.keys(body))

const list = body?.list
const nextCursor = body?.nextCursor

const validList = Array.isArray(list)
const validNextCursor = typeof nextCursor === 'string'

if (!validList || !validNextCursor) {
    console.log('[Schema error] Expected: { list: BlogPost[], nextCursor: string }')
    console.log('[Body]', JSON.stringify(body, null, 2).slice(0, 2000))
    process.exit(1)
}

console.log('[OK] list.length =', list.length, 'nextCursor =', nextCursor)
console.log('[Sample]', JSON.stringify(list.slice(0, 2), null, 2))

