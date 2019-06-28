/* globals fetch */

import { html, Component } from './vendor/preact.mjs'

// Components
import { Auth, user, headers } from './auth.js'
import NewPost from './components/new-post.js'
import Post from './components/post.js'

const Header = () => {
  return html`
    <Header>
      <a href='/'>
        <img src='briefs.png' /> 
        <span>Briefs</span>
      </a>
    </Header>
  `
}

export class Feed extends Component {
  constructor () {
    super()

    this.state = { posts: [] }
  }

  componentDidMount () {
    if (user.id) {
      this.fetch()
    }
  }

  async fetch () {
    let f = await fetch('/api/feed', { headers })
    let r = await f.json()

    this.setState({ posts: r.posts })
  }

  async addPost (content) {
    let body = JSON.stringify({ content })
    let f = await fetch('/api/post', { method: 'POST', body, headers })
    let r = await f.json()

    this.fetch()
  }

  render ({ page }, { posts }) {
    return html`
      <div class="app">
        <section>
          <${Header} />

          <${Auth} />
        </section>

        <section>
          <div class='new-post'>
            <${NewPost} addPost=${this.addPost.bind(this)} />
          </div>

          <div class='posts'>
            ${posts.map(post => html`<${Post} ...${post} />`)}
          </div>
        </section>
      </div>
    `
  }
}

export class User extends Component {
  constructor () {
    super()

    this.state = { posts: [] }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    let f = await fetch(`/api/feed/${this.props.username}`, { headers })
    let r = await f.json()

    this.setState({ posts: r.posts })
  }

  render ({ username }, { posts }) {
    return html`
      <div class="app">
        <section>
          <${Header} />

          <${Auth} />
        </section>

        <section>
          <div class='user-profile'>
            <h1>${ username }</h1>
          </div>

          <div class='posts'>
            ${posts.map(post => html`<${Post} ...${post} />`)}
          </div>
        </section>
      </div>
    `
  }
}

