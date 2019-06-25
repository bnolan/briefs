/* globals localStorage, alert, fetch */

import { html, Component } from 'https://unpkg.com/htm/preact/standalone.mjs'

const JWT_KEY = 'jwt'

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

export default class Auth extends Component {
  constructor () {
    super()

    this.state = { register: true }
  }

  onSubmit (e) {
    e.preventDefault()

    if (this.state.register) {
      this.register()
    } else {
      this.login()
    }
  }

  async register (e) {
    let f = await fetch('/api/signup', {
      headers,
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      }),
      method: 'POST'
    })

    let response = await f.json()

    if (!response.success) {
      alert(`Registration failed:\n\n${response.error}`)
    } else {
      localStorage.setItem(JWT_KEY, response.token)
    }
  }

  async login (e) {
    let f = await fetch('/api/login', {
      headers,
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      method: 'POST'
    })

    let response = await f.json()

    if (!response.success) {
      alert(`Login failed:\n\n${response.error}`)
    } else {
      localStorage.setItem(JWT_KEY, response.token)
    }
  }

  render () {
    return html`
      <div class='auth'>
        <ul class='tabs'>
          <li 
            onClick=${e => this.setState({ register: false })} 
            class=${this.state.register || 'active'}>Login</li>
          <li 
            onClick=${e => this.setState({ register: true })} 
            class=${this.state.register && 'active'}>Register</li>
        </ul>

        <form onSubmit=${e => this.onSubmit(e)}>
          <label>Username</label>
          <input 
            onInput=${e => this.setState({ username: e.target.value })}
            type='text' 
          />
          <label>Password</label>
          <input 
            onInput=${e => this.setState({ password: e.target.value })}
            type='password' 
          />

          ${this.state.register
            ? html`
              <label>Confirm Password</label>
              <input 
                type='password' />
              <label>Email</label>
              <input 
                type='email' 
                onInput=${e => this.setState({ email: e.target.value })}
              />
              <small>(For account recovery)</small>
              <button type='submit'>Register</button>
              `
            : html`<button type='submit'>Log in</button>`
          }
        </form>
      </div>
    `
  }
}
