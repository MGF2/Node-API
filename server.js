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


/*
 Bene ottimo lavoro qui.

 Alcuni punti:
 1. Sei in una API quindi "throw err" non va bene. Devi sempre ritornare un codice di errore
  altrimenti il front end non sa che fare.
 2. Se metti le varie funzioni "add", "sub" etc. in un array poi puoi chiamarle direttamente usando la chiave
    exps[i] => key e non ti serve l'IF. Giusto?
 3. QUando tutto e' andato a uon fine, ritorna il risultato al chiamante... res.send(...)

*/

const exp = (req, res) => {
  res.send('Sei in exp')
  fs.readFile("expression.json", function(err, data) {
    if (err) {
      throw err;
  } else {
    const exps = JSON.parse(data);
    for (i=0; i < exps.length; i++) {
      for (var key in exps[i]) {
        if (key === 'add') {
          result = sum(exps[i].add.v1,exps[i].add.v2);
        } if (key === 'sub') {
          result = sub(exps[i].sub.v1,exps[i].sub.v2);
        } if (key === 'mul') {
          result = mul(exps[i].mul.v1,exps[i].mul.v2);
        } if (key === 'div') {
          result = div(exps[i].div.v1,exps[i].div.v2);
        }
        console.log(result);
      }
    }
   }
 });
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


 /*
   Ok. Non hai usato il middleware. Il risultato conseguito funziona, ma non e' scalabile
   Quando creo un nuovo endpoint devo sempre ricordarmi che ci sono due modi di chiamata:
   pubblici, senza controllo, e privati con controllo.
   Immagina se dovessi fare un secondo controllo su un content type per esmpio. Faresti un terzo modo di chiamata?
   I middleware "app,use" ti facilitano il lavoro.... 
 */

//ROUTES
app.get('/', general.home)
app.get('/exp', general.exp)
app.post('/login', general.login)

app.post('/test', checkToken, auth.testEndopoint)
app.post('/poll', checkToken, auth.pollEndopoint)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//FUNCTIONS
function sum(a,b) {
  return a+b;
}

function sub(a,b) {
  return a-b;
}

function mul(a,b) {
  return a*b;
}

function div(a,b) {
  return a/b;
}

//TOKEN FUNCTION
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
