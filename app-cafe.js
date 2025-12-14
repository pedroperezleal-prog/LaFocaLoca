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

  /* ===== Precios según carta ===== */
  const PRECIOS = {
    Bebidas: {
      'Refrescos': 2.0,
      'Bebidas calientes': 1.8,
      'Zumos, Batidos': 1.5,
      'Agua': 1.5,
      'Cubata 5€': 5.0,
      'Cubata 6€': 6.0
    },
    Packs: {
      'Pack Rojo': 30.0,
      'Pack Azul': 30.0,
      'Pack Verde': 30.0
    },
    Picoteo: {
      'Mini pastelitos 8 uds': 10.0,
      'Bollería 12 uds': 12.0,
      'Montaditos 12 uds': 15.0,
      'Bandeja Saladitos 10 uds': 8.0,
      'Sandwich Mixto 1 ud': 2.5,
      'Sandwich Mixto 16 uds': 20.0,
      'Bandeja Piquislavis': 5.0
    }
  };

  /* ===== Acordeones: abrir/cerrar ===== */
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-target');
      const content = document.querySelector(targetSelector);
      if (!content) return;

      const isOpen = content.classList.contains('abierto');

      document.querySelectorAll('.accordion-content').forEach((c) => {
        c.classList.remove('abierto');
        c.style.maxHeight = '0px';
      });
      document.querySelectorAll('.accordion-header').forEach((h) => {
        h.classList.remove('activo');
      });

      if (!isOpen) {
        content.classList.add('abierto');
        content.style.maxHeight = content.scrollHeight + 'px';
        btn.classList.add('activo');
      }
    });
  });

  /* ===== Utilidades ===== */
  function formatearEuros(num) {
    return num.toFixed(2).replace('.', ',') + ' €';
  }

  function pedirCantidadYInsertar(categoria, producto) {
    const nombre = (nombreInput.value || '').trim();
    if (!nombre) {
      alert('Escribe un nombre antes de seleccionar un producto.');
      return;
    }
    if (!producto) return;

    const precio = PRECIOS[categoria][producto];
    if (typeof precio !== 'number') {
      alert('No se ha encontrado precio para ese producto.');
      return;
    }

    let cantidadStr = prompt(`¿Cantidad para "${producto}"?`, '1');
    if (cantidadStr === null) return;
    let cantidad = parseInt(cantidadStr, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      alert('La cantidad debe ser un número positivo.');
      return;
    }

    const total = precio * cantidad;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nombre}</td>
      <td>${categoria}</td>
      <td>${producto}</td>
      <td>${cantidad}</td>
      <td>${formatearEuros(precio)}</td>
      <td>${formatearEuros(total)}</td>
    `;
    tablaBody.appendChild(tr);
    guardarDatos();

    if (categoria === 'Bebidas') bebidaSelect.value = '';
    if (categoria === 'Packs') packSelect.value = '';
    if (categoria === 'Picoteo') picoteoSelect.value = '';
  }

  /* ===== Sumar columna Total e insertar/actualizar fila TOTAL ===== */
  function sumarColumnaTotalEnTabla() {
    let suma = 0;
    const filas = document.querySelectorAll('#tabla tbody tr');

    filas.forEach((tr) => {
      const celdaTotal = tr.querySelector('td:last-child');
      if (!celdaTotal) return;
      const texto = celdaTotal.textContent
        .replace(' €', '')
        .replace('.', '')
        .replace(',', '.');
      const valor = parseFloat(texto);
      if (!isNaN(valor)) suma += valor;
    });

    // Buscar si ya existe una fila de TOTAL
    let filaTotal = null;
    if (filas.length > 0) {
      const ultima = filas[filas.length - 1];
      const primeraCelda = ultima.querySelector('td');
      if (primeraCelda && primeraCelda.textContent === 'TOTAL') {
        filaTotal = ultima;
      }
    }

    if (!filaTotal) {
      filaTotal = document.createElement('tr');
      filaTotal.innerHTML = `
        <td>TOTAL</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>${formatearEuros(suma)}</td>
      `;
      tablaBody.appendChild(filaTotal);
    } else {
      const celdaImporte = filaTotal.querySelector('td:last-child');
      celdaImporte.textContent = formatearEuros(suma);
    }

    guardarDatos();
  }

  /* ===== Eventos de selección en los desplegables ===== */
  bebidaSelect?.addEventListener('change', () => {
    const valor = bebidaSelect.value;
    if (valor) pedirCantidadYInsertar('Bebidas', valor);
  });

  packSelect?.addEventListener('change', () => {
    const valor = packSelect.value;
    if (valor) pedirCantidadYInsertar('Packs', valor);
  });

  picoteoSelect?.addEventListener('change', () => {
    const valor = picoteoSelect.value;
    if (valor) pedirCantidadYInsertar('Picoteo', valor);
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
        <td>${fila[4] || ''}</td>
        <td>${fila[5] || ''}</td>
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

  /* ===== Insertar: calcular y mostrar fila TOTAL ===== */
  insertarBtn?.addEventListener('click', () => {
    sumarColumnaTotalEnTabla();
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
    const doc = new jsPDF({ orientation: 'portrait' });
    const margin = 15;
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString();

    doc.text('Cafetería - La Foca Loca', margin, margin);
    doc.text(`Fecha: ${fechaStr}`, margin, margin + 8);

    doc.autoTable({
      html: '#tabla',
      startY: margin + 16,
      margin: { left: margin, right: margin, top: margin, bottom: margin }
    });

    doc.save('cafeteria_ticket.pdf');
  });
});

// Sincronización y control del parpadeo de la imagen aviso
function actualizarParpadeoImagen(hayParpadeo) {
  const formImage = document.getElementById("form-image");
  if (!formImage) return;

  if (hayParpadeo) {
    formImage.classList.add("parpadea-imagen");
    formImage.style.opacity = "1";
    formImage.style.pointerEvents = "auto";
  } else {
    formImage.classList.remove("parpadea-imagen");
    formImage.style.opacity = "0";
    formImage.style.pointerEvents = "none";
  }
}

window.addEventListener("storage", (event) => {
  if (event.key === "foca_loca_parpadeo") {
    const activo = event.newValue === "true";
    actualizarParpadeoImagen(activo);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const estadoAlCargar = localStorage.getItem("foca_loca_parpadeo") === "true";
  actualizarParpadeoImagen(estadoAlCargar);
});
