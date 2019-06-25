import * as express from 'express'
import { Client } from 'pg'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

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

// Create express
const app = express()

// HTML and Javascript
app.use(express.static('public'))

// JWT
var opts: any = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = JWT_SECRET
opts.issuer = 'briefs.social'
opts.audience = 'briefs.social'

passport.use(
  new JwtStrategy(opts, (payload, done) => done(null, payload))
)

app.get('/api/ping', passport.authenticate('jwt'), (req, res) => res.json({ success: true }))

// Parse json body
app.use(express.json())

const token = (id, username, email) => {
  let payload = { id, username, email }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7 days' })
}

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

// Start  listening
const port = process.env.PORT || 3000
app.listen(port);
