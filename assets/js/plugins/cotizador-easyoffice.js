// ===== VARIABLES GLOBALES =====
let solicitudActual = {};
const WHATSAPP_NUMBER = '+50432484168';

// ===== INICIALIZACIÓN AL CARGAR EL DOM =====
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeCotizador, 100);
});

function initializeCotizador() {
  // Configurar eventos de tabs
  const tabButtons = document.querySelectorAll('.tab-btn-smart');
  if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn-smart').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.tab-content-smart').forEach(tab => tab.classList.add('hidden'));
        const targetTab = this.getAttribute('data-tab');
        const targetElement = document.getElementById(targetTab);
        if (targetElement) {
          targetElement.classList.remove('hidden');
        }
        
        resetearFormularios();
      });
    });
  }
  
  // Asegurar que el tab de servicios esté activo por defecto
  const serviciosTab = document.getElementById('servicios');
  if (serviciosTab) {
    serviciosTab.classList.remove('hidden');
  }
}

// ===== FUNCIONES PRINCIPALES PARA SERVICIOS =====
function updateServicioOptions() {
  const tipoServicio = document.getElementById('tipo-servicio').value;
  
  // Ocultar todas las opciones
  ocultarElementos([
    'virtual-options', 'ciudad-options', 'capacidad-options', 
    'espacios-options', 'reserva-options', 'tiempo-options'
  ]);
  
  // Limpiar selects dependientes
  limpiarSelects(['paquete-virtual', 'ciudad', 'capacidad', 'espacios', 'tipo-reserva', 'tiempo-elegido']);
  
  if (tipoServicio === 'oficina-virtual') {
    mostrarElemento('virtual-options');
  } else if (tipoServicio === 'sala-juntas' || tipoServicio === 'oficina-privada' || tipoServicio === 'cowork') {
    mostrarElemento('ciudad-options');
  }
  
  updateButtonState();
}

function updateCiudadOptions() {
  mostrarElemento('ciudad-options');
  
  // Limpiar selects dependientes
  limpiarSelects(['capacidad', 'espacios', 'tipo-reserva', 'tiempo-elegido']);
  ocultarElementos(['capacidad-options', 'espacios-options', 'reserva-options', 'tiempo-options']);
  
  updateButtonState();
}

function updateCapacidadOptions() {
  const tipoServicio = document.getElementById('tipo-servicio').value;
  const ciudad = document.getElementById('ciudad').value;
  const capacidadSelect = document.getElementById('capacidad');
  
  // Limpiar selects dependientes
  limpiarSelects(['capacidad', 'espacios', 'tipo-reserva', 'tiempo-elegido']);
  ocultarElementos(['capacidad-options', 'espacios-options', 'reserva-options', 'tiempo-options']);
  
  if (!ciudad) return;
  
  // Para oficina virtual, ir directo al botón
  if (tipoServicio === 'oficina-virtual') {
    updateButtonState();
    return;
  }
  
  // Para cowork, mostrar espacios
  if (tipoServicio === 'cowork') {
    mostrarElemento('espacios-options');
    updateButtonState();
    return;
  }
  
  // Para sala de juntas y oficina privada, mostrar capacidad
  if (capacidadSelect && (tipoServicio === 'sala-juntas' || tipoServicio === 'oficina-privada')) {
    capacidadSelect.innerHTML = '<option value="">Seleccionar capacidad</option>';
    
    if (tipoServicio === 'sala-juntas') {
      if (ciudad === 'tegucigalpa') {
        capacidadSelect.innerHTML += 
          '<option value="1-4-vanguardia">👥 1-4 personas: Vanguardia</option>' +
          '<option value="5-8-inspiracion">👥 5-8 personas: Inspiración</option>' +
          '<option value="9-18-sinergia">👥 9-18 personas: Sinergia</option>';
      } else if (ciudad === 'san-pedro-sula') {
        capacidadSelect.innerHTML += 
          '<option value="1-4-comodas">👥 1-4 personas: Cómodas</option>' +
          '<option value="1-18-confort">👥 1-18 personas: Confort</option>' +
          '<option value="9-18-amplias">👥 9-18 personas: Amplias</option>';
      }
    } else if (tipoServicio === 'oficina-privada') {
      capacidadSelect.innerHTML += 
        '<option value="1-2">👤 1-2 personas</option>' +
        '<option value="3-4">👥 3-4 personas</option>';
    }
    
    mostrarElemento('capacidad-options');
  }
  
  updateButtonState();
}

