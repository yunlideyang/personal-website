import { kvGet, kvSet } from './indexedDb'

type CacheResult<T> = {
    value: T
    fromCache: boolean
    updatedAt: number
}

const inflight = new Map<string, Promise<CacheResult<any>>>()

export async function getOrFetchCached<T>(opts: {
    key: string
    maxAgeMs: number
    fetcher: () => Promise<T>
    allowStaleOnError?: boolean
}): Promise<CacheResult<T>> {
    const { key, maxAgeMs, fetcher, allowStaleOnError = true } = opts

    const existing = inflight.get(key)
    if (existing) return existing

    const task = (async () => {
        try {
            const cached = await kvGet<T>(key).catch(() => undefined)
            const now = Date.now()
            const updatedAt = typeof cached?.updatedAt === 'number' ? cached.updatedAt : 0
            const isFresh = !!cached && updatedAt > 0 && now - updatedAt <= maxAgeMs
            if (isFresh) {
                return { value: cached.value as T, fromCache: true, updatedAt }
            }

            const fresh = await fetcher()
            await kvSet(key, fresh, now).catch(() => undefined)
            return { value: fresh, fromCache: false, updatedAt: now }
        } catch (e) {
            if (!allowStaleOnError) throw e
            const cached = await kvGet<T>(key).catch(() => undefined)
            if (cached && typeof cached.updatedAt === 'number') {
                return { value: cached.value as T, fromCache: true, updatedAt: cached.updatedAt }
            }
            throw e
        }
    })()

    inflight.set(key, task)
    try {
        return await task
    } finally {
        inflight.delete(key)
    }
}

