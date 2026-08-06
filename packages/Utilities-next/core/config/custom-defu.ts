import defu from 'defu'

export const customDefu = defu.extend((obj, key, value) => {
  // For arrays, use the value, don't extend
  if (Array.isArray(obj[key])) {
    obj[key] = value ?? obj[key]

    return true
  }
})
