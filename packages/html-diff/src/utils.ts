const tagRegex = /^\s*<[^>]+>\s*$/
const tagWordRegex = /<[^\s>]+/
const whitespaceRegex = /^(?:\s|&nbsp;)+$/
const wordRegex = /[\w#@]+/

const specialCaseWordTags = ['<img']

export function isTag(item: string): boolean {
  if (specialCaseWordTags.some((re) => item !== null && item.startsWith(re))) {
    return false
  }

  return tagRegex.test(item)
}

export function stripTagAttributes(word: string): string {
  const tags = tagWordRegex.exec(word) || ['']
  word = tags[0] + (word.endsWith('/>') ? '/>' : '>')
  return word
}

export function wrapText(text: string, tagName: string, cssClass: string): string {
  return ['<', tagName, ' class="', cssClass, '">', text, '</', tagName, '>'].join('')
}

export function isStartOfTag(val: string): val is '<' {
  return val === '<'
}

export function isEndOfTag(val: string): val is '>' {
  return val === '>'
}

export function isStartOfEntity(val: string): val is '&' {
  return val === '&'
}

export function isEndOfEntity(val: string): val is ';' {
  return val === ';'
}

export function isWhiteSpace(value: string): boolean {
  return whitespaceRegex.test(value)
}

export function stripAnyAttributes(word: string): string {
  if (isTag(word)) {
    return stripTagAttributes(word)
  }

  return word
}

export function isNumber(text: string): boolean {
  return /^\d$/.test(text)
}

export function isWord(text: string): boolean {
  return wordRegex.test(text)
}
