import { html, Component } from '../vendor/preact.mjs'

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
        ${ this.props.replyTo ? html`<p class='reply'>In reply to <b>@${this.props.replyTo.user.username}</b></p>` : null }

        <textarea 
          value=${this.state.body}
          onInput=${e => this.setState({ body: e.target.value })}
          onKeyDown=${e => this.onKeydown(e)}
          placeholder=${this.props.replyTo ? 'Reply...' : 'What is happening?'} />
        <button onClick=${e => this.addPost(e)}>Post</button>
      </form>
    `
  }
}