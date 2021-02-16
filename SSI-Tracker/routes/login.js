const jwt = require("jsonwebtoken")
const redis = require("redis")
const client = redis.createClient();

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

  module.exports = login;