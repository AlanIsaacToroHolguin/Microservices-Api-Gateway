const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const port = 3000; // El puerto principal que el cliente usará para acceder a la aplicación

// Definir los puertos de tus microservicios
const usersServiceUrl = 'http://localhost:3001';
const productsServiceUrl = 'http://localhost:3002';

// Middleware para parsear JSON, si es necesario para el API Gateway
app.use(express.json());

// Proxy para el servicio de usuarios
// Todas las peticiones a /users (GET, POST, PUT, DELETE) serán redirigidas al servicio de usuarios
app.use('/usuarios', proxy(usersServiceUrl, {
  // Opcional: para cambiar el nombre de la ruta si fuera necesario
  // Por ejemplo, si el microservicio usara /usuarios en lugar de /users
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/users', '/usuarios');
  }
}));

// Proxy para el servicio de productos
// Todas las peticiones a /products (GET, POST, PUT, DELETE) serán redirigidas al servicio de productos
app.use('/productos', proxy(productsServiceUrl, {
  // Opcional: para cambiar el nombre de la ruta si fuera necesario
  // Por ejemplo, si el microservicio usara /productos en lugar de /products
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/products', '/productos');
  }
}));

// Inicia el servidor del API Gateway
app.listen(port, () => {
  console.log(`API Gateway escuchando en http://localhost:${port}`);
  console.log(`Peticiones a /users se redirigen a ${usersServiceUrl}`);
  console.log(`Peticiones a /products se redirigen a ${productsServiceUrl}`);
});