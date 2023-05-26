const debounce = (callback: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(...args), delay)
  };
}

export default debounce