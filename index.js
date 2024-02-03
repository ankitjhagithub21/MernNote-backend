require('dotenv').config()
const express = require('express')
const cors = require('cors');
const app = express()
const connectDb = require('./db');
const authRoutes = require('./routes/auth-routes');
const noteRoutes = require('./routes/note-routes');
const port = 3000

connectDb()

const corsOption = {
  origin:"*",
  methods:["GET",'PUT','POST','DELETE'],
  Credentials: true,
}
app.use(express.json())
app.use(cors(corsOption))
app.use("/api/auth",authRoutes)
app.use("/api/note",noteRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

