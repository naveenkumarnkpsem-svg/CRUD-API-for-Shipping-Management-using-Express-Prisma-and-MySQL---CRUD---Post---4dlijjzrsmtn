const { SHIPPING_SECRET_KEY } = require('./authkey');

const authMiddleware = (req, res, next) => {
  const authKey = req.headers['shipping_secret_key'];

  if (!authKey) {
    return res.status(403).json({
      message: "SHIPPING_SECRET_KEY header is missing"
    });
  }

  if (authKey !== SHIPPING_SECRET_KEY) {
    return res.status(403).json({
      message: "Invalid SHIPPING_SECRET_KEY"
    });
  }

  next();
};

module.exports = { authMiddleware };