function updateReservaOptions() {
  const tipoServicio = document.getElementById('tipo-servicio').value;
  const capacidad = document.getElementById('capacidad')?.value;
  const espacios = document.getElementById('espacios')?.value;
  
  // Limpiar selects dependientes
  limpiarSelects(['tipo-reserva', 'tiempo-elegido']);
  ocultarElementos(['reserva-options', 'tiempo-options']);
  
  if ((tipoServicio === 'cowork' && espacios) || 
      ((tipoServicio === 'sala-juntas' || tipoServicio === 'oficina-privada') && capacidad)) {
    mostrarElemento('reserva-options');
  }
  
  updateButtonState();
}

function updateTiempoOptions() {
  const tipoReserva = document.getElementById('tipo-reserva').value;
  const tiempoSelect = document.getElementById('tiempo-elegido');
  const tiempoLabel = document.getElementById('tiempo-label');
  
  if (!tipoReserva || !tiempoSelect || !tiempoLabel) {
    ocultarElementos(['tiempo-options']);
    return;
  }
  
  // Limpiar select
  tiempoSelect.innerHTML = '<option value="">Seleccionar</option>';
  
  switch (tipoReserva) {
    case 'hora':
      tiempoLabel.textContent = 'Elegir horario';
      tiempoSelect.innerHTML += 
        '<option value="1-hora">⏰ 1 hora</option>' +
        '<option value="2-horas">⏰ 2 horas</option>' +
        '<option value="3-horas">⏰ 3 horas</option>' +
        '<option value="4-horas">⏰ 4 horas</option>' +
        '<option value="5-horas-plus">⏰ + 5 horas</option>';
      break;
      
    case 'dia':
      tiempoLabel.textContent = 'Elegir día';
      tiempoSelect.innerHTML += 
        '<option value="lunes">📅 Lunes</option>' +
        '<option value="martes">📅 Martes</option>' +
        '<option value="miercoles">📅 Miércoles</option>' +
        '<option value="jueves">📅 Jueves</option>' +
        '<option value="viernes">📅 Viernes</option>' +
        '<option value="sabado">📅 Sábado</option>';
      break;
      
    case 'semana':
      tiempoLabel.textContent = 'Elegir semanas';
      tiempoSelect.innerHTML += 
        '<option value="1-semana">📅 1 semana</option>' +
        '<option value="2-semanas">📅 2 semanas</option>' +
        '<option value="3-semanas">📅 3 semanas</option>' +
        '<option value="4-semanas">📅 4 semanas</option>';
      break;
      
    case 'mes':
      tiempoLabel.textContent = 'Elegir meses';
      tiempoSelect.innerHTML += 
        '<option value="1-mes">📅 1 mes</option>' +
        '<option value="2-meses">📅 2 meses</option>' +
        '<option value="3-meses">📅 3 meses</option>' +
        '<option value="4-meses">📅 4 meses</option>' +
        '<option value="5-meses-plus">📅 + 5 meses</option>';
      break;
  }
  
  mostrarElemento('tiempo-options');
  updateButtonState();
}

