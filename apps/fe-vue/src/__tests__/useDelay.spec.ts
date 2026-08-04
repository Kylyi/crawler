import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { useDelay } from '../composables/useDelay'

describe('useDelay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not resolve before the delay elapses', async () => {
    const promise = useDelay(1000)
    let resolved = false
    promise
      .then(() => {
        resolved = true
      })
      .catch(() => {
        resolved = false
      })

    await vi.advanceTimersByTimeAsync(999)
    expect(resolved).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    expect(resolved).toBe(true)
  })

  it('resolves after the specified delay', async () => {
    const promise = useDelay(500)

    const advancePromise = vi.advanceTimersByTimeAsync(500)
    await expect(promise).resolves.toBeUndefined()
    await advancePromise
  })
})
