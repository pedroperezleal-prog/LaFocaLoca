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
      } else {
        tr.classList.remove('parpadea');
      }
    });
  }

  function guardarDatosLocalStorage() {
    const filas = [];
    document.querySelectorAll('#tabla tbody tr').forEach((tr) => {
      const datos = Array.from(tr.querySelectorAll('td')).map((td) => {
        const checkbox = td.querySelector('input[type="checkbox"]');
        if (checkbox) {
          return checkbox.checked;
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
        fontSize: 10,
      },
      headStyles: {
        fillColor: [230, 230, 250],
        textColor: [0, 0, 0],
        lineWidth: 0.7,
        lineColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
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
});
