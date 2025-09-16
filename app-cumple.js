// Obtener elementos por sus IDs
const tabla = document.getElementById('tabla');
const insertarBtn = document.getElementById('insertarBtn');
const resetBtn = document.getElementById('resetBtn');
const nuevoBtn = document.getElementById('nuevoBtn');

// Función para insertar fila en tabla
insertarBtn.addEventListener('click', () => {
  const tbody = tabla.querySelector('tbody');
  const row = document.createElement('tr');

  // Obtener valores de inputs
  const id = document.getElementById('id').value.trim();
  const color = document.getElementById('color').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const horaentrada = document.getElementById('horaentrada').value.trim();
  const tiempoJuego = document.getElementById('tiempoJuego').value.trim();
  const horasalida = document.getElementById('horasalida').value.trim();
  const abonado = document.getElementById('abonado').value.trim();

  // Validar campos básicos (ejemplo)
  if (!id || !nombre) {
    alert('Los campos ID y NOMBRE son obligatorios.');
    return;
  }

  // Crear celdas con valores
  row.innerHTML = `
    <td>${id}</td>
    <td>${color}</td>
    <td>${nombre}</td>
    <td>${telefono}</td>
    <td>${horaentrada}</td>
    <td>${tiempoJuego}</td>
    <td>${horasalida}</td>
    <td></td> <!-- RESTANTE, si lo calculas pon aquí -->
    <td>${abonado}</td>
    <td></td> <!-- AVISADO, puedes poner ícono o texto -->
  `;

  tbody.appendChild(row);

  // Opcional, limpiar formulario después de insertar
  resetFormulario();
});

// Resetea tabla completa
resetBtn.addEventListener('click', () => {
  const tbody = tabla.querySelector('tbody');
  tbody.innerHTML = '';
});

// Poner hora actual en hora de entrada
nuevoBtn.addEventListener('click', () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('horaentrada').value = `${hh}:${mm}`;
});

// Función para limpiar formulario
function resetFormulario() {
  const ids = ['id', 'color', 'nombre', 'telefono', 'horaentrada', 'tiempoJuego', 'horasalida', 'abonado'];
  ids.forEach(id => (document.getElementById(id).value = ''));
}
