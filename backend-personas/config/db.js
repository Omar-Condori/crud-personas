// Importamos el módulo mysql2 para conectarnos a la base de datos
const mysql = require('mysql2');

// Creamos la conexión con los datos de tu MySQL
const connection = mysql.createConnection({
    host: 'localhost',        // Servidor donde está MySQL (tu computadora)
    user: 'root',             // Usuario de MySQL (por defecto es 'root')
    password: '45275975',  // ⚠️ CAMBIAR: Pon aquí tu contraseña de MySQL
    database: 'crud_personas' // Nombre de la base de datos que creamos
});

// Intentamos conectar a la base de datos
connection.connect((error) => {
    if (error) {
        // Si hay error, lo mostramos en la consola
        console.error('❌ Error al conectar con la base de datos:', error.message);
        return;
    }
    // Si todo salió bien, mostramos un mensaje de éxito
    console.log('✅ Conexión exitosa con MySQL');
});

// Exportamos la conexión para usarla en otros archivos
module.exports = connection;