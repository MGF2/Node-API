const express = require('express')
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
  const tracking = await db('trackings');
  //--add errors--
  res.json({tracking});
}

//GENERAL
const general = {
  home,
  tracking
}

//GENERAL ROUTES
app.get('/', general.home)
app.get('/tracking', general.tracking)
