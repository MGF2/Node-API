const jwt = require("jsonwebtoken")
const redis = require("redis")
// const client = redis.createClient(6379, "redis");
const client = process.env.PG_HOST ? redis.createClient(6379, "localhost") : redis.createClient(6379, "redis")

const login = (req, res) => {
    // fake auth
    /* const user = { id: 1};
    const myKey = "my_key";
    const token = jwt.sign({ user }, myKey); */
    const user = req.body;
    const myKey = "ok";
    const token = jwt.sign({ user }, myKey); 

  
    res.json({
      token
    });
  
    /* **************** USE AN OBJECT ************** */
    const permissions = {
      "trackings": "rw",
      "profile": "r"
    }
  
  //  client.set(token, JSON.stringify(permissions))
   client.set(token, JSON.stringify(permissions))

  //  client.get(token, redis.print)
   
    /**************** Quando lo ricevi nel checktoken .... */
    /* Fai il parse JSON.parse(valore da Redis) => oggetto originale.
    /* *************************************** */
   //db size
    // client.dbsize(redis.print);
  }

  module.exports = login;