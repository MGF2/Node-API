const express = require('express')
const redis = require("redis")
const db = require("./data/db.js")
const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

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


//GENERAL
const general = {
  home,
  tracking
}

//GENERAL ROUTES
app.get('/', general.home)
app.get('/tracking', general.tracking)
