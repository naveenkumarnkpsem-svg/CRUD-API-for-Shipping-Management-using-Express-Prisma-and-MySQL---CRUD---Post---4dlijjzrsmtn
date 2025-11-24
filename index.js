const express = require('express');
const dotenv = require('dotenv');
const shippingRoutes = require('./routes/shippingRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/shipping', shippingRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
module.exports = app;