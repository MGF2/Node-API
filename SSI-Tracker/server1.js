const express = require('express')
const redis = require("redis")
const app = express()
const port = process.env.PG_PORT || 3000
const client = redis.createClient();
const validate = require('./middlewares/validation/validation.js')
const postTrackingSchema = require('./middlewares/validation/schemas/trackingSchema.js')
const checkToken = require('./middlewares/token.js')
const { checkSchema } = require('express-validator');
const general = require('./routes/routes');

// PROMISE
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



//REDIS CONNECTION
client.on('connect', function() {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});


const public = [
  '/',
  '/login'
];


//MIDDLEWARES

// CHeck public / private
app.use(function (req, res, next) {
  if (public.includes(req.url)) {
    next()
  } else {
    if (checkToken(req)) {
      // Il token c'e', ma non sappiamo ancora se e' valido...
      next()
    }
  }
});


//CHeck token in session
app.use(async function (req, res, next) {
  if (public.includes(req.url)) {
    next()
  } else { // We had set it in the previous middlewre...
    try {
      req.permissions = await getAsync(req.token)
      req.permissions = JSON.parse(req.permissions);
      next()
    } catch (e) {
      res.sendStatus(403)
    }
  }
});


//GENERAL ROUTES
app.get('/', general.home)
app.get('/tracking', general.tracking)
app.post('/trackingw', validate(checkSchema(postTrackingSchema)), general.trackingw)
app.post('/login', general.login)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
