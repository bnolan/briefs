import { html, Component  } from './vendor/preact.mjs'

export default class Linkify extends Component {
  parseString (string) {
    if (string === '') {
      return string
    }

    const re = /\s(https*:\/\/\S+|@[a-zA-Z0-0_]+)\b/g
    const elements = []
    let lastIndex = 0
    let match

    while (match = re.exec(string)) {
      // Push preceding text if there is any
      if (match.index > lastIndex) {
        elements.push(string.substring(lastIndex, match.index))
      }

      let url = match[1]
      let text = match[1]

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

    return (elements.length === 1) ? elements[0] : elements
  }

  render() {
    return (html`
      <p class='content'>
        ${this.parseString(this.props.text)}
      </p>
    `)
  }
}
