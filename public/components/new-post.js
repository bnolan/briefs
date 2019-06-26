import { html, Component } from 'https://unpkg.com/htm/preact/standalone.mjs'

export default class NewPost extends Component {
  constructor () {
    super()

    this.state = { body: '' }
  }

  addPost (e) {
    e.preventDefault()

    console.log(this.props)

    if (this.state.body.length > 0) {
      this.props.addPost(this.state.body)
    }

    this.setState({ body: '' })
  }

  onKeydown (e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      this.addPost(e)
    }
  }

  render () {
    return html`
      <form>
        <textarea 
          value=${this.state.body}
          onInput=${e => this.setState({ body: e.target.value })}
          onKeyDown=${e => this.onKeydown(e)}
          placeholder='What is happening?' />
        <button onClick=${e => this.addPost(e)}>Post</button>
      </form>
    `
  }
}