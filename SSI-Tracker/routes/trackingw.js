const db = require("../database/db.js")

const trackingw = async (req, res, cToken) => {

    if (req.permissions && req.permissions.trackings && req.permissions.trackings.includes('w')) {
  
      try {
        const track = await db('trackings').insert(req.body).returning('*')
        res.sendStatus(200)
  
        console.log('New record created', track)
        // res.json(track)
        return
      } catch (err) {
        console.log(err)
        res.sendStatus(412)
        return
      }
    } else {
      res.sendStatus(403)
    }
   }

   module.exports = trackingw;