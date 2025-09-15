// Obtener elementos por IDs únicos
const tabla = document.getElementById('tabla-secundaria');
const insertarBtn = document.getElementById('insertarBtn-secundaria');
const resetBtn = document.getElementById('resetBtn-secundaria');
const nuevoBtn = document.getElementById('nuevoBtn-secundaria');

// Ejemplo evento insertar (adaptar detalles a tu lógica)
insertarBtn.addEventListener('click', () => {
  // Ejemplo: crear fila en tabla
  const tbody = tabla.querySelector('tbody');
  const row = document.createElement('tr');

  // Puedes obtener datos de inputs con IDs modificados
  const id = document.getElementById('id-secundaria').value;
  const color = document.getElementById('color-secundaria').value;
  // ... otros campos ...

  // Crear celdas y añadir valores
  const tdId = document.createElement('td');
  tdId.textContent = id;
  row.appendChild(tdId);

  const tdColor = document.createElement('td');
  tdColor.textContent = color;
  row.appendChild(tdColor);

  // Añadir más celdas según columnas...
  
  tbody.appendChild(row);
});

// Añade aquí más funcionalidades adaptadas a los nuevos elementos

// Reset tabla
resetBtn.addEventListener('click', () => {
  const tbody = tabla.querySelector('tbody');
  tbody.innerHTML = '';
});

// Botón nuevo
nuevoBtn.addEventListener('click', () => {
  document.getElementById('horaentrada-secundaria').value = new Date().toLocaleTimeString('es-ES', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
});
