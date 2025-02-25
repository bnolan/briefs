import { html, Component  } from './vendor/preact.mjs'

export default function Markup ({ text }) {
  let string = text

  if (string === '') {
    return string
  }

  const re = /(`.+?`)/g
  const elements = []
  let lastIndex = 0
  let match

  while (match = re.exec(string)) {
    // Push preceding text if there is any
    if (match.index > lastIndex) {
      elements.push(html`<${Linkify} text=${string.substring(lastIndex, match.index)} />`)
    }

    let text = match[1]

    if (text.match(/^`.+`$/)) {
      text = text.replace(/`/g, '')

      elements.push(html`<code><${Linkify} text=${text} /></code>`)
    } else {
      // ...
    }

    lastIndex = re.lastIndex
  }

  // Push remaining text if there is any
  if (string.length > lastIndex) {
    elements.push(html`<${Linkify} text=${string.substring(lastIndex)} />`)
  }

  return (elements.length === 1) ? elements[0] : html`<span>${elements}</span>`
}

function Linkify ({ text }) {
  let string = ' ' + text

  if (string === '') {
    return string
  }

  const re = /\s(https*:\/\/\S+|@[a-zA-Z0-9_]+)\b/g
  const elements = []
  let lastIndex = 0
  let match

  while (match = re.exec(string)) {
    // Push preceding text if there is any
    if (match.index > lastIndex) {
      elements.push(string.substring(lastIndex, match.index))
    }

    let text = match[1]
    let url = match[1]

    if (url.match(/^@/)) {
      url = '/' + url.slice(1)
    }

    elements.push(html` <a href=${url}>${text}</a>`)

    lastIndex = re.lastIndex
  }

  // Push remaining text if there is any
  if (string.length > lastIndex) {
    elements.push(string.substring(lastIndex))
  }

  return (elements.length === 1) ? elements[0] : html`<span>${elements}</span>`
}
