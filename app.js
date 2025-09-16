<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
const tabla = document.querySelector('#tabla');
if (!tabla) return;

const campana = document.getElementById('campana-alerta');

// Inputs y botones del formulario
const idInput = document.querySelector('#id');
const colorInput = document.querySelector('#color');
const nombreInput = document.querySelector('#nombre');
const telefonoInput = document.querySelector('#telefono');
const horaEntradaInput = document.querySelector('#horaentrada');
const tiempoJuegoInput = document.querySelector('#tiempoJuego');
const horaSalidaInput = document.querySelector('#horasalida');
const abonadoInput = document.querySelector('#abonado');

const insertarBtn = document.querySelector('#insertarBtn');
const resetBtn = document.querySelector('#resetBtn');
const nuevoBtn = document.querySelector('#nuevoBtn');
const exportExcelBtn = document.querySelector('#exportExcel');
const exportPdfBtn = document.querySelector('#exportPdf');

// Calcula y actualiza la hora de salida basada en hora entrada + tiempo juego
function actualizarHoraSalida() {
const horaEntrada = horaEntradaInput.value;
const tiempoJuego = parseInt(tiempoJuegoInput.value, 10);
if (!horaEntrada || isNaN(tiempoJuego) || tiempoJuego < 0) {
horaSalidaInput.value = '';
return;
}
let [h, m] = horaEntrada.split(':').map(Number);
m += tiempoJuego;
h += Math.floor(m / 60);
m = m % 60;
h = h % 24;
horaSalidaInput.value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

horaEntradaInput.addEventListener('change', actualizarHoraSalida);
tiempoJuegoInput.addEventListener('input', actualizarHoraSalida);

// Inserta una nueva fila en la tabla con los datos del formulario
function insertarFila() {
if (!idInput.value.trim() || !colorInput.value || !nombreInput.value.trim()) {
alert('Por favor, rellena los campos obligatorios: id, color y nombre.');
return;
}
if (!horaSalidaInput.value) {
alert('La hora de salida no está calculada correctamente.');
return;
}
const tbody = tabla.querySelector('tbody');
const tr = document.createElement('tr');
tr.innerHTML = `
<td>${idInput.value.trim()}</td>
<td>${colorInput.value}</td>
<td>${nombreInput.value.trim()}</td>
<td>${telefonoInput.value.trim()}</td>
<td>${horaEntradaInput.value||''}</td>
<td>${tiempoJuegoInput.value||''}</td>
<td>${horaSalidaInput.value}</td>
<td class="restante" data-horasalida="${horaSalidaInput.value}" data-tiempojuego="${tiempoJuegoInput.value||''}"></td>
<td>${abonadoInput.value ? parseFloat(abonadoInput.value).toFixed(2) : ''}</td>
`;
const tdAvisado = document.createElement('td');
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.setAttribute('aria-label', `Marcar avisado para ${nombreInput.value.trim()}`);
checkbox.addEventListener('change', () => {
if (checkbox.checked) {
tr.classList.remove('parpadea');
guardarDatosLocalStorage();
}
});
tdAvisado.appendChild(checkbox);
tr.appendChild(tdAvisado);
tbody.appendChild(tr);
guardarDatosLocalStorage();

// Limpiar formulario
idInput.value = '';
colorInput.value = '';
nombreInput.value = '';
telefonoInput.value = '';
horaEntradaInput.value = '';
tiempoJuegoInput.value = '';
horaSalidaInput.value = '';
abonadoInput.value = '';
}

// Actualiza el tiempo restante en filas y controla la clase parpadea, además muestra/oculta campana
function actualizarRestantesTabla(tabla) {
const filas = tabla.querySelectorAll('tbody tr');
let hayParpadeo = false;
filas.forEach(tr => {
const tdRestante = tr.querySelector('.restante');
if (!tdRestante) return;
const horasalida = tdRestante.getAttribute('data-horasalida');
if (!horasalida) {
tdRestante.textContent = '';
tr.classList.remove('parpadea');
return;
}
const checkboxAvisado = tr.querySelector('td:last-child input[type="checkbox"]');
const avisado = checkboxAvisado && checkboxAvisado.checked;
const ahora = new Date();
const [hS, mS] = horasalida.split(':').map(Number);
const salida = new Date(ahora);
salida.setHours(hS, mS, 0, 0);
let diffMs = salida - ahora;
if (diffMs < 0) diffMs = 0;
const diffMin = Math.floor(diffMs / 60000);
const diffSeg = Math.floor((diffMs % 60000) / 1000);
tdRestante.textContent = diffMs > 0 ? `${diffMin}m ${diffSeg}s` : '0m 0s';

if (diffMs === 0 && !avisado) {
tr.classList.add('parpadea');
hayParpadeo = true;
} else {
tr.classList.remove('parpadea');
}
});

if (campana) {
if (hayParpadeo) {
campana.style.display = 'block';
campana.classList.add('campana-parpadea');
} else {
campana.style.display = 'none';
campana.classList.remove('campana-parpadea');
}
}
}

function guardarDatosLocalStorage() {
const filas = [];
tabla.querySelectorAll('tbody tr').forEach(tr => {
const datos = Array.from(tr.querySelectorAll('td')).map(td => {
const cb = td.querySelector('input[type="checkbox"]');
if (cb) return cb.checked;
return td.textContent;
});
filas.push(datos);
});
localStorage.setItem('foca_loca_datos_tabla_0', JSON.stringify(filas));
}

function cargarDatosLocalStorage() {
const datos = localStorage.getItem('foca_loca_datos_tabla_0');
if (!datos) return;
const filas = JSON.parse(datos);
const tbody = tabla.querySelector('tbody');
tbody.innerHTML = '';
filas.forEach(fila => {
const tr = document.createElement('tr');
tr.innerHTML = `
<td>${fila[0]}</td>
<td>${fila[1]}</td>
<td>${fila[2]}</td>
<td>${fila[3]}</td>
<td>${fila[4]}</td>
<td>${fila[5]}</td>
<td>${fila[6]}</td>
<td class="restante" data-horasalida="${fila[6]}" data-tiempojuego="${fila[5]}"></td>
<td>${fila[8]}</td>
`;
const tdAvisado = document.createElement('td');
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.checked = fila[9];
checkbox.setAttribute('aria-label', `Marcar avisado para ${fila[2]}`);
checkbox.addEventListener('change', () => {
if (checkbox.checked) {
tr.classList.remove('parpadea');
guardarDatosLocalStorage();
}
});
tdAvisado.appendChild(checkbox);
tr.appendChild(tdAvisado);
tbody.appendChild(tr);
});
}

function agregarEventosCheckboxAvisado() {
tabla.querySelectorAll('tbody input[type="checkbox"]').forEach(checkbox => {
checkbox.addEventListener('change', () => {
const tr = checkbox.closest('tr');
if (checkbox.checked) {
tr.classList.remove('parpadea');
guardarDatosLocalStorage();
}
});
});
}

function resetearTabla() {
if (!confirm('¿Seguro que quieres resetear la tabla y borrar todos los datos?')) return;
const tbody = tabla.querySelector('tbody');
tbody.innerHTML = '';
localStorage.removeItem('foca_loca_datos_tabla_0');
if (campana) {
campana.style.display = 'none';
campana.classList.remove('campana-parpadea');
}
}

function ponerHoraActual() {
const ahora = new Date();
const h = ahora.getHours().toString().padStart(2, '0');
const m = ahora.getMinutes().toString().padStart(2, '0');
horaEntradaInput.value = `${h}:${m}`;
actualizarHoraSalida();
}

function exportarExcel() {
if (typeof XLSX === 'undefined') {
alert('La librería SheetJS (XLSX) no está cargada.');
return;
}
const wb = XLSX.utils.book_new();
const ws_data = [];
const headers = Array.from(tabla.querySelectorAll('thead th')).map(th => th.textContent);
ws_data.push(headers);
tabla.querySelectorAll('tbody tr').forEach(tr => {
const row = [];
tr.querySelectorAll('td').forEach(td => {
if (td.querySelector('input[type="checkbox"]')) {
row.push(td.querySelector('input[type="checkbox"]').checked ? 'Sí' : 'No');
} else {
row.push(td.textContent);
}
});
ws_data.push(row);
});
const ws = XLSX.utils.aoa_to_sheet(ws_data);
XLSX.utils.book_append_sheet(wb, ws, 'Registros');
XLSX.writeFile(wb, 'registros_foca_loca.xlsx');
}

function exportarPDF() {
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.setFontSize(16);
doc.text('Registros La Foca Loca', 14, 20);

const headers = Array.from(tabla.querySelectorAll('thead th')).map(th => th.textContent);
const data = [];
tabla.querySelectorAll('tbody tr').forEach(tr => {
const row = [];
tr.querySelectorAll('td').forEach(td => {
if (td.querySelector('input[type="checkbox"]')) {
row.push(td.querySelector('input[type="checkbox"]').checked ? 'Sí' : 'No');
} else {
row.push(td.textContent);
}
});
data.push(row);
});

doc.autoTable({
head: [headers],
body: data,
startY: 30,
styles: { fontSize: 8 },
headStyles: { fillColor: [217, 255, 0], textColor: 0 },
});

doc.save('registros_foca_loca.pdf');
}

// Inicialización
cargarDatosLocalStorage();
agregarEventosCheckboxAvisado();

setInterval(() => {
actualizarRestantesTabla(tabla);
}, 1000);

// Eventos botones
insertarBtn.addEventListener('click', insertarFila);
resetBtn.addEventListener('click', resetearTabla);
nuevoBtn.addEventListener('click', ponerHoraActual);
exportExcelBtn.addEventListener('click', exportarExcel);
exportPdfBtn.addEventListener('click', exportarPDF);
=======
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        console.log('Service Worker registrado con éxito:', reg.scope);
      })
      .catch((err) => {
        console.log('Error registrando el Service Worker:', err);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const idInput = document.getElementById('id');
  const colorInput = document.getElementById('color');
  const nombreInput = document.getElementById('nombre');
  const telefonoInput = document.getElementById('telefono');
  const horaEntradaInput = document.getElementById('horaentrada');
  const tiempoJuegoInput = document.getElementById('tiempoJuego');
  const horaSalidaInput = document.getElementById('horasalida');
  const abonadoInput = document.getElementById('abonado');
  const insertarBtn = document.getElementById('insertarBtn');
  const tablaBody = document.querySelector('#tabla tbody');
  const nuevoBtn = document.getElementById('nuevoBtn');
  const exportExcelBtn = document.getElementById('exportExcel');
  const exportPdfBtn = document.getElementById('exportPdf');
  const resetBtn = document.getElementById('resetBtn');

  function setHoraActual() {
    const ahora = new Date();
    if (horaEntradaInput) {
      horaEntradaInput.value = ahora.toTimeString().slice(0, 5);
    }
  }

  function actualizarHoraSalida() {
    const entrada = horaEntradaInput.value;
    const tiempo = parseInt(tiempoJuegoInput.value) || 0;
    if (entrada && tiempo > 0) {
      const [h, m] = entrada.split(':').map((x) => parseInt(x));
      if (isNaN(h) || isNaN(m)) {
        horaSalidaInput.value = '';
        return;
      }
      let minTotales = h * 60 + m + tiempo;
      minTotales = minTotales % (24 * 60);
      const hSalida = Math.floor(minTotales / 60);
      const mSalida = minTotales % 60;
      horaSalidaInput.value = `${hSalida.toString().padStart(2, '0')}:${mSalida
        .toString()
        .padStart(2, '0')}`;
    } else {
      horaSalidaInput.value = '';
    }
  }

  function actualizarRestantes() {
    const filas = document.querySelectorAll('#tabla tbody tr');
    filas.forEach((tr) => {
      const tdRestante = tr.querySelector('.restante');
      if (!tdRestante) return;
      const horasalida = tdRestante.getAttribute('data-horasalida');
      if (!horasalida) {
        tdRestante.textContent = '';
        tr.classList.remove('parpadea');
        return;
      }
      const checkboxAvisado = tr.querySelector(
        'td:last-child input[type="checkbox"]'
      );
      const avisado = checkboxAvisado && checkboxAvisado.checked;
      const ahora = new Date();
      const [hS, mS] = horasalida.split(':').map(Number);
      const salida = new Date(ahora);
      salida.setHours(hS, mS, 0, 0);
      let diffMs = salida - ahora;
      if (diffMs < 0) diffMs = 0;
      const diffMin = Math.floor(diffMs / 60000);
      const diffSeg = Math.floor((diffMs % 60000) / 1000);
      tdRestante.textContent =
        diffMs > 0 ? `${diffMin}m ${diffSeg}s` : '0m 0s';
      if (diffMs === 0 && !avisado) {
        tr.classList.add('parpadea');
      } else {
        tr.classList.remove('parpadea');
      }
    });
  }

  function guardarDatosLocalStorage() {
    const filas = [];
    document.querySelectorAll('#tabla tbody tr').forEach((tr) => {
      const datos = Array.from(tr.querySelectorAll('td')).map((td) => {
        if (td.querySelector('input[type="checkbox"]')) {
          return td.querySelector('input[type="checkbox"]').checked;
        }
        return td.textContent;
      });
      filas.push(datos);
    });
    localStorage.setItem('foca_loca_datos', JSON.stringify(filas));
  }

  function cargarDatosLocalStorage() {
    const datos = localStorage.getItem('foca_loca_datos');
    if (!datos) return;
    const filas = JSON.parse(datos);
    filas.forEach((fila) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${fila[0]}</td>
        <td>${fila[1]}</td>
        <td>${fila[2]}</td>
        <td>${fila[3]}</td>
        <td>${fila[4]}</td>
        <td>${fila[5]}</td>
        <td>${fila[6]}</td>
        <td class="restante" data-horasalida="${fila[6]}" data-tiempojuego="${fila[5]}"></td>
        <td>${fila[8]}</td>
      `;
      const tdAvisado = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = fila[9];
      checkbox.setAttribute('aria-label', `Marcar avisado para ${fila[2]}`);
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          tr.classList.remove('parpadea');
          guardarDatosLocalStorage();
        }
      });
      tdAvisado.appendChild(checkbox);
      tr.appendChild(tdAvisado);
      tablaBody.appendChild(tr);
    });
    actualizarRestantes();
  }

  setHoraActual();
  actualizarHoraSalida();
  cargarDatosLocalStorage();

  horaEntradaInput?.addEventListener('focus', setHoraActual);
  tiempoJuegoInput?.addEventListener('input', actualizarHoraSalida);

  nuevoBtn?.addEventListener('click', () => {
    setHoraActual();
    actualizarHoraSalida();
  });

  insertarBtn?.addEventListener('click', () => {
    // Validación básica
    const id = idInput.value.trim();
    const nombre = nombreInput.value.trim();
  
    // El resto de inputs opcionales
    const color = colorInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const horaentrada = horaEntradaInput.value;
    const tiempoJuego = tiempoJuegoInput.value.trim();
    const horasalida = horaSalidaInput.value;
    const abonado = abonadoInput.value.trim();

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${id}</td>
      <td>${color}</td>
      <td>${nombre}</td>
      <td>${telefono}</td>
      <td>${horaentrada}</td>
      <td>${tiempoJuego}</td>
      <td>${horasalida}</td>
      <td class="restante" data-horasalida="${horasalida}" data-tiempojuego="${tiempoJuego}"></td>
      <td>${abonado}</td>
    `;
    const tdAvisado = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('aria-label', `Marcar avisado para ${nombre}`);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        tr.classList.remove('parpadea');
        guardarDatosLocalStorage();
      }
    });
    tdAvisado.appendChild(checkbox);
    tr.appendChild(tdAvisado);

    tablaBody.appendChild(tr);

    // Limpiar formulario y preparar para nuevo
    idInput.value = '';
    colorInput.value = '';
    nombreInput.value = '';
    telefonoInput.value = '';
    tiempoJuegoInput.value = '';
    horaSalidaInput.value = '';
    abonadoInput.value = '';
    setHoraActual();
    idInput.focus();
    actualizarRestantes();
    guardarDatosLocalStorage();
  });

  exportExcelBtn?.addEventListener('click', () => {
    const table = document.getElementById('tabla');

    // Crear fila con fecha
    const thead = table.querySelector('thead');
    const fechaTr = document.createElement('tr');
    const fechaTd = document.createElement('td');

    // Poner la fecha y hacer que ocupe todas las columnas
    fechaTd.colSpan = thead.querySelectorAll('th').length;
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString();
    fechaTd.textContent = `Fecha: ${fechaStr}`;
    fechaTd.style.fontWeight = 'bold';
    fechaTd.style.textAlign = 'center';

    fechaTr.appendChild(fechaTd);

    // Insertar la fila fecha antes del thead
    thead.parentNode.insertBefore(fechaTr, thead);

    // Exportar tabla a Excel
    const html = encodeURIComponent(table.outerHTML);
    const url = 'data:application/vnd.ms-excel;charset=utf-8,' + html;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'foca_loca_registros.xls';
    a.click();
    a.remove();

    // Quitar la fila fecha para dejar la tabla igual que antes
    fechaTr.remove();
  });

  exportPdfBtn?.addEventListener('click', () => {
    if (!window.jspdf) {
      alert('Librería jsPDF no cargada. Añade jsPDF y jsPDF-autotable para esta función.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    const margin = 15;
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString();

    doc.text('Listado de Registros - La Foca Loca', margin, margin);
    doc.text(`Fecha: ${fechaStr}`, margin, margin + 8);

    doc.autoTable({
      html: '#tabla',
      startY: margin + 20,
      margin: { left: margin, right: margin, top: margin, bottom: margin },
      styles: {
        overflow: 'linebreak',
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
        fontSize: 10
      },
      headStyles: {
        fillColor: [230, 230, 250],
        textColor: [0, 0, 0],
        lineWidth: 0.7,
        lineColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        lineWidth: 0.3,
        lineColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      pageBreak: 'auto',
    });
    doc.save('foca_loca_registros.pdf');
  });

  resetBtn?.addEventListener('click', () => {
    tablaBody.innerHTML = '';
    localStorage.removeItem('foca_loca_datos');
  });

  setInterval(actualizarRestantes, 1000);
>>>>>>> d74b96de26a95f0a3505751bf0f17b6ef27b1054
});
