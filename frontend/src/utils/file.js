export const downloadUrl = (url, filename) => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  a.target = '_blank'
  a.href = url
  a.download = `${filename}`
  a.click()
  document.body.removeChild(a)
}