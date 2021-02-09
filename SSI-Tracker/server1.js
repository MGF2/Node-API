const express = require('express')
const redis = require("redis")
const jwt = require("jsonwebtoken")
const db = require("./data/db.js")
const app = express()
const port = 3000
const client = redis.createClient();

/* ****************** PROMISE  **************** */
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);
/* **************** PROMISE END **************** */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



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
  if (req.permissions.trackings && req.permissions.trackings.includes('r')) {
    try { // This calls are already async (coming from the server...)
      db('trackings').then((results) => {
        res.json({results});
      })
      return
    } catch (err) {
      res.sendStatus(502);
      return
    }
  }
  res.sendStatus(403)
}

const login = (req, res) => {
  // fake auth
  const user = { id: 1};
  const myKey = "my_key";
  const token = jwt.sign({ user }, myKey);

  res.json({
    token
  });

  /* **************** USE AN OBJECT ************** */
  const permissions = {
    "trackings": "rw",
    "profile": "r"
  }

 client.set(token, JSON.stringify(permissions))
  /**************** Quando lo ricevi nel checktoken .... */
  /* Fai il parse JSON.parse(valore da Redis) => oggetto originale.
  /* *************************************** */
 //db size
//  client.dbsize(redis.print);
}




// Questa e' la API in Scrittura
const trackingw = async (req, res, cToken) => {

  if (req.permissions.trackings && req.permissions.trackings.includes('w')) {

    const track = await db('trackings').insert(req.body).returning('*')

    console.log('New record created', track)
    res.json(track)

    return
  }

  res.sendStatus(403)
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


//MIDDLEWARE


// CHeck public / private
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


//CHeck token in session
app.use(async function (req, res, next) {
  if ( public.includes(req.url) ) {
    next()
  } else { // We had set it in the previous middlewre...
    try {
      req.permissions = await getAsync(req.token)
      req.permissions = JSON.parse(req.permissions);
      next()
    } catch(e) {
      res.sendStatus(403)
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
