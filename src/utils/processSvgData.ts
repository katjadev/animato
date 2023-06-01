import { v4 as uuidv4 } from 'uuid'

const processSvgData = (content: string) => {
  const ids: Map<string, number> = new Map()
  const regex = /id="([^"]+)"/g

  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    const id = match[1]
    ids.set(id, ids.has(id) ? ids.get(id)! + 1 : 1)
  }

  ids.forEach((count, id) => {
    for (let i = 0; i < count; i++) {
      const newId = uuidv4()
      content = content.replace(`id="${id}"`, `id="${newId}"`)
        .replaceAll(`xlink:href="#${id}"`, `xlink:href="#${newId}"`)
        .replaceAll(`url(#${id})`, `url(#${newId})`)
    }
  })

  const stylesToReplaceWithAttrubutes = [
    'fill', 
    'fill-opacity', 
    'stroke', 
    'stroke-width', 
    'stroke-dasharray', 
    'stroke-opacity'
  ]
  const styleRegex = /style="([^"]+)"/g
  let match1: RegExpExecArray | null
  while ((match1 = styleRegex.exec(content)) !== null) {
    let newStyleList = match1![1]

    const styles = match1[1]
      .split(';')
      .map(style => {
        const [name, value] = style.split(':')
        return { name, value }
      })
      .filter(style => stylesToReplaceWithAttrubutes.includes(style.name))

    styles.forEach(style => {
      newStyleList = newStyleList
        .replace(`${style.name}:${style.value};`, '')
        .replace(`${style.name}:${style.value}`, '')
    })

    const newStyleValue = match1![0].replace(match1![1], newStyleList)
    const attributes = styles.reduce((result, current) => {
      result = result + ` ${current.name}="${current.value}"`
      return result
    }, '')
    content = content.replaceAll(match1![0], `${newStyleValue} ${attributes}`)
  }
  
  console.log(content)
  return content
}

export default processSvgData