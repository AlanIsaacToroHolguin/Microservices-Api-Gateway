
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = 3002;

// AGREGAR CORS
app.use(cors());

app.use(express.json());
connectDB();

app.use('/productos', productRoutes);

app.listen(port, () => {
  console.log(`Products Service escuchando en http://localhost:${port}`);
});
