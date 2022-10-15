const dbConnectionRequire = require('./db');

dbConnectionRequire();

const express = require('express')
const app = express()
const port = 5000;


app.get('/', (req, res) => {
  res.send('Hello How are you!')
})
app.use(express.json())
app.use('/api/auth', require('./Routes/auth'))
app.use('/api/note', require('./Routes/note'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})