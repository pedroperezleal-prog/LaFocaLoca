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
});
