
const express = require('express')
require('dotenv').config()

const sequelize = require('./config/database')
const User = require('./models/User')
const app = express()
const port = 3001

app.use(express.json())

const syncDatabase = async () => {
  try {
    // Autentica la conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');
    
    // Sincroniza los modelos con las tablas de la base de datos
    await sequelize.sync({ alter: true }); // `alter: true` actualiza las tablas sin perder datos
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(port, () => {
      console.log(`Users Service listening at http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
};

app.get('/usuarios', async (req, res) => {
  try {
    const users = await User.findAll(); // Usa Sequelize para buscar todos los usuarios
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id); // Busca por clave primaria (id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email,telefono } = req.body;
    // La validación se realiza aquí antes de crear el usuario
    if (!nombre || !email || !telefono) {
      return res.status(400).json({ message: 'Los campos son obligatorios.' });
    }
    const newUser = await User.create({ nombre, email,telefono }); // Usa Sequelize para crear un usuario
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const [updatedRows] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const deletedRows = await User.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
})

syncDatabase();
