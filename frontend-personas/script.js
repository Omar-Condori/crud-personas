// ===================================
// CONFIGURACIÓN INICIAL
// ===================================

const API_URL = 'http://localhost:3000/api/personas';

let modoEdicion = false;
let idEditando = null;

// ===================================
// ELEMENTOS DEL DOM
// ===================================

const formulario = document.getElementById('personaForm');
const inputId = document.getElementById('personaId');
const inputNombre = document.getElementById('nombre');
const inputApellidos = document.getElementById('apellidos');
const inputDni = document.getElementById('dni');
const selectCargo = document.getElementById('cargo');

const btnSubmit = document.getElementById('btnSubmit');
const btnCancelar = document.getElementById('btnCancelar');

const tablaBody = document.getElementById('tablaBody');
const loading = document.getElementById('loading');
const noData = document.getElementById('noData');
const formTitle = document.getElementById('form-title');

// ===================================
// EVENTOS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    obtenerPersonas();
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (modoEdicion) {
        actualizarPersona();
    } else {
        crearPersona();
    }
});

btnCancelar.addEventListener('click', () => {
    cancelarEdicion();
});

// ===================================
// FUNCIONES CRUD
// ===================================

async function obtenerPersonas() {
    try {
        loading.style.display = 'block';
        noData.style.display = 'none';
        
        const respuesta = await fetch(API_URL);
        
        if (!respuesta.ok) {
            throw new Error('Error al obtener los datos');
        }
        
        const personas = await respuesta.json();
        
        loading.style.display = 'none';
        
        if (personas.length === 0) {
            noData.style.display = 'block';
            tablaBody.innerHTML = '';
            return;
        }
        
        renderizarTabla(personas);
        
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        mostrarNotificacion('Error al cargar los datos', 'error');
    }
}

async function crearPersona() {
    try {
        const nuevaPersona = {
            nombre: inputNombre.value.trim(),
            apellidos: inputApellidos.value.trim(),
            dni: inputDni.value.trim().toUpperCase(),
            cargo: selectCargo.value
        };
        
        if (!nuevaPersona.nombre || !nuevaPersona.apellidos || 
            !nuevaPersona.dni || !nuevaPersona.cargo) {
            mostrarNotificacion('Todos los campos son obligatorios', 'error');
            return;
        }
        
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaPersona)
        });
        
        const datos = await respuesta.json();
        
        if (!respuesta.ok) {
            throw new Error(datos.error || 'Error al crear la persona');
        }
        
        mostrarNotificacion('✅ Persona creada exitosamente', 'success');
        limpiarFormulario();
        obtenerPersonas();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message, 'error');
    }
}

async function actualizarPersona() {
    try {
        const personaActualizada = {
            nombre: inputNombre.value.trim(),
            apellidos: inputApellidos.value.trim(),
            dni: inputDni.value.trim().toUpperCase(),
            cargo: selectCargo.value
        };
        
        if (!personaActualizada.nombre || !personaActualizada.apellidos || 
            !personaActualizada.dni || !personaActualizada.cargo) {
            mostrarNotificacion('Todos los campos son obligatorios', 'error');
            return;
        }
        
        const respuesta = await fetch(`${API_URL}/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personaActualizada)
        });
        
        const datos = await respuesta.json();
        
        if (!respuesta.ok) {
            throw new Error(datos.error || 'Error al actualizar la persona');
        }
        
        mostrarNotificacion('✅ Persona actualizada exitosamente', 'success');
        cancelarEdicion();
        obtenerPersonas();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message, 'error');
    }
}

async function eliminarPersona(id, nombre) {
    const confirmacion = confirm(
        `¿Estás seguro de eliminar a ${nombre}?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmacion) return;
    
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const datos = await respuesta.json();
        
        if (!respuesta.ok) {
            throw new Error(datos.error || 'Error al eliminar la persona');
        }
        
        mostrarNotificacion('✅ Persona eliminada exitosamente', 'success');
        obtenerPersonas();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message, 'error');
    }
}

// ===================================
// FUNCIONES AUXILIARES
// ===================================

function renderizarTabla(personas) {
    tablaBody.innerHTML = '';
    
    personas.forEach(persona => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${persona.id}</td>
            <td>${persona.nombre}</td>
            <td>${persona.apellidos}</td>
            <td>${persona.dni}</td>
            <td>${persona.cargo}</td>
            <td>
                <button 
                    class="btn-edit" 
                    onclick="editarPersona(${persona.id})">
                    ✏️ Editar
                </button>
                <button 
                    class="btn-delete" 
                    onclick="eliminarPersona(${persona.id}, '${persona.nombre}')">
                    🗑️ Eliminar
                </button>
            </td>
        `;
        
        tablaBody.appendChild(fila);
    });
}

async function editarPersona(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);
        
        if (!respuesta.ok) {
            throw new Error('Error al obtener los datos de la persona');
        }
        
        const persona = await respuesta.json();
        
        modoEdicion = true;
        idEditando = id;
        
        inputId.value = persona.id;
        inputNombre.value = persona.nombre;
        inputApellidos.value = persona.apellidos;
        inputDni.value = persona.dni;
        selectCargo.value = persona.cargo;
        
        formTitle.textContent = '✏️ Editar Persona';
        btnSubmit.textContent = '💾 Actualizar';
        btnCancelar.style.display = 'inline-block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message, 'error');
    }
}

function cancelarEdicion() {
    modoEdicion = false;
    idEditando = null;
    
    limpiarFormulario();
    
    formTitle.textContent = '➕ Agregar Nueva Persona';
    btnSubmit.textContent = '💾 Guardar';
    btnCancelar.style.display = 'none';
}

function limpiarFormulario() {
    formulario.reset();
    inputId.value = '';
    inputNombre.focus();
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.getElementById('notification');
    
    notificacion.textContent = mensaje;
    notificacion.className = `notification ${tipo}`;
    
    setTimeout(() => {
        notificacion.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notificacion.classList.remove('show');
    }, 3000);
}