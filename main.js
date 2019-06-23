import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.mjs'
import * as less from 'https://unpkg.com/less@3.8.1/dist/less.min.js'

class NewPost extends Component {
  constructor () {
    super()

    this.state = { body: '' }
  }

  addPost (e) {
    e.preventDefault()

    console.log(this.props)

    this.props.addPost(this.state.body)
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
  addPost () {
    const { todos = [] } = this.state
    this.setState({ todos: todos.concat(`Item ${todos.length}`) })
  }

  render ({ page }, { todos = [] }) {
    return html`
      <div class="app">
        <section>
          <${Header} />
        </section>

        <section>
          <div class='new-post'>
            <${NewPost} addPost=${this.addPost.bind(this)} />
          </div>

          <div class='posts'>
          wut
            ${todos.map(todo => html`
              <div>${todo}</div>
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
