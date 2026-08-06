// Functions
import { normalizeText } from '../../core/utils/normalize-text'
import { createTextShortcut } from '../../core/utils/create-text-shortcut'

export function useText() {
  return { normalizeText, createShortcut: createTextShortcut }
}
