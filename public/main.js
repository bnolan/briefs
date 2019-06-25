import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.mjs'
import * as less from 'https://unpkg.com/less@3.8.1/dist/less.min.js'

// Components
import Auth from './auth.js'

class NewPost extends Component {
  constructor () {
    super()

    this.state = { body: '' }
  }

  addPost (e) {
    e.preventDefault()

    console.log(this.props)

    this.props.addPost(null, this.state.body)
  }

  render () {
    return html`
      <form>
        <textarea 
          value=${this.state.body}
          onInput=${e => this.setState({ body: e.target.value })}
          placeholder='What is happening?' />
        <button onClick=${e => this.addPost(e)}>Post</button>
      </form>
    `
  }
}

class App extends Component {
  addPost (user, body) {
    const { posts = [] } = this.state
    this.setState({ posts: [{ user, body }].concat(posts) })
  }

  render ({ page }, { posts = [] }) {
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
            ${posts.map(todo => html`
              <div>${todo.body}</div>
            `)}
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
