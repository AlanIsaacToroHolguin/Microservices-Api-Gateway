const express = require('express');
require('dotenv').config();

const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes'); 

const app = express();
const port = 3001;

app.use(express.json());

app.use('/usuarios', userRoutes);
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(port, () => {
      console.log(`Users Service escuchando en http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
};

syncDatabase();
