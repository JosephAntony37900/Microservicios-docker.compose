const API_URL = 'http://54.224.213.119:5000';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-usuario');
    const inputNombre = document.getElementById('nombre-usuario');
    const listaUsuarios = document.getElementById('lista-usuarios');

    // Función para cargar los usuarios
    const cargarUsuarios = async () => {
        try {
            const response = await fetch(`${API_URL}/usuarios`);
            if (!response.ok) throw new Error('Error al cargar datos de la API');
            const usuarios = await response.json();

            listaUsuarios.innerHTML = ''; // Limpiar lista
            if (usuarios.length === 0) {
                listaUsuarios.innerHTML = '<li>No hay usuarios registrados.</li>';
                return;
            }

            usuarios.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `ID: ${user.id} - Nombre: ${user.nombre}`;
                listaUsuarios.appendChild(li);
            });

        } catch (error) {
            console.error(error);
            listaUsuarios.innerHTML = `<li>Error al cargar usuarios: ${error.message}. ¿La API (puerto 5000) está accesible?</li>`;
        }
    };

    // Función para guardar un usuario
    const guardarUsuario = async (e) => {
        e.preventDefault();
        const nombre = inputNombre.value;

        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: nombre }),
            });

            if (!response.ok) throw new Error('Error al guardar');

            inputNombre.value = ''; // Limpiar input
            cargarUsuarios(); // Recargar la lista

        } catch (error) {
            console.error(error);
            alert('Error al guardar el usuario.');
        }
    };

    // Asignar eventos
    form.addEventListener('submit', guardarUsuario);

    // Carga inicial
    cargarUsuarios();
});
