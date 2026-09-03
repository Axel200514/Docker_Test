const express = require('express');
require('dotenv').config();
const productosRoutes = require('./src/routes/productos.routes');
const categoriasRoutes = require('./src/routes/categorias.routes');
const cajerosRoutes = require('./src/routes/cajeros.routes');
const ventaRoutes = require('./src/routes/venta.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', productosRoutes);
app.use('/api', categoriasRoutes);
app.use('/api', cajerosRoutes);
app.use('/api', ventaRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});