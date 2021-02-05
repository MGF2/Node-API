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

const tracking = async (req, res) => {
  //get all
  try {
    const tracking = await db('trackings');
    res.json({tracking});
  } catch (err) {
   //or send error
    res.sendStatus(502);
  }

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
  client.set(token, "r", redis.print);
  // client.get(token, redis.print);
}

const trackingw = (req, res) => {
  res.send('Sei in tracking-p')
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

const private = [
  '/trackingw'
];


//MIDDLEWARE
app.use(function (req, res, next) {
  if ( public.includes(req.url) ) {
    next()
  } else {
    if ( checkToken(req) ) {
      const cToken = req.token;
      client.get(cToken, (err,reply) => {

        if ( private.includes(req.url) ) {
          if ((reply !== null) && (reply.includes('w'))) {
            console.log(reply)
            console.log('Ok!')
            next()
          } else {
            console.log('Non hai i permessi di scrittura')
            res.sendStatus(403)
          }

        } else {
          if ((reply !== null) && (reply.includes('r'))) {
            console.log(reply)
            console.log('Ok!')
            next()
          } else {
            console.log('Non hai i permessi di lettura')
            res.sendStatus(403)
          }
        }

      });

    } else {
      res.sendStatus(401)
   }
  }
});

//FUNCTIONS
function checkToken(req) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
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



