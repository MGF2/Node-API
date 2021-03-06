const express = require('express')
const redis = require("redis")
const jwt = require("jsonwebtoken")
const db = require("./data/db.js")
const app = express()
const port = 3000
const client = redis.createClient();

//REDIS
client.on('connect', function() {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

//ENDPOINTS
const home = (req, res) => {
  res.send('Sei in home')
}

const tracking = (req, res) => {
  client.get(req.token, (err,reply) => {  // Vediamo se il token e' valido....
    if (reply && reply.includes('r')) { // Ho il permesso di lettura?
        try { // This calls are already async (coming from the server...)
          db('trackings').then((results) => {
            res.json({results});
          })
        } catch (err) {
        //or send error
        res.sendStatus(502);
      }
      return  // Esci dopo aver completato la funzionalita'
    }
    res.sendStatus(403)
  })  //get all
}

const login = (req, res) => {
  // fake auth
  const user = { id: 1};
  const myKey = "my_key";
  const token = jwt.sign({ user }, myKey);

  res.json({
    token
  });
  // set token in redis with value rw
  client.set(token, "rw");

}


// Questa e' la API in Scrittura
const trackingw = (req, res, cToken) => {
  client.get(req.token, (err,reply) => {  // Vediamo se il token e' valido....
    if (reply && reply.includes('w')) { // Ho il permesso di scrittura?
        res.send('Sei in tracking-p')
        return  // Esci dopo aver completato la funzionalita'
    }
    res.sendStatus(403)
  })
}


//GENERAL
const general = {
  home,
  tracking,
  trackingw,
  login
}

const public = [
  '/',
  '/login'
];

/* Non serve, solo le pubbliche vanno testate (che di solito sono poche)
const private = [
  '/trackingw'
];
*/

//MIDDLEWARE
app.use(function (req, res, next) {
  if ( public.includes(req.url) ) {
    next()
  } else {
    if ( checkToken(req) ) {
      // Il token c'e', ma non sappiamo ancora se e' valido...
      next()
    }
  }
});

//FUNCTIONS
function checkToken(req) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;  // Hai assegnato il token alla req, usalo poi...
    return true;
  } else {
    return false;
  }
}

//GENERAL ROUTES
app.get('/', general.home)
app.get('/tracking', general.tracking)
app.post('/trackingw', general.trackingw)
app.post('/login', general.login)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
