const db = require("../database/db.js")

const tracking = (req, res) => {
    if (req.permissions.trackings && req.permissions.trackings.includes('r')) {
      try { // This calls are already async (coming from the server...)
        db('trackings').then((results) => {
          res.json({
            results
          });
        })
        return
      } catch (err) {
        res.sendStatus(502);
        return
      }
    }
    res.sendStatus(403)
  }

  module.exports = tracking;