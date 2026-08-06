// Models
import { FileModel } from '../../core/models/file.model'
import { computed, getCurrentInstance, inject, onUnmounted, provide, ref } from 'vue'
import type { Ref } from 'vue'
import type { IFile } from '../../core/types/file.type'
import { generateUUID } from '../../core/utils/generate-uuid'
import { getComponentName } from '../utils/get-component-name'

// Provide/Inject
export const filesKey = Symbol('__files')

export function useFiles(name?: string) {
  const componentName = name ?? (getComponentName(getCurrentInstance()) || generateUUID())
  const localFiles = ref<Array<FileModel | IFile>>([])
  const injectedFiles = inject(filesKey, ref({}) as Ref<{ [COMPONENT_ID: string]: Array<FileModel | IFile> }>)

  const files = computed({
    get() {
      return localFiles.value
    },
    set(files) {
      localFiles.value = files
      injectedFiles.value[componentName] = files
    },
  })

  const allFiles = computed(() => {
    return Object.values(injectedFiles.value).flat()
  })

  provide(filesKey, injectedFiles)

  function clearFiles() {
    localFiles.value.forEach((file) => {
      if (file instanceof FileModel && file.isUploaded) {
        file.delete()
      }
    })
  }

  // Lifecycle
  onUnmounted(() => {
    delete injectedFiles.value[componentName]
  })

  return {
    files,
    allFiles,
    injectedFiles,
    clearFiles,
  }
}