// ===== ACTUALIZAR ESTADO DEL BOTÓN =====
function updateButtonState() {
  const tipoServicio = document.getElementById('tipo-servicio')?.value;
  const paquete = document.getElementById('paquete-virtual')?.value;
  const ciudad = document.getElementById('ciudad')?.value;
  const capacidad = document.getElementById('capacidad')?.value;
  const espacios = document.getElementById('espacios')?.value;
  const tipoReserva = document.getElementById('tipo-reserva')?.value;
  const tiempo = document.getElementById('tiempo-elegido')?.value;
  
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.querySelector('#btn-principal-servicios i');
  
  if (!btnText || !btnIcon) return;
  
  let readyToQuote = false;
  
  if (tipoServicio === 'oficina-virtual' && paquete && ciudad) {
    readyToQuote = true;
  } else if (tipoServicio === 'cowork' && ciudad && espacios && tipoReserva && tiempo) {
    readyToQuote = true;
  } else if ((tipoServicio === 'sala-juntas' || tipoServicio === 'oficina-privada') && 
             ciudad && capacidad && tipoReserva && tiempo) {
    readyToQuote = true;
  }
  
  if (readyToQuote) {
    btnText.textContent = tipoServicio === 'oficina-virtual' ? 'Cotizar' : 'Reservar';
    btnIcon.className = tipoServicio === 'oficina-virtual' ? 'fas fa-calculator' : 'fas fa-calendar-check';
  } else {
    btnText.textContent = 'Seleccionar Servicio';
    btnIcon.className = 'fas fa-search';
  }
}

// ===== PROCESAR SOLICITUD =====
function procesarSolicitud() {
  const tipoServicio = document.getElementById('tipo-servicio')?.value;
  
  if (!tipoServicio) {
    alert('Seleccione un tipo de servicio');
    return;
  }
  
  solicitudActual = {
    tipo: 'servicio',
    servicio: tipoServicio,
    paquete: document.getElementById('paquete-virtual')?.value,
    ciudad: document.getElementById('ciudad')?.value,
    capacidad: document.getElementById('capacidad')?.value,
    espacios: document.getElementById('espacios')?.value,
    tipoReserva: document.getElementById('tipo-reserva')?.value,
    tiempo: document.getElementById('tiempo-elegido')?.value
  };
  
  mostrarResumen();
}

// ===== FUNCIONES PARA PROYECTOS =====
function updateProyectoOptions() {
  const tipoProyecto = document.getElementById('tipo-proyecto')?.value;
  
  // Siempre limpiar y ocultar primero
  limpiarSelects(['tipo-producto']);
  document.getElementById('descripcion-proyecto').value = '';
  ocultarElementos(['catrachas-options', 'proyecto-descripcion']);
  
  if (!tipoProyecto) return;
  
  if (tipoProyecto === 'manos-catrachas') {
    mostrarElemento('catrachas-options');
  } else if (tipoProyecto === 'llave-mano' || tipoProyecto === 'proveedores-locales') {
    mostrarElemento('proyecto-descripcion');
  }
}

