/* globals fetch */

import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.mjs'
import * as less from 'https://unpkg.com/less@3.8.1/dist/less.min.js'

// Components
import { Auth, user, headers } from './auth.js'

class NewPost extends Component {
  constructor () {
    super()

    this.state = { body: '' }
  }

  addPost (e) {
    e.preventDefault()

    console.log(this.props)

    this.props.addPost(this.state.body)

    this.setState({ body: '' })
  }

  onKeydown (e) {
    if (e.keyCode === 13) {
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

class Post extends Component {
  render () {
    let age = this.props.created_at

    return html`
      <div class='post'>
        <p class='meta'><span class='user'>${this.props.user.username}</span> · <span class='age'>${age}</span></p>
        <p class='content'>${this.props.content}</p>
      </div>
    `
  }
}

class App extends Component {
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

    console.log('wtf', r)

    this.setState({ posts: r.posts })
    // console.log(r)
  }

  async addPost (content) {
    // const { posts = [] } = this.state

    let body = JSON.stringify({ content })
    let f = await fetch('/api/post', { method: 'POST', body, headers })
    let r = await f.json()
    console.log(r)

    this.fetch()
    // this.setState({ posts: [{ user, body }].concat(posts) })
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

const Header = () => {
  return html`
    <Header>
      <img src='briefs.png' /> 
      <span>Briefs</span>
    </Header>
  `
}

render(html`<${App} page="All" />`, document.body)
