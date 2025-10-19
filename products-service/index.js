

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Carga las variables de entorno
const Product = require('./models/productsModels'); // Importa el modelo

const app = express();
const port = 3002;

app.use(express.json());

// // Conexión a MongoDB
const mongoUri = process.env.DATABASE_URL;
mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.get('/productos', async (req, res) => {
    try {
        const products = await Product.find(); // Usa Mongoose para buscar
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
});

app.get('/productos/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        // Maneja el error si el ID no es válido para Mongoose
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de producto inválido' });
        }
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
});

// POST /products: Crea un nuevo producto
app.post('/productos', async (req, res) => {
    try {
        const newProduct = new Product(req.body); // Crea una nueva instancia del modelo
        const savedProduct = await newProduct.save(); // Guarda el producto en la DB
        res.status(201).json(savedProduct);
    } catch (error) {
        // Manejo de errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
});

app.put('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // La opción { new: true } devuelve el documento actualizado
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }        
        res.json(updatedProduct);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de producto inválido' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
    }
});

// DELETE /products/:id: Elimina un producto
app.delete('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }        
        // No se devuelve contenido, solo un código de éxito
        res.status(204).send();
       
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de producto inválido' });
        }
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Products Service listening at http://localhost:${port}`);
});


// Esto asegura que la aplicación se conecte a la base de datos antes de iniciar el servidor.

