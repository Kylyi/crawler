import axios from 'axios'

// Types
import type { IItem } from '../../core/types/item.type'

// Models
import type { FileModel } from '../../core/models/file.model'
import { getUtilitiesConfig } from '../../core/config/runtime-config'

export function uploadFile(payload: { file: FileModel; additionalData?: IItem; headers?: IItem }) {
  const { file, headers } = payload

  const filesHost = getUtilitiesConfig().public.filesHost ?? '/api/files'

  file.abortController = new AbortController()

  // Create form data
  const formData = new FormData()
  formData.append('files', payload.file.file)

  return axios.post(filesHost, formData, {
    headers,
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent

      if (!file.isUploaded) {
        file.uploadProgress = Math.min(Math.round((loaded / (total || 1)) * 100), 99)
      }
    },
    signal: file.abortController?.signal,
  })
}
