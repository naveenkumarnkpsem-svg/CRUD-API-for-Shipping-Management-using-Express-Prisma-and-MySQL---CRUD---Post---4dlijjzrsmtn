const { SHIPPING_SECRET_KEY } = require('./authkey');

const authenticateAPIKey = (req, res, next) => {
  const authKey = req.headers['shipping_secret_key'] || req.headers['SHIPPING_SECRET_KEY'] || req.headers['apiauthkey'];

  if (!authKey) {
    return res.status(403).json({
      error: "SHIPPING_SECRET_KEY header is missing"
    });
  }

  if (authKey !== SHIPPING_SECRET_KEY) {
    return res.status(403).json({
      error: "Invalid SHIPPING_SECRET_KEY"
    });
  }

  next();
};

// Export the middleware as both the default export (function) and a named property
module.exports = authenticateAPIKey;
module.exports.authenticateAPIKey = authenticateAPIKey;
