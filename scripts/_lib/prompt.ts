import * as p from '@clack/prompts'

export function isCancelled(value: unknown): boolean {
  return p.isCancel(value)
}

export async function selectOrCancel<T extends string>(
  message: string,
  options: Array<{ label: string; value: T; hint?: string }>,
): Promise<T | null> {
  const value = await p.select({
    message,
    // Clack's Option<T> conditional does not narrow on generic T extends string
    options: options as never,
  })

  if (p.isCancel(value)) {
    p.cancel('Cancelled.')
    return null
  }

  return value as T
}

export async function multiselectOrCancel<T extends string>(
  message: string,
  options: Array<{ label: string; value: T; hint?: string }>,
  opts?: { required?: boolean; initialValues?: T[] },
): Promise<T[] | null> {
  const value = await p.multiselect({
    message,
    options: options as never,
    required: opts?.required ?? true,
    initialValues: opts?.initialValues,
  })

  if (p.isCancel(value)) {
    p.cancel('Cancelled.')
    return null
  }

  return value as T[]
}

export async function textOrCancel(
  message: string,
  opts?: { defaultValue?: string; placeholder?: string },
): Promise<string | null> {
  const value = await p.text({
    message,
    defaultValue: opts?.defaultValue,
    placeholder: opts?.placeholder ?? opts?.defaultValue,
  })

  if (p.isCancel(value)) {
    p.cancel('Cancelled.')
    return null
  }

  return value
}

export async function confirmOrCancel(message: string, initialValue = true): Promise<boolean | null> {
  const value = await p.confirm({ message, initialValue })

  if (p.isCancel(value)) {
    p.cancel('Cancelled.')
    return null
  }

  return value
}