// ===== ENVIAR POR WHATSAPP =====
function enviarWhatsApp() {
  const tipoProyecto = document.getElementById('tipo-proyecto')?.value;
  
  if (!tipoProyecto) {
    alert('Seleccione un tipo de proyecto');
    return;
  }
  
  let mensaje = `¡Hola! Me interesa un proyecto de EasyOffice:\n\n`;
  
  if (tipoProyecto === 'llave-mano') {
    mensaje += `🔑 *Proyecto Llave en Mano*\n`;
  } else if (tipoProyecto === 'manos-catrachas') {
    mensaje += `🇭🇳 *Manos Catrachas*\n`;
    const producto = document.getElementById('tipo-producto')?.value;
    if (producto) {
      const productos = {
        'cafe': '☕ Café',
        'artesanias': '🎨 Artesanías', 
        'textiles': '🧵 Textiles',
        'alimentos': '🥘 Alimentos'
      };
      mensaje += `Producto: ${productos[producto] || producto}\n`;
    }
  } else if (tipoProyecto === 'proveedores-locales') {
    mensaje += `🤝 *Proveedores Locales*\n`;
  }
  
  const descripcion = document.getElementById('descripcion-proyecto')?.value;
  if (descripcion) {
    mensaje += `\n📝 *Descripción:*\n${descripcion}\n`;
  }
  
  mensaje += `\n¿Podrían contactarme para más información?`;
  
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, '')}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// ===== MOSTRAR RESUMEN (MODIFICADO) =====
function mostrarResumen() {
  const content = document.getElementById('resumen-content');
  if (!content) return;
  
  let html = '<div class="resumen-items-smart">';
  
  // Agregar información del servicio
  html += `
    <div class="resumen-item-smart">
      <i class="fas fa-${getServiceIcon(solicitudActual.servicio)}"></i>
      <div>
        <strong>${getServiceName(solicitudActual.servicio)}</strong>
        <p>${getServiceDetails()}</p>
      </div>
    </div>
  `;
  
  // Agregar información de ubicación
  if (solicitudActual.ciudad) {
    html += `
      <div class="resumen-item-smart">
        <i class="fas fa-map-marker-alt"></i>
        <div>
          <strong>Ubicación</strong>
          <p>${getCityName(solicitudActual.ciudad)}</p>
        </div>
      </div>
    `;
  }
  
  // Agregar información de reserva si aplica
  if (solicitudActual.tipoReserva && solicitudActual.tiempo) {
    html += `
      <div class="resumen-item-smart">
        <i class="fas fa-calendar-alt"></i>
        <div>
          <strong>Reserva</strong>
          <p>${getReservaText(solicitudActual.tipoReserva, solicitudActual.tiempo)}</p>
        </div>
      </div>
    `;
  }
  
  html += '</div>';
  
  // MODIFICACIÓN: Agregar botones directamente en el modal
  html += `
    <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; align-items: center;">
      <button onclick="contactarDirecto()" style="background: linear-gradient(135deg, #ff6b35, #ff8c42); color: white; border: none; padding: 14px 28px; border-radius: 25px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; font-size: 16px;">
        <i class="fas fa-calendar-check"></i>
        Reservar
      </button>
      <button onclick="cerrarModal('modal-resumen')" style="background: #6c757d; color: white; border: none; padding: 14px 28px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-size: 16px;">
        Cerrar
      </button>
    </div>
  `;
  
  content.innerHTML = html;
  
  const modal = document.getElementById('modal-resumen');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

// ===== FUNCIONES AUXILIARES =====
function getServiceIcon(servicio) {
  const icons = {
    'oficina-virtual': 'laptop',
    'sala-juntas': 'users',
    'oficina-privada': 'building',
    'cowork': 'coffee'
  };
  return icons[servicio] || 'briefcase';
}

function getServiceName(servicio) {
  const names = {
    'oficina-virtual': 'Oficina Virtual',
    'sala-juntas': 'Sala de Juntas',
    'oficina-privada': 'Oficina Privada',
    'cowork': 'Cowork'
  };
  return names[servicio] || 'Servicio';
}

function getServiceDetails() {
  if (solicitudActual.servicio === 'oficina-virtual') {
    return `Paquete ${solicitudActual.paquete === 'basico' ? 'Básico' : 'Plus'}`;
  } else if (solicitudActual.capacidad) {
    if (solicitudActual.capacidad.includes('vanguardia')) return 'Sala Vanguardia (1-4 personas)';
    if (solicitudActual.capacidad.includes('inspiracion')) return 'Sala Inspiración (5-8 personas)';
    if (solicitudActual.capacidad.includes('sinergia')) return 'Sala Sinergia (9-18 personas)';
    if (solicitudActual.capacidad.includes('comodas')) return 'Sala Cómodas (1-4 personas)';
    if (solicitudActual.capacidad.includes('confort')) return 'Sala Confort (1-18 personas)';
    if (solicitudActual.capacidad.includes('amplias')) return 'Sala Amplias (9-18 personas)';
    // Arreglar formato para oficina privada: "1-2" y "3-4"
    if (solicitudActual.capacidad === '1-2') return '1-2 personas';
    if (solicitudActual.capacidad === '3-4') return '3-4 personas';
    return solicitudActual.capacidad.replace('_', ' ');
  } else if (solicitudActual.espacios) {
    return `${solicitudActual.espacios} espacio${solicitudActual.espacios === '1' ? '' : 's'}`;
  }
  return '';
}

function getCityName(ciudad) {
  const cities = {
    'tegucigalpa': 'Tegucigalpa',
    'san-pedro-sula': 'San Pedro Sula'
  };
  return cities[ciudad] || ciudad;
}

function getReservaText(tipo, tiempo) {
  const tipos = {
    'hora': 'Por hora',
    'dia': 'Por día',
    'semana': 'Por semana',
    'mes': 'Por mes'
  };
  
  let tiempoFormateado = tiempo.replace('-', ' ').replace('s', 's');
  
  // Formatear días específicos
  const diasSemana = {
    'lunes': 'Lunes',
    'martes': 'Martes', 
    'miercoles': 'Miércoles',
    'jueves': 'Jueves',
    'viernes': 'Viernes',
    'sabado': 'Sábado'
  };
  
  if (diasSemana[tiempo]) {
    tiempoFormateado = diasSemana[tiempo];
  }
  
  return `${tipos[tipo] || tipo} - ${tiempoFormateado}`;
}

// ===== CONTACTAR DIRECTO (SIMPLIFICADO) =====
function contactarDirecto() {
  let mensaje = `¡Hola! Me interesa reservar un servicio de EasyOffice.\n\n`;
  
  if (solicitudActual.servicio) {
    mensaje += `📋 *Servicio:* ${getServiceName(solicitudActual.servicio)}\n`;
    if (solicitudActual.ciudad) {
      mensaje += `📍 *Ciudad:* ${getCityName(solicitudActual.ciudad)}\n`;
    }
    if (solicitudActual.paquete) {
      mensaje += `📦 *Paquete:* ${solicitudActual.paquete === 'basico' ? 'Básico' : 'Plus'}\n`;
    }
    if (solicitudActual.capacidad) {
      mensaje += `👥 *Capacidad:* ${getServiceDetails()}\n`;
    }
    if (solicitudActual.espacios) {
      mensaje += `🪑 *Espacios:* ${solicitudActual.espacios}\n`;
    }
    if (solicitudActual.tipoReserva && solicitudActual.tiempo) {
      mensaje += `📅 *Reserva:* ${getReservaText(solicitudActual.tipoReserva, solicitudActual.tiempo)}\n`;
    }
  }
  
  mensaje += `\n¿Podrían contactarme para confirmar disponibilidad y proceder con la reserva?`;
  
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, '')}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
  
  // Cerrar el modal después de enviar
  cerrarModal('modal-resumen');
}

