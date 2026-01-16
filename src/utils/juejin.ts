export function extractJuejinArticleIdFromUrl(url: string) {
    const match = /\/post\/(\d+)/.exec(url)
    return match?.[1] || null
}

