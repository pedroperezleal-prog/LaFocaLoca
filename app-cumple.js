// Función para actualizar el color visual del select
function updateColorText() {
  const colorSelect = document.getElementById('color');
  const selectedColor = colorSelect.value;
  switch (selectedColor) {
    case 'azul':
      colorSelect.style.color = 'blue';
      break;
    case 'verde':
      colorSelect.style.color = 'green';
      break;
    case 'rojo':
      colorSelect.style.color = 'red';
      break;
    default:
      colorSelect.style.color = 'black';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateColorText(); // aplicar color inicial

  document.getElementById('color').addEventListener('change', updateColorText);

  document.getElementById('insertarBtn').addEventListener('click', () => {
    // Capturar valores del formulario
    const id = document.getElementById('id').value.trim();
    const color = document.getElementById('color').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const meriendaSelect = document.getElementById('merienda');
    const merienda = meriendaSelect.options[meriendaSelect.selectedIndex].text;
    const observaciones = document.getElementById('observaciones').value.trim();

    // Validar campos obligatorios
    if (!id || !nombre) {
      alert('Los campos ID y NOMBRE son obligatorios.');
      return;
    }

    // Seleccionar tbody de tabla correcta
    const tablaBody = document.querySelector(`.tabla-${color} tbody`);
    if (!tablaBody) {
      alert('No se encontró la tabla para el color seleccionado.');
      return;
    }

    // Crear nueva fila con datos
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
      <td>${id}</td>
      <td>${nombre}</td>
      <td>${telefono}</td>
      <td>${merienda}</td>
      <td>${observaciones}</td>
    `;

    // Añadir fila a la tabla
    tablaBody.appendChild(nuevaFila);

    // Limpiar formulario
    document.getElementById('id').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('merienda').selectedIndex = 0;
    document.getElementById('observaciones').value = '';
    document.getElementById('color').value = 'azul';
    updateColorText();
  });
});

// Registro del service worker si está disponible
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js');
  });
}
