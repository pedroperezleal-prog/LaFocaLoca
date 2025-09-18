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
  const formImage = document.getElementById('form-image');

  // Corregido: función hora actual formato HH:MM con ceros
  function setHoraActual() {
    const ahora = new Date();
    const hh = ahora.getHours().toString().padStart(2, '0');
    const mm = ahora.getMinutes().toString().padStart(2, '0');
    if (horaEntradaInput) {
      horaEntradaInput.value = `${hh}:${mm}`;
    }
  }

  function actualizarHoraSalida() {
    const entrada = horaEntradaInput.value;
    const tiempo = parseInt(tiempoJuegoInput.value) || 0;
    if (entrada && tiempo > 0) {
      const [h, m] = entrada.split(':').map(x => parseInt(x));
      if (isNaN(h) || isNaN(m)) {
        horaSalidaInput.value = '';
        return;
      }
      let minTotales = h * 60 + m + tiempo;
      minTotales = minTotales % (24 * 60);
      const hSalida = Math.floor(minTotales / 60);
      const mSalida = minTotales % 60;
      horaSalidaInput.value = `${hSalida.toString().padStart(2, '0')}:${mSalida.toString().padStart(2, '0')}`;
    } else {
      horaSalidaInput.value = '';
    }
  }

  function actualizarRestantes() {
    const filas = document.querySelectorAll('#tabla tbody tr');
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
    // Controlar visibilidad y animación de la imagen
    if (hayParpadeo) {
      formImage.style.opacity = '1';
      formImage.style.pointerEvents = 'auto';
      formImage.classList.add('parpadea-imagen');
    } else {
      formImage.classList.remove('parpadea-imagen');
      formImage.style.opacity = '0';
      formImage.style.pointerEvents = 'none';
    }
  }

  function guardarDatosLocalStorage() {
    const filas = [];
    document.querySelectorAll('#tabla tbody tr').forEach(tr => {
      const datos = Array.from(tr.querySelectorAll('td')).map(td => {
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
          actualizarRestantes();
        }
      });
      tdAvisado.appendChild(checkbox);
      tr.appendChild(tdAvisado);
      tablaBody.appendChild(tr);
    });
    actualizarRestantes();
  }

  // Inicializa con hora actual al cargar
  setHoraActual();
  actualizarHoraSalida();
  cargarDatosLocalStorage();

  // Refresca hora si el input toma foco
  horaEntradaInput?.addEventListener('focus', setHoraActual);
  // Actualiza hora de salida al cambiar tiempo de juego
  tiempoJuegoInput?.addEventListener('input', actualizarHoraSalida);

  // Al pulsar "Nuevo" refresca hora actual y limpia
  nuevoBtn?.addEventListener('click', () => {
    setHoraActual();
    tiempoJuegoInput.value = '';
    horaSalidaInput.value = '';
    idInput.value = '';
    colorInput.value = 'Azul';
    nombreInput.value = '';
    telefonoInput.value = '';
    abonadoInput.value = '';
    idInput.focus();
    actualizarHoraSalida();
  });

  // Insertar registro en tabla
  insertarBtn?.addEventListener('click', () => {
    const id = idInput.value.trim();
    const nombre = nombreInput.value.trim();

    if (!id || !nombre) {
      alert("Por favor, complete los campos obligatorios: ID y Nombre.");
      return;
    }
    const color = colorInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const horaentrada = horaEntradaInput.value;
    const tiempoJuego = tiempoJuegoInput.value.trim();
    const horasalida = horaSalidaInput.value;
    const abonado = abonadoInput.value.trim();

    if (tiempoJuego && (isNaN(tiempoJuego) || Number(tiempoJuego) < 0)) {
      alert("El tiempo de juego debe ser un número positivo.");
      return;
    }
    const tr = document.createElement("tr");
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
    const tdAvisado = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", `Marcar avisado para ${nombre}`);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        tr.classList.remove("parpadea");
        guardarDatosLocalStorage();
        actualizarRestantes();
      }
    });
    tdAvisado.appendChild(checkbox);
    tr.appendChild(tdAvisado);

    tablaBody.appendChild(tr);

    // Limpiar y poner hora actual y limpiar formulario
    setHoraActual();
    tiempoJuegoInput.value = '';
    horaSalidaInput.value = '';
    idInput.value = '';
    colorInput.value = 'Azul';
    nombreInput.value = '';
    telefonoInput.value = '';
    abonadoInput.value = '';
    idInput.focus();
    actualizarRestantes();
    guardarDatosLocalStorage();
  });

  exportExcelBtn?.addEventListener("click", () => {
    const table = document.getElementById("tabla");
    const thead = table.querySelector("thead");
    const fechaTr = document.createElement("tr");
    const fechaTd = document.createElement("td");
    fechaTd.colSpan = thead.querySelectorAll("th").length;
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString();
    fechaTd.textContent = `Fecha: ${fechaStr}`;
    fechaTd.style.fontWeight = "bold";
    fechaTd.style.textAlign = "center";
    fechaTr.appendChild(fechaTd);
    thead.parentNode.insertBefore(fechaTr, thead);
    const html = encodeURIComponent(table.outerHTML);
    const url = "data:application/vnd.ms-excel;charset=utf-8," + html;
    const a = document.createElement("a");
    a.href = url;
    a.download = "foca_loca_registros.xls";
    a.click();
    a.remove();
    fechaTr.remove();
  });

  exportPdfBtn?.addEventListener("click", () => {
    if (!window.jspdf) {
      alert("Librería jsPDF no cargada. Añade jsPDF y jsPDF-autotable para esta función.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape" });
    const margin = 15;
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString();
    doc.text("Listado de Registros - La Foca Loca", margin, margin);
    doc.text(`Fecha: ${fechaStr}`, margin, margin + 8);
    doc.autoTable({
      html: "#tabla",
      startY: margin + 20,
      margin: { left: margin, right: margin, top: margin, bottom: margin },
      styles: {
        overflow: "linebreak",
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
        fontSize: 10,
      },
      headStyles: {
        fillColor: [230, 230, 250],
        textColor: [0, 0, 0],
        lineWidth: 0.7,
        lineColor: [0, 0, 0],
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      pageBreak: "auto",
    });
    doc.save("foca_loca_registros.pdf");
  });

  resetBtn?.addEventListener("click", () => {
    if (confirm("¿Seguro que quieres eliminar todos los registros?")) {
      tablaBody.innerHTML = "";
      localStorage.removeItem("foca_loca_datos");
      formImage.classList.remove("parpadea-imagen");
      formImage.style.opacity = "0";
      formImage.style.pointerEvents = "none";
    }
  });

  // Actualizar el parpadeo y visibilidad cada segundo
  setInterval(actualizarRestantes, 1000);
});
