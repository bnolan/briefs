import { html, Component } from '../vendor/preact.mjs'
import Markup from '../markup.js'

const timestamp = function (date) {
  var seconds = Math.floor((new Date() - date) / 1000)
  var interval = Math.floor(seconds / 2592000)

  if (interval >= 1) {
    if (interval >= 3) {
      return (new Date(date)).toLocaleDateString()
    }
    return interval + 'mo ago'
  }
  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return interval + 'd ago'
  }
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return interval + 'h ago'
  }
  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return interval + 'm ago'
  }
  return Math.floor(seconds) + 's ago'
}

export default class Post extends Component {
  toggle () {
    this.setState({ active: !this.state.active })

    if (Post.active) {
      Post.active.setState({ active: false })
    }

    if (this.state.active) {
      Post.active = this
    } else {
      Post.active = null
    }
  }

  render () {
    let age = timestamp(new Date(this.props.created_at))

    return html`
      <div class=${`post ${this.state.active && 'active'}`} onClick=${e => this.toggle()}>
        <p class='meta'><a href=${'/' + this.props.user.username} class='user'>${this.props.user.username}</a> · <span class='age'>${age}</span></p>
        <p class='content'><${Markup} text=${this.props.content} /></p>
        <ul class='actions'>
          <li onClick=${e => this.props.onReply(this.props)}>↵</li>
        </ul>
      </div>
    `
  }
}