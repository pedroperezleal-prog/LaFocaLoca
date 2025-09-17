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

    if (!id || !nombre) {
      alert("Por favor, complete los campos obligatorios: ID y Nombre.");
      return;
    }

    // El resto de inputs opcionales
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
      }
    });
    tdAvisado.appendChild(checkbox);
    tr.appendChild(tdAvisado);

    tablaBody.appendChild(tr);

    // Limpiar formulario y preparar para nuevo
    idInput.value = "";
    colorInput.value = "Azul";
    nombreInput.value = "";
    telefonoInput.value = "";
    tiempoJuegoInput.value = "";
    horaSalidaInput.value = "";
    abonadoInput.value = "";
    setHoraActual();
    idInput.focus();
    actualizarRestantes();
    guardarDatosLocalStorage();
  });

  exportExcelBtn?.addEventListener("click", () => {
    const table = document.getElementById("tabla");
    // Crear fila con fecha
    const thead = table.querySelector("thead");
    const fechaTr = document.createElement("tr");
    const fechaTd = document.createElement("td");
    // Poner la fecha y hacer que ocupe todas las columnas
    fechaTd.colSpan = thead.querySelectorAll("th").length;
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString();
    fechaTd.textContent = `Fecha: ${fechaStr}`;
    fechaTd.style.fontWeight = "bold";
    fechaTd.style.textAlign = "center";
    fechaTr.appendChild(fechaTd);
    // Insertar la fila fecha antes del thead
    thead.parentNode.insertBefore(fechaTr, thead);
    // Exportar tabla a Excel
    const html = encodeURIComponent(table.outerHTML);
    const url = "data:application/vnd.ms-excel;charset=utf-8," + html;
    const a = document.createElement("a");
    a.href = url;
    a.download = "foca_loca_registros.xls";
    a.click();
    a.remove();
    // Quitar la fila fecha para dejar la tabla igual que antes
    fechaTr.remove();
  });

  exportPdfBtn?.addEventListener("click", () => {
    if (!window.jspdf) {
      alert(
        "Librería jsPDF no cargada. Añade jsPDF y jsPDF-autotable para esta función."
      );
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
    }
  });

  setInterval(actualizarRestantes, 1000);
});
/* Fuente personalizada */
@font-face {
  font-family: 'PetitCochon';
  src: url('./fonts/PetitCochon.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}

h1 {
  color: yellow;
  text-align: center;
  font-size: 6em;
  font-family: 'PetitCochon', cursive, sans-serif;
  font-weight: 300;
  margin: 20px 0;
}

/* Estilos generales */
html, body, * {
  font-family: 'PetitCochon', cursive, sans-serif;
  font-weight: 300;
  font-size: 1.1em;
  -webkit-font-smoothing: antialiased;
  font-smooth: always;
  text-shadow: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
}

html, body {
  height: 100%;
  overflow: hidden; /* Sin scroll visible */
}

/* Fondo para body con clase index */
body.index {
  background-image: url("foca.jpg?v=1");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: #40c4e6;
  height: 100%;
  margin: 0;
}

footer {
  position: fixed;
  bottom: 0;
  right: 0;
  background: transparent;
  color: yellow;
  padding: 10px 20px;
  font-family: 'PetitCochon', cursive, sans-serif;
  font-weight: 300;
  font-size: 1em;
  z-index: 1000;
  white-space: nowrap;
}

nav {
  display: flex;
  gap: 20px;
  justify-content: left;
  align-items: center;
  padding: 60px;
}

/* Botones con imagen y título centrado debajo */
nav button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav button img {
  width: 500px;
  transition: transform 0.3s ease, filter 0.3s ease;
}

nav button:hover img {
  transform: translateZ(20px) translateX(10px);
  filter: blur(2px);
}

nav button .titulo-foto {
  color: yellow;
  margin-top: 8px;
  font-family: 'PetitCochon', cursive, sans-serif;
  font-weight: 300;
  font-size: 1.7em;
  user-select: none;
  white-space: nowrap;
}

/* Media Queries para dispositivos pequeños */

@media (max-width: 1024px) {
  nav button img {
    width: 400px;
  }
}

@media (max-width: 768px) {
  nav {
    padding: 20px;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
  }
  nav button img {
    width: 100%;
    max-width: 300px;
    height: auto;
  }
  h1 {
    font-size: 3em;
  }
  footer {
    font-size: 0.9em;
    padding: 8px 15px;
  }
}

@media (max-width: 480px) {
  nav button img {
    max-width: 200px;
  }
  h1 {
    font-size: 2em;
    margin: 15px 0;
  }
  body.index {
    background-position: top center;
  }
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('Service Worker registrado con éxito:', registration.scope);
    }, function(error) {
      console.log('Fallo al registrar el Service Worker:', error);
    });
  });
}
