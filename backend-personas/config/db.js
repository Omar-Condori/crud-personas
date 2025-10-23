// Importamos el módulo mysql2
const mysql = require('mysql2');
// Importamos dotenv para leer variables de entorno
require('dotenv').config();

// Creamos la conexión con variables de entorno
const connection = mysql.createConnection({
    host: process.env.DB_HOST,     // ⚠️ CAMBIADO
    user: process.env.DB_USER,     // ⚠️ CAMBIADO
    password: process.env.DB_PASSWORD, // ⚠️ CAMBIADO
    database: process.env.DB_DATABASE  // ⚠️ CAMBIADO
});

// (El resto de tu código de conexión.connect es igual)
connection.connect((error) => {
    if (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
        return;
    }
    console.log('✅ Conexión exitosa con MySQL');
});

module.exports = connection;