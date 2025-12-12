document.addEventListener('DOMContentLoaded', () => {
  const nombreInput = document.getElementById('nombre');
  const bebidaSelect = document.getElementById('bebidas');
  const packSelect = document.getElementById('packs');
  const picoteoSelect = document.getElementById('picoteo');

  const insertarBtn = document.getElementById('insertarBtn');
  const nuevoBtn = document.getElementById('nuevoBtn');
  const resetBtn = document.getElementById('resetBtn');
  const exportExcelBtn = document.getElementById('exportExcel');
  const exportPdfBtn = document.getElementById('exportPdf');
  const tablaBody = document.querySelector('#tabla tbody');

  /* ===== Acordeones: abrir/cerrar ===== */
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-target');
      const content = document.querySelector(targetSelector);
      if (!content) return;

      const isOpen = content.classList.contains('abierto');

      // Cerrar todos
      document.querySelectorAll('.accordion-content').forEach((c) => {
        c.classList.remove('abierto');
        c.style.maxHeight = '0px';
      });
      document.querySelectorAll('.accordion-header').forEach((h) => {
        h.classList.remove('activo');
      });

      // Abrir el pulsado si estaba cerrado
      if (!isOpen) {
        content.classList.add('abierto');
        content.style.maxHeight = content.scrollHeight + 'px';
        btn.classList.add('activo');
      }
    });
  });

  /* ===== LocalStorage: guardar/cargar tabla ===== */
  function guardarDatos() {
    const filas = [];
    document.querySelectorAll('#tabla tbody tr').forEach((tr) => {
      const celdas = Array.from(tr.querySelectorAll('td')).map(
        (td) => td.textContent
      );
      filas.push(celdas);
    });
    localStorage.setItem('cafeteria_datos', JSON.stringify(filas));
  }

  function cargarDatos() {
    const datos = localStorage.getItem('cafeteria_datos');
    if (!datos) return;
    const filas = JSON.parse(datos);
    filas.forEach((fila) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${fila[0] || ''}</td>
        <td>${fila[1] || ''}</td>
        <td>${fila[2] || ''}</td>
        <td>${fila[3] || ''}</td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  cargarDatos();

  /* ===== Botón Nuevo ===== */
  nuevoBtn?.addEventListener('click', () => {
    nombreInput.value = '';
    bebidaSelect.value = '';
    packSelect.value = '';
    picoteoSelect.value = '';
    nombreInput.focus();
  });

  /* ===== Insertar en tabla ===== */
  insertarBtn?.addEventListener('click', () => {
    const nombre = nombreInput.value.trim();
    const bebida = bebidaSelect.value.trim();
    const pack = packSelect.value.trim();
    const picoteo = picoteoSelect.value.trim();

    if (!nombre) {
      alert('Por favor, escribe un nombre.');
      return;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nombre}</td>
      <td>${bebida}</td>
      <td>${pack}</td>
      <td>${picoteo}</td>
    `;
    tablaBody.appendChild(tr);

    guardarDatos();

    nombreInput.value = '';
    bebidaSelect.value = '';
    packSelect.value = '';
    picoteoSelect.value = '';
    nombreInput.focus();
  });

  /* ===== Reset tabla ===== */
  resetBtn?.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres borrar todos los pedidos?')) {
      tablaBody.innerHTML = '';
      localStorage.removeItem('cafeteria_datos');
    }
  });

  /* ===== Exportar a Excel ===== */
  exportExcelBtn?.addEventListener('click', () => {
    const table = document.getElementById('tabla');
    if (!table) return;

    const html = encodeURIComponent(table.outerHTML);
    const url =
      'data:application/vnd.ms-excel;charset=utf-8,' + html;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cafeteria_pedidos.xls';
    a.click();
    a.remove();
  });

  /* ===== Exportar a PDF (jsPDF + autotable) ===== */
  exportPdfBtn?.addEventListener('click', () => {
    if (!window.jspdf) {
      alert(
        'jsPDF no se ha cargado. Revisa la inclusión de jsPDF y jsPDF-autotable.'
      );
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    const margin = 15;
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString();

    doc.text('Pedidos Cafetería - La Foca Loca', margin, margin);
    doc.text(`Fecha: ${fechaStr}`, margin, margin + 8);

    doc.autoTable({
      html: '#tabla',
      startY: margin + 20,
      margin: { left: margin, right: margin, top: margin, bottom: margin }
    });

    doc.save('cafeteria_pedidos.pdf');
  });
});
