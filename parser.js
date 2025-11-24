const { SHIPPING_SECRET_KEY } = require('./middleware/authkey');

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

module.exports = { authenticateAPIKey };
