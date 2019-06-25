import { html, Component  } from 'https://unpkg.com/htm/preact/standalone.mjs'

export default class Linkify extends Component {
  parseString (string) {
    if (string === '') {
      return string
    }

    const re = /\bhttps*:\/\/\S+\b/g
    const elements = []
    let lastIndex = 0
    let match

    while (match = re.exec(string)) {
      // Push preceding text if there is any
      if (match.index > lastIndex) {
        elements.push(string.substring(lastIndex, match.index))
      }

      elements.push(html`<a href=${match}>${match}</a>`)

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
