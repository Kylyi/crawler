// Models
import type { FileModel } from '../../core/models/file.model'
import { getUtilitiesConfig } from '../../core/config/runtime-config'

export function deleteFile(payload: { file: FileModel }) {
  const { file } = payload

  const filesHost = getUtilitiesConfig().public.filesHost

  // Delete the file
  console.log('deleteFile', file)
}
