/* globals atob, localStorage, alert, fetch */

import { html, Component } from 'https://unpkg.com/htm/preact/standalone.mjs'

const JWT_KEY = 'jwt'

export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

// User state
export const user = {}

// Load user state from jwt in localStorage
if (localStorage.getItem(JWT_KEY)) {
  let token = localStorage.getItem('jwt')

  try {
    Object.assign(user, JSON.parse(atob(token.split('.')[1])))
    headers['Authorization'] = `Bearer ${token}`
  } catch (e) {
  }
}

export class Auth extends Component {
  constructor () {
    super()

    this.state = { register: false, user }
  }

  async componentDidMount () {
    let f = await fetch('/api/ping', { headers })
    let r = await f.json()
  }

  onSubmit (e) {
    e.preventDefault()

    if (this.state.register) {
      this.register()
    } else {
      this.login()
    }
  }

  logout (e) {
    e.preventDefault()

    localStorage.clear()

    this.reload()
  }

  reload () {
    window.location.reload()
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
      this.reload()
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
      this.reload()
    }
  }

  render () {
    if (this.state.user.id) {
      return html`
        <div class='auth'>
          <ul class='tabs'>
            <li class='active'>${this.state.user.username}</li>
          </ul>

          <form onSubmit=${e => this.logout(e)}>
            <button type='submit'>Logout</button>
          </form>
        </div>
      `
    }

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
