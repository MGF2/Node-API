const express = require('express')
const app = express()
const port = 3000

// QUesta funyione ser,...
const testEndopoint = (req, res) => {
  res.send('Hello World! Sei in test')
}

const pollEndopoint = (req, res) => {
  res.send('Hello World! Sei in Poll')
}

const home = (req, res) => {
  res.send('Sei in home')
}


const general = {
  home
}

const auth = {
  testEndopoint,
  pollEndopoint
}


app.use(function (req, res, next) {
  if (checkToken()) {
    next()
  } else {
    res.send('ERROR')
  }
})


app.get('/', general.home)

app.post('/test', auth.testEndopoint)
app.post('/poll', auth.pollEndopoint)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
