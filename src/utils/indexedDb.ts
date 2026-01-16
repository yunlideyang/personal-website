type OpenDbOptions = {
    name: string
    version: number
    storeName: string
}

type KvRecord<T> = {
    key: string
    value: T
    updatedAt: number
}

const defaultOptions: OpenDbOptions = {
    name: 'personal-website-cache',
    version: 1,
    storeName: 'kv',
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(opts: OpenDbOptions = defaultOptions) {
    if (dbPromise) return dbPromise
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(opts.name, opts.version)
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(opts.storeName)) {
                db.createObjectStore(opts.storeName, { keyPath: 'key' })
            }
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => {
            dbPromise = null
            reject(request.error ?? new Error('Failed to open IndexedDB'))
        }
    })
    return dbPromise
}

function wrapRequest<T>(req: IDBRequest<T>) {
    return new Promise<T>((resolve, reject) => {
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error ?? new Error('IndexedDB request failed'))
    })
}

export async function kvGet<T>(key: string) {
    const db = await openDb()
    const tx = db.transaction(defaultOptions.storeName, 'readonly')
    const store = tx.objectStore(defaultOptions.storeName)
    const result = await wrapRequest(store.get(key))
    return (result as KvRecord<T> | undefined) ?? undefined
}

export async function kvSet<T>(key: string, value: T, updatedAt = Date.now()) {
    const db = await openDb()
    const tx = db.transaction(defaultOptions.storeName, 'readwrite')
    const store = tx.objectStore(defaultOptions.storeName)
    await wrapRequest(store.put({ key, value, updatedAt } satisfies KvRecord<T>))
}

export async function kvDelete(key: string) {
    const db = await openDb()
    const tx = db.transaction(defaultOptions.storeName, 'readwrite')
    const store = tx.objectStore(defaultOptions.storeName)
    await wrapRequest(store.delete(key))
}
