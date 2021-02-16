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

  module.exports = checkToken;