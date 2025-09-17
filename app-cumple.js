// Función para actualizar color visual del select #color
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

// Insertar fila en tabla según color
function insertarFila() {
  const id = document.getElementById('id').value.trim();
  const color = document.getElementById('color').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const meriendaSelect = document.getElementById('merienda');
  const merienda = meriendaSelect.options[meriendaSelect.selectedIndex].text;
  const observaciones = document.getElementById('observaciones').value.trim();

  if (!id || !nombre) {
    alert('Los campos ID y NOMBRE son obligatorios.');
    return;
  }

  const tablaBody = document.querySelector(`.tabla-${color} tbody`);
  if (!tablaBody) {
    alert('No se encontró la tabla para el color seleccionado.');
    return;
  }

  // Crear fila
  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td>${id}</td>
    <td>${nombre}</td>
    <td>${telefono}</td>
    <td>${merienda}</td>
    <td>${observaciones}</td>
  `;

  tablaBody.appendChild(nuevaFila);

  // Limpiar formulario
  document.getElementById('id').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('telefono').value = '';
  document.getElementById('merienda').selectedIndex = 0;
  document.getElementById('observaciones').value = '';
  document.getElementById('color').value = 'azul';
  updateColorText();
}

// Limpiar tabla
function limpiarTabla(color) {
  const tablaBody = document.querySelector(`.tabla-${color} tbody`);
  if (!tablaBody) return;
  tablaBody.innerHTML = '';
}

// Exportar tabla a CSV (compatible Excel)
function exportarTablaExcel(color) {
  const tabla = document.querySelector(`.tabla-${color}`);
  if (!tabla) return;

  let csv = '';
  const filas = tabla.querySelectorAll('tr');
  filas.forEach(fila => {
    const columnas = fila.querySelectorAll('th,td');
    let filaCSV = [];
    columnas.forEach(col => {
      let texto = col.innerText.replace(/"/g, '""');
      filaCSV.push(`"${texto}"`);
    });
    csv += filaCSV.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.setAttribute('href', url);
  enlace.setAttribute('download', `tabla_${color}.csv`);
  enlace.style.display = 'none';
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
}

// Exportar tabla a PDF (requiere jsPDF y plugin AutoTable)
// Recuerda agregar las librerías jsPDF y jsPDF-AutoTable en tu HTML.
function exportarTablaPDF(color) {
  const tabla = document.querySelector(`.tabla-${color}`);
  if (!tabla) return;

  if (window.jspdf && window.jspdf.jsPDF) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(`Tabla color ${color}`, 14, 20);
    doc.autoTable({ html: tabla, startY: 30 });
    doc.save(`tabla_${color}.pdf`);
  } else {
    alert('Para exportar a PDF, incluye la librería jsPDF y jsPDF-autoTable.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateColorText();

  document.getElementById('color').addEventListener('change', updateColorText);
  document.getElementById('insertarBtn').addEventListener('click', insertarFila);

  // Eventos de botones de acción en las tablas
  document.querySelectorAll('.tabla-accion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tablaColor = btn.getAttribute('data-tabla');
      const accion = btn.getAttribute('data-accion');

      if (accion === 'limpiar') {
        limpiarTabla(tablaColor);
      } else if (accion === 'exportarExcel') {
        exportarTablaExcel(tablaColor);
      } else if (accion === 'exportarPDF') {
        exportarTablaPDF(tablaColor);
      }
    });
  });
});

// Registro del service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}
