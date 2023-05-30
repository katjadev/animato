import { v4 as uuidv4 } from 'uuid'

const replaceIds = (content: string) => {
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

  return content
}

export default replaceIds