const express = require('express');
const path = require('path');

const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json())

const bcrypt = require('bcrypt')

const dbPath = path.join(__dirname, 'database.db');

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar_url TEXT DEFAULT 'default-avatar.png'
      );
    `);

    await db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);`)

    app.listen(5000, () => {
      console.log('Server Running at http://localhost:5000/')
    })
  }
  
  catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer();


app.post('/users', async (req, res) => {
  const userDetails = req.body

  const {full_name, username, email, password, avatar_url } = userDetails

  const query = `
    INSERT INTO users (
      full_name,
      username,
      email,
      password,
      avatar_url
    )
    VALUES (?, ?, ?, ?, ?)
  `
  const hashedPassword = await bcrypt.hash(password, 10)

  await db.run(query, [full_name, username, email, hashedPassword, avatar_url])
  res.send('User Added Successfully')
})

// Login api
app.post('/login', async (request, response) => {
  const {email, password} = request.body
  const getQuery = `select * from users where email = '${email}'`
  const dbUser = await db.get(getQuery)

  if (dbUser === undefined) {
    response.status(400)
    response.send({error_msg: 'Invalid User'})
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)

    if (isPasswordMatched === true) {
      const payload = {id: dbUser.id, email: dbUser.email}
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      response.status(200)
      response.send({jwt_token: jwtToken, userId: dbUser.id, name : dbUser.full_name})
    } else {
      response.status(400)
      response.send({error_msg: 'Invalid Password'})
    }
  }
})


app.get('/user/:id', async (req, res) =>{
  const {id} = req.params
  const query = `select * from users where id = ${id}`
  const result = await db.all(query)
  res.json(result)
})

app.get('/users', async (req, res) =>{
  const query = `select * from users`
  const result = await db.all(query)
  res.json(result)
})


app.get('/rooms', async (req, res) =>{
  const query = 'select distinct * from rooms'
  const result = await db.all(query)
  res.json(result)
})


app.get('/users/:id/private-users', async (req, res) => {
  const { id } = req.params

  const query = `
    SELECT DISTINCT
      u.id,
      u.full_name,
      u.username,
      u.avatar_url
    FROM conversations c
    JOIN conversation_participants cp1
      ON c.id = cp1.conversation_id
    JOIN conversation_participants cp2
      ON c.id = cp2.conversation_id
    JOIN users u
      ON cp2.user_id = u.id
    WHERE c.type = 'private'
      AND cp1.user_id = ?
      AND cp2.user_id != ?;
  `

  const result = await db.all(query, [id, id])

  res.json(result)
})

  

app.get('/conversations/:id', async (req, res) => {
  const { id } = req.params

  const query = `
    SELECT
      messages.id AS message_id,
      messages.message,
      messages.created_at,
      conversations.id AS conversation_id,
      conversations.type,
      users.id AS sender_id,
      users.username,
      users.avatar_url
    FROM messages
    JOIN conversations
      ON messages.conversation_id = conversations.id
    JOIN users
      ON messages.sender_id = users.id
    WHERE messages.conversation_id = ?
    ORDER BY messages.created_at ASC;
  `

  const result = await db.all(query, [id])

  res.json(result)
})



module.exports = app