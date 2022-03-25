export const setCache = (key: string, data: any) => {
  if (data) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export const getCache = (key: string): any => {
  const str = localStorage.getItem(key)
  return str ? JSON.parse(str) : null
}

export const clearCache = () => {
  localStorage.clear()
}