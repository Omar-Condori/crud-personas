// Importamos express para crear las rutas
const express = require('express');
const router = express.Router();

// Importamos la conexión a la base de datos
const db = require('../config/db');

// ============================================
// 1. OBTENER TODAS LAS PERSONAS (READ - Listar)
// ============================================
router.get('/', (req, res) => {
    // Consulta SQL para obtener todos los registros
    const sql = 'SELECT * FROM personas ORDER BY id DESC';
    
    // Ejecutamos la consulta
    db.query(sql, (error, resultados) => {
        if (error) {
            // Si hay error, devolvemos código 500 (error del servidor)
            return res.status(500).json({ 
                error: 'Error al obtener las personas',
                detalles: error.message 
            });
        }
        // Si todo está bien, devolvemos los datos en formato JSON
        res.json(resultados);
    });
});

// ============================================
// 2. OBTENER UNA PERSONA POR ID (READ - Individual)
// ============================================
router.get('/:id', (req, res) => {
    // Obtenemos el id desde la URL (ejemplo: /personas/5)
    const { id } = req.params;
    
    // Consulta SQL para buscar por id
    const sql = 'SELECT * FROM personas WHERE id = ?';
    
    // El '?' se reemplaza con el valor de [id] para evitar SQL injection
    db.query(sql, [id], (error, resultados) => {
        if (error) {
            return res.status(500).json({ 
                error: 'Error al obtener la persona',
                detalles: error.message 
            });
        }
        
        // Si no encontró ninguna persona con ese id
        if (resultados.length === 0) {
            return res.status(404).json({ 
                error: 'Persona no encontrada' 
            });
        }
        
        // Devolvemos la primera (y única) persona encontrada
        res.json(resultados[0]);
    });
});

// ============================================
// 3. CREAR UNA NUEVA PERSONA (CREATE)
// ============================================
router.post('/', (req, res) => {
    // Obtenemos los datos que vienen del frontend
    const { nombre, apellidos, dni, cargo } = req.body;
    
    // Validamos que todos los campos estén presentes
    if (!nombre || !apellidos || !dni || !cargo) {
        return res.status(400).json({ 
            error: 'Todos los campos son obligatorios' 
        });
    }
    
    // Consulta SQL para insertar un nuevo registro
    const sql = 'INSERT INTO personas (nombre, apellidos, dni, cargo) VALUES (?, ?, ?, ?)';
    
    // Ejecutamos la consulta con los datos
    db.query(sql, [nombre, apellidos, dni, cargo], (error, resultado) => {
        if (error) {
            // Si el DNI ya existe, MySQL devuelve un error específico
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    error: 'El DNI ya está registrado' 
                });
            }
            return res.status(500).json({ 
                error: 'Error al crear la persona',
                detalles: error.message 
            });
        }
        
        // Devolvemos el id de la persona creada y un mensaje de éxito
        res.status(201).json({ 
            mensaje: 'Persona creada exitosamente',
            id: resultado.insertId 
        });
    });
});

// ============================================
// 4. ACTUALIZAR UNA PERSONA (UPDATE)
// ============================================
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, dni, cargo } = req.body;
    
    // Validamos que todos los campos estén presentes
    if (!nombre || !apellidos || !dni || !cargo) {
        return res.status(400).json({ 
            error: 'Todos los campos son obligatorios' 
        });
    }
    
    // Consulta SQL para actualizar el registro
    const sql = 'UPDATE personas SET nombre = ?, apellidos = ?, dni = ?, cargo = ? WHERE id = ?';
    
    db.query(sql, [nombre, apellidos, dni, cargo, id], (error, resultado) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    error: 'El DNI ya está registrado por otra persona' 
                });
            }
            return res.status(500).json({ 
                error: 'Error al actualizar la persona',
                detalles: error.message 
            });
        }
        
        // Si affectedRows es 0, significa que no existe ese id
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Persona no encontrada' 
            });
        }
        
        res.json({ 
            mensaje: 'Persona actualizada exitosamente' 
        });
    });
});

// ============================================
// 5. ELIMINAR UNA PERSONA (DELETE)
// ============================================
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    // Consulta SQL para eliminar el registro
    const sql = 'DELETE FROM personas WHERE id = ?';
    
    db.query(sql, [id], (error, resultado) => {
        if (error) {
            return res.status(500).json({ 
                error: 'Error al eliminar la persona',
                detalles: error.message 
            });
        }
        
        // Si affectedRows es 0, no existe ese id
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Persona no encontrada' 
            });
        }
        
        res.json({ 
            mensaje: 'Persona eliminada exitosamente' 
        });
    });
});

// Exportamos el router para usarlo en server.js
module.exports = router;