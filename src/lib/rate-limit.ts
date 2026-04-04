// Simple in-process rate limiter
// Not shared across Vercel instances, but effective within each one.
// No external service or cost needed.

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

// Prune expired entries every 500 calls to prevent unbounded memory growth
let callsSincePrune = 0
function pruneExpired() {
  if (++callsSincePrune < 500) return
  callsSincePrune = 0
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}

/**
 * Returns true if the request is allowed, false if rate limited.
 * @param key     Unique key (e.g. "download:1.2.3.4")
 * @param limit   Max requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  pruneExpired()
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
