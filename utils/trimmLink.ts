export const trimmLink = (link: string) => {
  const index = link.lastIndexOf('/')
  return link.slice(index + 1)
}
