// Importamos las dependencias necesarias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importamos las rutas de personas
const personasRoutes = require('./routes/personas');

// Creamos la aplicación de Express
const app = express();

// Definimos el puerto donde correrá el servidor
const PORT = 3000;

// ============================================
// MIDDLEWARES (Configuraciones)
// ============================================

// CORS: Permite que el frontend (puerto diferente) se comunique con el backend
app.use(cors());

// Body Parser: Permite leer datos JSON del frontend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para logging (opcional pero útil)
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.url} - ${new Date().toLocaleString()}`);
    next();
});

// ============================================
// RUTAS
// ============================================

// Ruta de bienvenida para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.json({ 
        mensaje: '🚀 Servidor CRUD de Personas funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            'GET /api/personas': 'Obtener todas las personas',
            'GET /api/personas/:id': 'Obtener una persona por ID',
            'POST /api/personas': 'Crear una nueva persona',
            'PUT /api/personas/:id': 'Actualizar una persona',
            'DELETE /api/personas/:id': 'Eliminar una persona'
        }
    });
});

// Usamos las rutas de personas con el prefijo /api/personas
app.use('/api/personas', personasRoutes);

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ============================================
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        ruta: req.url 
    });
});

// ============================================
// MANEJO DE ERRORES GENERALES
// ============================================
app.use((error, req, res, next) => {
    console.error('❌ Error en el servidor:', error);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        detalles: error.message 
    });
});

// ============================================
// INICIAR EL SERVIDOR
// ============================================
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 API disponible en http://localhost:${PORT}/api/personas`);
    console.log('=================================');
});