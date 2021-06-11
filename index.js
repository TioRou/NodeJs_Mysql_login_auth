const express = require('express');
const app = express();
require('dotenv').config();

// Lectura y parseo del body
app.use(express.json());

// Mis rutas
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('Server on port', process.env.PORT);
});