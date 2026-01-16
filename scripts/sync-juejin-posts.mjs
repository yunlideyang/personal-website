import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const profileUrl = 'https://juejin.cn/user/3555155234264426/posts'

function decodeHtmlEntities(input) {
    return input
        .replaceAll('&quot;', '"')
        .replaceAll('&#34;', '"')
        .replaceAll('&#39;', "'")
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
}

function extractPostsFromHtml(html, limit = 20) {
    const titles = []
    const seen = new Set()

    const titleRegex = /"title":"([^"]{3,160})"/g
    let match = null
    while ((match = titleRegex.exec(html)) && titles.length < limit) {
        const raw = match[1]
        const title = decodeHtmlEntities(raw)
            .replaceAll('\\u003C', '<')
            .replaceAll('\\u003E', '>')
            .replaceAll('\\u0026', '&')
            .replaceAll('\\\\', '\\')
        if (seen.has(title)) continue
        if (/^https?:\/\//.test(title)) continue
        if (title.includes('掘金')) continue
        seen.add(title)
        titles.push(title)
    }

    return titles.map((title) => ({
        title,
        url: profileUrl,
    }))
}

async function main() {
    const res = await fetch(profileUrl, {
        headers: {
            'user-agent': 'Mozilla/5.0',
            accept: 'text/html,application/xhtml+xml',
        },
    })
    if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
    }

    const html = await res.text()
    const posts = extractPostsFromHtml(html, 20)

    if (!posts.length) {
        throw new Error('No posts extracted')
    }

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const outFile = path.resolve(__dirname, '../src/data/juejinPosts.ts')

    const content = [
        `export const juejinProfileUrl = ${JSON.stringify(profileUrl)}`,
        ``,
        `export const juejinPosts = ${JSON.stringify(posts, null, 4)} as const`,
        ``,
    ].join('\n')

    await fs.mkdir(path.dirname(outFile), { recursive: true })
    await fs.writeFile(outFile, content, 'utf-8')
    process.stdout.write(`Wrote: ${outFile}\n`)
}

main().catch((err) => {
    process.stderr.write(`${String(err?.stack || err)}\n`)
    process.exit(1)
})

