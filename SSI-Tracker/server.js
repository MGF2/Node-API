const express = require('express')
const knex = require('knex')
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

//GENERAL
const general = {
  home
}

//GENERAL ROUTES
app.get('/', general.home)
