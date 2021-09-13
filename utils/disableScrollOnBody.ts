export const disableScrollOnBody = (isOpen: boolean) => {
  const body = document.querySelector('body')
  if (isOpen) {
    body?.classList.add('menu-open')
  } else {
    body?.classList.remove('menu-open')
  }
}
