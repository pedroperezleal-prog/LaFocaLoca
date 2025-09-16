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
<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
  const tablas = [
    document.querySelector('#tabla'),           // Tabla en libre.html
    document.querySelector('#tabla-cumple')     // Tabla en cumple.html
  ].filter(Boolean);

  function actualizarRestantesTabla(tabla) {
    const filas = tabla.querySelectorAll('tbody tr');
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
      } else {
        tr.classList.remove('parpadea');
      }
    });
  }

  // Actualiza todas las tablas cada segundo
  setInterval(() => {
    tablas.forEach(tabla => actualizarRestantesTabla(tabla));
  }, 1000);

  // Al cambiar "avisado" quita parpadeo y guarda estado
  tablas.forEach(tabla => {
    tabla.querySelectorAll('tbody input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const tr = checkbox.closest('tr');
        if (checkbox.checked) {
          tr.classList.remove('parpadea');
          guardarDatosLocalStorage(); // Definir función para guardar datos
        }
      });
    });
  });

  // Funciones para guardar y cargar datos de ambas tablas
  function guardarDatosLocalStorage() {
    tablas.forEach((tabla, i) => {
      const filas = [];
      tabla.querySelectorAll('tbody tr').forEach(tr => {
        const datos = Array.from(tr.querySelectorAll('td')).map(td => {
          const cb = td.querySelector('input[type="checkbox"]');
          if (cb) return cb.checked;
          return td.textContent;
        });
        filas.push(datos);
      });
      localStorage.setItem(`foca_loca_datos_tabla_${i}`, JSON.stringify(filas));
    });
  }

  function cargarDatosLocalStorage() {
    tablas.forEach((tabla, i) => {
      const datos = localStorage.getItem(`foca_loca_datos_tabla_${i}`);
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
    });
  }

  cargarDatosLocalStorage();
});
=======
>>>>>>> d74b96de26a95f0a3505751bf0f17b6ef27b1054
