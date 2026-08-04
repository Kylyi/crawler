import { describe, expect, it, vi } from 'vite-plus/test'
import { createCrawlLogger } from './logger'

describe('createCrawlLogger', () => {
  it('logs with crawl scope prefix and metadata', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    const log = createCrawlLogger('zakazky-gov')
    log.start('list crawl', { runId: 'abc', pageSize: 50 })

    expect(info).toHaveBeenCalledWith('[crawl:zakazky-gov] start: list crawl (runId=abc, pageSize=50)')

    info.mockRestore()
  })
})
