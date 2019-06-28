import * as express from 'express'
import { Client } from 'pg'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as path from 'path'
import * as enforce from 'express-sslify'

const passport = require('passport')
const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy

// Connect to Postgres
const connectionString = process.env.DATABASE_URL || 'postgres://ben@localhost/briefs'
const client = new Client({ connectionString })
client.connect()

// Bcrypt
const saltRounds = 10;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Passport doesn't use sessions
const session = false

// Create express
const app = express()

// Force SSL
if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

// HTML and Javascript
app.use(express.static('public'))

// JWT
var opts: any = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = JWT_SECRET
// opts.issuer = 'briefs.social'
// opts.audience = 'briefs.social'

passport.use(
  new JwtStrategy(opts, (payload, done) => done(null, payload))
)

// Parse json body
app.use(express.json())

interface User {
  id: number
  username: string
  email: string
}

// Generate jwt token
const token = (id, username, email) => {
  let payload = { id, username, email }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7 days' })
}

// Sign up user
app.post('/api/signup', async (req, res) => {
  let { username, email } = req.body

  try {
    const result = await client.query(`
      insert into
        users
          (username, email, password)
        values
          ($1, $2, $3)
        returning id;
    `, [username, email, bcrypt.hashSync(req.body.password, saltRounds)])

    let id = result.rows[0].id
    res.json({ success: true, token: token(id, username, email) })
  } catch (e) {
    res.json({ success: false, error: e.toString() })
  }
})

// Login user
app.post('/api/login', async (req, res) => {
  let result = null

  try {
    result = await client.query(`
      select
        *
      from
        users
      where
        username = $1;
    `, [req.body.username])
  } catch (e) {
    res.json({ success: false, error: e.toString() })
    return
  }

  if (!result || !result.rows[0]) {
    res.json({ success: false, error: 'Username not found' })
    return
  }

  if (!bcrypt.compareSync(req.body.password, result.rows[0].password)) {
    res.json({ success: false, error: 'Wrong password' })
    return
  }

  let { id, username, email } = result.rows[0]
  res.json({ success: true, token: token(id, username, email) })
})

// Check auth
app.get('/api/ping', passport.authenticate('jwt', { session }), (req, res) => {
  res.json({ success: true, user: req['user'] })
})

// Create new post
app.post('/api/post', passport.authenticate('jwt', { session }), async (req, res) => {
  let { content } = req.body
  let user = req['user'] as User

  try {
    const result = await client.query(`
      insert into
        posts
          (content, user_id, created_at)
        values
          ($1, $2, now())
        returning id;
    `, [content, user.id])

    let id = result.rows[0].id
    res.json({ success: true, id })
  } catch (e) {
    res.json({ success: false, error: e.toString() })
  }
})

// Get my feed
app.get('/api/feed', passport.authenticate('jwt', { session }), async (req, res) => {
  let user = req['user'] as User

  try {
    const result = await client.query(`
      select
        posts.*,
        json_build_object('id', users.id, 'username', users.username) as user
      from
        posts
      inner join 
        users on user_id = users.id
      where
        user_id in (select id from users where id >= $1 - 1000)
      order by
        created_at desc
      limit
        50
      ;
    `, [user.id])

    res.json({ success: true, posts: result.rows })
  } catch (e) {
    res.json({ success: false, error: e.toString() })
  }
})

app.get('/api/feed/:username', async (req, res) => {
  try {
    const result = await client.query(`
      select
        posts.*,
        json_build_object('id', users.id, 'username', users.username) as user
      from
        posts
      inner join 
        users on user_id = users.id
      where
        user_id in (select id from users where username = $1)
      order by
        created_at desc
      limit
        50
      ;
    `, [req.params.username])

    res.json({ success: true, posts: result.rows })
  } catch (e) {
    res.json({ success: false, error: e.toString() })
  }
})

app.get('/:username', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user.html'))
})

// Start  listening
const port = process.env.PORT || 3500
app.listen(port);
