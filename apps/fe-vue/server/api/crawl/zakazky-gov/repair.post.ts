import { defineHandler } from 'nitro'
import { repairEnrichedFieldsFromStoredDetail } from '../../../crawlers/zakazky-gov/repair'

export default defineHandler(async () => {
  const repair = await repairEnrichedFieldsFromStoredDetail()

  return { ok: true, repair }
})