// ===== FUNCIONES AUXILIARES =====
function mostrarElemento(id) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.classList.remove('hidden');
}

function ocultarElementos(ids) {
  ids.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.classList.add('hidden');
  });
}

function limpiarSelects(ids) {
  ids.forEach(id => {
    const select = document.getElementById(id);
    if (select) {
      select.selectedIndex = 0;
      // Si es el select de capacidad, también limpiar su contenido
      if (id === 'capacidad') {
        select.innerHTML = '<option value="">Seleccionar capacidad</option>';
      }
      // Si es el select de tiempo, también limpiar su contenido  
      if (id === 'tiempo-elegido') {
        select.innerHTML = '<option value="">Seleccionar</option>';
      }
    }
  });
}

function cerrarModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function resetearFormularios() {
  // Resetear todos los selects
  document.querySelectorAll('select').forEach(select => {
    if (select) select.selectedIndex = 0;
  });
  
  // Resetear textarea
  const textarea = document.getElementById('descripcion-proyecto');
  if (textarea) textarea.value = '';
  
  // Ocultar todas las opciones
  ocultarElementos([
    'virtual-options', 'ciudad-options', 'capacidad-options', 
    'espacios-options', 'reserva-options', 'tiempo-options',
    'catrachas-options', 'proyecto-descripcion'
  ]);
  
  // Resetear solicitud actual
  solicitudActual = {};
  
  updateButtonState();
}

// Si el DOM ya está cargado cuando se ejecuta el script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCotizador);
} else {
  // DOM ya está listo
  setTimeout(initializeCotizador, 100);
}

// Hacer la función global para poder llamarla desde el fetch
window.initializeCotizadorFromFetch = initializeCotizador;