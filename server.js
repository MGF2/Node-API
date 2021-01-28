const express = require('express')
const fs = require("fs")
const jwt = require("jsonwebtoken")
const app = express()
const port = 3000



// QUesta funyione ser,...
function testEndopoint(req, res) {
  res.send('Hello World! Sei in test-protected')
}

const pollEndopoint = (req, res) => {
  res.send('Hello World! Sei in Poll-protected')
}

const home = (req, res) => {
  res.send('Sei in home')
}

const login = (req, res) => {
  // fake auth
  const user = { id: 1};
  const myKey = "my_key";
  const token = jwt.sign({ user }, myKey);

  res.json({
    token
  });

}

const exp = (req, res) => {
  res.send('Sei in exp')
  fs.readFile("expression.json", function(err, data) {
    if (err) {
      throw err;
  } else {
    const exps = JSON.parse(data);
    console.log(exps);
  }
  })
}


const general = {
  home,
  exp,
  login
}

const auth = {
  testEndopoint,
  pollEndopoint
}


 /* app.use(function (req, res, next) {
   if (checkToken()) {
     next()
   } else {
    //  res.send('ERROR')
     res.sendStatus(403)
  }
 }) */

//to fix
function checkToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next()
  } else {
    res.sendStatus(403)
  }
}


app.get('/', general.home)
app.get('/exp', general.exp)
app.post('/login', general.login)

app.post('/test', checkToken, auth.testEndopoint)
app.post('/poll', checkToken, auth.pollEndopoint)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
