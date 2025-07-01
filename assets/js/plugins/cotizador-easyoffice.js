// ===== VARIABLES GLOBALES =====
let solicitudActual = {};
const WHATSAPP_NUMBER = '+50432777777';

// ✅ CONFIGURACIÓN INTEGRADA
const EASYOFFICE_CONFIG = {
  debug: true,
  googleSheetsURL: 'https://script.google.com/macros/s/AKfycbwVXHjohRPGySe4BcaB2_Vo1vYv6FTUkFyjQKEL30PTjrb1XqenAppvyzR6nZwDTejh/exec',
  whatsappNumber: '50432777777'
};

// ===== INICIALIZACIÓN AL CARGAR EL DOM =====
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeCotizador, 100);
});

function initializeCotizador() {
  console.log('🚀 Inicializando EasyOffice Cotizador v3.0...');
  
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
  
  // ✅ CONFIGURAR VALIDACIONES EN TIEMPO REAL AL INICIALIZAR
  setTimeout(() => {
    configurarValidacionesEnTiempoReal();
  }, 500);
  
  // ✅ CONFIGURAR FORMULARIO DE CONTACTO SI EXISTE
  setTimeout(() => {
    manejarFormularioContacto();
  }, 1000);
  
  console.log('✅ Cotizador v3.0 inicializado correctamente');
}

// ===== FUNCIONES PRINCIPALES PARA SERVICIOS (TU LÓGICA ORIGINAL) =====
function updateServicioOptions() {
  const tipoServicio = document.getElementById('tipo-servicio').value;
  
  // Ocultar todas las opciones
  ocultarElementos([
    'virtual-options', 'ciudad-options', 'capacidad-options', 
    'espacios-options', 'reserva-options', 'tiempo-options', 'contrato-options'
  ]);
  
  // Limpiar selects dependientes
  limpiarSelects(['paquete-virtual', 'ciudad', 'capacidad', 'espacios', 'tipo-reserva', 'tiempo-elegido', 'tipo-contrato']);
  
  if (tipoServicio === 'oficina-virtual') {
    mostrarElemento('virtual-options');
  } else if (tipoServicio === 'sala-juntas' || tipoServicio === 'oficina-privada' || tipoServicio === 'cowork' || tipoServicio === 'llave-mano') {
    // Inmediatamente configurar las ciudades para el servicio seleccionado
    configurarCiudades(tipoServicio);
    mostrarElemento('ciudad-options');
  }
  
  updateButtonState();
}

// Nueva función para configurar ciudades según el servicio
function configurarCiudades(tipoServicio) {
  const ciudadSelect = document.getElementById('ciudad');
  
  if (ciudadSelect) {
    ciudadSelect.innerHTML = '<option value="">Seleccionar ciudad</option>';
    
    // Agregar las ciudades principales siempre
    ciudadSelect.innerHTML += '<option value="Tegucigalpa">🏙️ Tegucigalpa</option>';
    ciudadSelect.innerHTML += '<option value="San Pedro Sula">🌆 San Pedro Sula</option>';
    
    // Solo agregar "Otra ciudad" para Llave en Mano
    if (tipoServicio === 'llave-mano') {
      ciudadSelect.innerHTML += '<option value="Otra ciudad">🌍 Otra ciudad</option>';
    }
  }
}

function updateCiudadOptions() {
  // Esta función ahora solo se ejecuta desde oficina virtual
  // Las ciudades ya están configuradas por configurarCiudades()
  mostrarElemento('ciudad-options');
  
  // Limpiar selects dependientes
  limpiarSelects(['capacidad', 'espacios', 'tipo-reserva', 'tiempo-elegido', 'tipo-contrato']);
  ocultarElementos(['capacidad-options', 'espacios-options', 'reserva-options', 'tiempo-options', 'contrato-options']);
  
  updateButtonState();
}

function updateCapacidadOptions() {
  const tipoServicio = document.getElementById('tipo-servicio').value;
  const ciudad = document.getElementById('ciudad').value;
  const capacidadSelect = document.getElementById('capacidad');
  
  // Limpiar selects dependientes
  limpiarSelects(['capacidad', 'espacios', 'tipo-reserva', 'tiempo-elegido', 'tipo-contrato']);
  ocultarElementos(['capacidad-options', 'espacios-options', 'reserva-options', 'tiempo-options', 'contrato-options']);
  
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
  
  // Para llave en mano, configurar capacidades específicas (para todas las ciudades)
  if (tipoServicio === 'llave-mano') {
    if (capacidadSelect) {
      capacidadSelect.innerHTML = '<option value="">Seleccionar capacidad</option>' +
        '<option value="1-10">👥 1 a 10 personas</option>' +
        '<option value="11-20">👥 11 a 20 personas</option>' +
        '<option value="21-30">👥 21 a 30 personas</option>' +
        '<option value="30-plus">👥 Más de 30 personas</option>';
      mostrarElemento('capacidad-options');
    }
    updateButtonState();
    return;
  }
  
  // Para sala de juntas y oficina privada, mostrar capacidad (solo para Tegus y SPS)
  if (capacidadSelect && (tipoServicio === 'sala-juntas' || tipoServicio === 'oficina-privada')) {
    capacidadSelect.innerHTML = '<option value="">Seleccionar capacidad</option>';
    
    if (tipoServicio === 'sala-juntas') {
      if (ciudad === 'Tegucigalpa') {
        capacidadSelect.innerHTML += 
          '<option value="1-4-vanguardia">👥 1-4 personas: Vanguardia</option>' +
          '<option value="5-8-inspiracion">👥 5-8 personas: Inspiración</option>' +
          '<option value="9-18-sinergia">👥 9-18 personas: Sinergia</option>';
      } else if (ciudad === 'San Pedro Sula') {
        capacidadSelect.innerHTML += 
          '<option value="1-4-comodas">👥 1-4 personas: Cómodas</option>' +
          '<option value="1-18-confort">👥 1-18 personas: Confort</option>' +
          '<option value="9-18-amplias">👥 9-18 personas: Amplias</option>';
      }
    } else if (tipoServicio === 'oficina-privada') {
      // Solo para Tegus y SPS
      if (ciudad === 'Tegucigalpa' || ciudad === 'San Pedro Sula') {
        capacidadSelect.innerHTML += 
          '<option value="1-2">👤 1-2 personas</option>' +
          '<option value="3-4">👥 3-4 personas</option>';
      }
    }
    
    mostrarElemento('capacidad-options');
  }
  
  updateButtonState();
}

// ===== MANEJAR CAMBIO DE CAPACIDAD =====
function handleCapacidadChange() {
  const tipoServicio = document.getElementById('tipo-servicio').value;
  
  if (tipoServicio === 'llave-mano') {
    // Para Llave en Mano, ir a opciones de contrato
    updateContratoOptions();
  } else {
    // Para Sala de Juntas y Oficina Privada, ir a opciones de reserva
    updateReservaOptions();
  }
}

function updateContratoOptions() {
  const tipoServicio = document.getElementById('tipo-servicio').value;
  const capacidad = document.getElementById('capacidad')?.value;
  const contratoSelect = document.getElementById('tipo-contrato');
  
  // Limpiar select de contrato
  limpiarSelects(['tipo-contrato']);
  ocultarElementos(['contrato-options']);
  
  // Solo para Llave en Mano Y cuando ya tenga capacidad seleccionada
  if (tipoServicio === 'llave-mano' && capacidad && contratoSelect) {
    // LLENAR las opciones del dropdown
    contratoSelect.innerHTML = '<option value="">Seleccionar contrato</option>' +
      '<option value="6-meses">📅 6 meses</option>' +
      '<option value="12-meses">📅 12 meses</option>' +
      '<option value="18-meses">📅 18 meses</option>' +
      '<option value="18-meses-plus">📅 Más de 18 meses</option>';
    
    mostrarElemento('contrato-options');
  }
  
  updateButtonState();
}

function updateReservaOptions() {
  const tipoServicio = document.getElementById('tipo-servicio').value;
  const capacidad = document.getElementById('capacidad')?.value;
  const espacios = document.getElementById('espacios')?.value;
  const tipoContrato = document.getElementById('tipo-contrato')?.value;
  
  // Limpiar selects dependientes
  limpiarSelects(['tipo-reserva', 'tiempo-elegido']);
  ocultarElementos(['reserva-options', 'tiempo-options']);
  
  // Para llave en mano, si ya tiene contrato, ya está listo (no necesita reserva)
  if (tipoServicio === 'llave-mano' && tipoContrato) {
    updateButtonState();
    return;
  }
  
  // Para cowork, necesita espacios seleccionados
  if ((tipoServicio === 'cowork' && espacios) || 
      // Para sala de juntas y oficina privada, necesita capacidad seleccionada
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
    updateButtonState();
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

// ===== ACTUALIZAR ESTADO DEL BOTÓN CON VALIDACIONES COMPLETAS =====
function updateButtonState() {
  const tipoServicio = document.getElementById('tipo-servicio')?.value;
  const paquete = document.getElementById('paquete-virtual')?.value;
  const ciudad = document.getElementById('ciudad')?.value;
  const capacidad = document.getElementById('capacidad')?.value;
  const espacios = document.getElementById('espacios')?.value;
  const tipoReserva = document.getElementById('tipo-reserva')?.value;
  const tiempo = document.getElementById('tiempo-elegido')?.value;
  const tipoContrato = document.getElementById('tipo-contrato')?.value;
  
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.querySelector('#btn-principal-servicios i');
  
  if (!btnText || !btnIcon) return;
  
  let readyToQuote = false;
  
  // VALIDACIONES ESPECÍFICAS POR SERVICIO
  if (tipoServicio === 'oficina-virtual') {
    // Oficina Virtual: necesita paquete Y ciudad
    if (paquete && ciudad) {
      readyToQuote = true;
      btnText.textContent = 'Cotizar';
      btnIcon.className = 'fas fa-calculator';
    }
  } else if (tipoServicio === 'llave-mano') {
    // Llave en Mano: necesita ciudad Y capacidad Y tipo de contrato
    if (ciudad && capacidad && tipoContrato) {
      readyToQuote = true;
      btnText.textContent = 'Cotizar';
      btnIcon.className = 'fas fa-calculator';
    }
  } else if (tipoServicio === 'cowork') {
    // Cowork: necesita ciudad Y espacios Y tipo de reserva Y tiempo
    if (ciudad && espacios && tipoReserva && tiempo) {
      readyToQuote = true;
      btnText.textContent = 'Reservar';
      btnIcon.className = 'fas fa-calendar-check';
    }
  } else if (tipoServicio === 'sala-juntas' || tipoServicio === 'oficina-privada') {
    // Sala de Juntas/Oficina Privada: necesita ciudad Y capacidad Y tipo de reserva Y tiempo
    if (ciudad && capacidad && tipoReserva && tiempo) {
      readyToQuote = true;
      btnText.textContent = 'Reservar';
      btnIcon.className = 'fas fa-calendar-check';
    }
  }
  
  // Si no está listo, mostrar estado inicial
  if (!readyToQuote) {
    btnText.textContent = 'Seleccionar Servicio';
    btnIcon.className = 'fas fa-search';
  }
}

// ===== FUNCIONES PARA OTROS (ANTERIORMENTE PROYECTOS) =====
function updateOtrosOptions() {
  const tipoServicio = document.getElementById('tipo-otros')?.value;
  
  // Limpiar descripción
  document.getElementById('descripcion-otros').value = '';
  ocultarElementos(['otros-descripcion']);
  
  if (!tipoServicio) return;
  
  if (tipoServicio === 'servicios-adicionales') {
    mostrarElemento('otros-descripcion');
  }
  
  updateOtrosButtonState();
}

function updateOtrosButtonState() {
  const tipoServicio = document.getElementById('tipo-otros')?.value;
  const descripcion = document.getElementById('descripcion-otros')?.value;
  
  const btnText = document.getElementById('btn-text-otros');
  const btnIcon = document.querySelector('#btn-principal-otros i');
  
  if (!btnText || !btnIcon) return;
  
  if (!tipoServicio) {
    btnText.textContent = 'Seleccione una solución';
    btnIcon.className = 'fas fa-search';
  } else if (tipoServicio === 'servicios-adicionales' && !descripcion.trim()) {
    btnText.textContent = 'Preparando servicio';
    btnIcon.className = 'fas fa-cog fa-spin';
  } else if (tipoServicio === 'servicios-adicionales' && descripcion.trim()) {
    btnText.textContent = 'Enviar';
    btnIcon.className = 'fas fa-paper-plane';
  }
}

// ===== PROCESAR SOLICITUD CON VALIDACIONES COMPLETAS =====
async function procesarSolicitud() {
  console.log('📝 Iniciando procesamiento de solicitud...');
  
  const tipoServicio = document.getElementById('tipo-servicio')?.value;
  
  if (!tipoServicio) {
    mostrarAlerta('Seleccione un tipo de servicio');
    return;
  }
  
  // VALIDACIONES ESPECÍFICAS POR CADA SERVICIO
  if (tipoServicio === 'oficina-virtual') {
    const paquete = document.getElementById('paquete-virtual')?.value;
    const ciudad = document.getElementById('ciudad')?.value;
    
    if (!paquete) {
      mostrarAlerta('Debe seleccionar un paquete para la oficina virtual');
      return;
    }
    if (!ciudad) {
      mostrarAlerta('Debe seleccionar una ciudad');
      return;
    }
  } 
  else if (tipoServicio === 'llave-mano') {
    const ciudad = document.getElementById('ciudad')?.value;
    const capacidad = document.getElementById('capacidad')?.value;
    const tipoContrato = document.getElementById('tipo-contrato')?.value;
    
    if (!ciudad) {
      mostrarAlerta('Debe seleccionar una ciudad');
      return;
    }
    if (!capacidad) {
      mostrarAlerta('Debe seleccionar la capacidad para llave en mano');
      return;
    }
    if (!tipoContrato) {
      mostrarAlerta('Debe seleccionar el tipo de contrato');
      return;
    }
  }
  else if (tipoServicio === 'cowork') {
    const ciudad = document.getElementById('ciudad')?.value;
    const espacios = document.getElementById('espacios')?.value;
    const tipoReserva = document.getElementById('tipo-reserva')?.value;
    const tiempo = document.getElementById('tiempo-elegido')?.value;
    
    if (!ciudad) {
      mostrarAlerta('Debe seleccionar una ciudad');
      return;
    }
    if (!espacios) {
      mostrarAlerta('Debe seleccionar la cantidad de espacios');
      return;
    }
    if (!tipoReserva) {
      mostrarAlerta('Debe seleccionar el tipo de reserva');
      return;
    }
    if (!tiempo) {
      mostrarAlerta('Debe completar el tiempo de reserva');
      return;
    }
  }
  else if (tipoServicio === 'sala-juntas' || tipoServicio === 'oficina-privada') {
    const ciudad = document.getElementById('ciudad')?.value;
    const capacidad = document.getElementById('capacidad')?.value;
    const tipoReserva = document.getElementById('tipo-reserva')?.value;
    const tiempo = document.getElementById('tiempo-elegido')?.value;
    
    if (!ciudad) {
      mostrarAlerta('Debe seleccionar una ciudad');
      return;
    }
    if (!capacidad) {
      mostrarAlerta('Debe seleccionar la capacidad');
      return;
    }
    if (!tipoReserva) {
      mostrarAlerta('Debe seleccionar el tipo de reserva');
      return;
    }
    if (!tiempo) {
      mostrarAlerta('Debe completar el tiempo de reserva');
      return;
    }
  }
  
  // Si llegamos aquí, todo está validado correctamente
  solicitudActual = {
    tipo: 'servicio',
    servicio: tipoServicio,
    paquete: document.getElementById('paquete-virtual')?.value,
    ciudad: document.getElementById('ciudad')?.value,
    capacidad: document.getElementById('capacidad')?.value,
    espacios: document.getElementById('espacios')?.value,
    tipoReserva: document.getElementById('tipo-reserva')?.value,
    tiempo: document.getElementById('tiempo-elegido')?.value,
    tipoContrato: document.getElementById('tipo-contrato')?.value
  };
  
  console.log('📊 Solicitud actual preparada:', solicitudActual);
  console.log('🔍 Detalles específicos capturados:');
  console.log('   - Tipo:', solicitudActual.tipo);
  console.log('   - Servicio:', solicitudActual.servicio);
  console.log('   - Paquete:', solicitudActual.paquete);
  console.log('   - Ciudad:', solicitudActual.ciudad);
  console.log('   - Capacidad:', solicitudActual.capacidad);
  console.log('   - Espacios:', solicitudActual.espacios);
  console.log('   - Tipo Reserva:', solicitudActual.tipoReserva);
  console.log('   - Tiempo:', solicitudActual.tiempo);
  console.log('   - Tipo Contrato:', solicitudActual.tipoContrato);
  
  // ✅ 1. MOSTRAR MODAL DE RESUMEN PRIMERO
  mostrarModalResumen();
}

async function procesarOtros() {
  const tipoServicio = document.getElementById('tipo-otros')?.value;
  const descripcion = document.getElementById('descripcion-otros')?.value;
  
  if (!tipoServicio) {
    mostrarAlerta('Debe seleccionar un tipo de servicio');
    return;
  }
  
  if (tipoServicio === 'servicios-adicionales' && !descripcion.trim()) {
    mostrarAlerta('Debes escribir la solución que necesitas para poder ayudarte de la mejor manera');
    return;
  }
  
  solicitudActual = {
    tipo: 'otros',
    servicio: tipoServicio,
    descripcion: descripcion
  };
  
  console.log('📊 Solicitud "otros" preparada:', solicitudActual);
  console.log('🔍 Detalles específicos:');
  console.log('   - Tipo:', solicitudActual.tipo);
  console.log('   - Servicio:', solicitudActual.servicio);
  console.log('   - Descripción:', solicitudActual.descripcion);
  
  // ✅ 1. MOSTRAR MODAL DE RESUMEN PRIMERO
  mostrarModalResumen();
}

// ✅ 1. MODAL DE RESUMEN RESTAURADO - CON EVENT LISTENERS CORREGIDOS
function mostrarModalResumen() {
  // Eliminar modal existente si hay uno
  const modalExistente = document.getElementById('modal-resumen');
  if (modalExistente) {
    modalExistente.remove();
  }

  let contenidoResumen = `
    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
      <h3 style="color: #ED8438; margin: 0 0 15px 0;">📋 Resumen de tu solicitud</h3>
      
      <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #ED8438;">
        <p><strong>🏗️ Servicio:</strong> ${formatearNombreServicio(solicitudActual.servicio)}</p>
        ${solicitudActual.ciudad ? `<p><strong>📍 Ciudad:</strong> ${solicitudActual.ciudad}</p>` : ''}
        ${solicitudActual.paquete ? `<p><strong>📦 Paquete:</strong> ${solicitudActual.paquete === 'basico' ? 'Básico' : 'Plus'}</p>` : ''}
        ${solicitudActual.capacidad ? `<p><strong>👥 Capacidad:</strong> ${solicitudActual.capacidad}</p>` : ''}
        ${solicitudActual.espacios ? `<p><strong>🪑 Espacios:</strong> ${solicitudActual.espacios}</p>` : ''}
        ${solicitudActual.tipoReserva && solicitudActual.tiempo ? `<p><strong>📅 Reserva:</strong> ${solicitudActual.tipoReserva} - ${solicitudActual.tiempo}</p>` : ''}
        ${solicitudActual.tipoContrato ? `<p><strong>📄 Contrato:</strong> ${solicitudActual.tipoContrato}</p>` : ''}
        ${solicitudActual.descripcion ? `<p><strong>💬 Descripción:</strong> ${solicitudActual.descripcion}</p>` : ''}
      </div>
      
      <p style="text-align: center; margin: 20px 0 10px 0; color: #666;">
        A continuación deberás ingresar tus datos de contacto para recibir la cotización
      </p>
    </div>
  `;

  const modalHtml = `
    <div id="modal-resumen" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
      <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
        ${contenidoResumen}
        
        <div style="text-align: center; margin-top: 20px;">
          <button id="btn-cancelar-resumen" style="background: #dc3545; color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer; margin-right: 10px;">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button id="btn-continuar-resumen" style="background: linear-gradient(135deg, #ED8438, #ff8c42); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer;">
            <i class="fas fa-arrow-right"></i> Continuar
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // ✅ AGREGAR EVENT LISTENERS DESPUÉS DE QUE EL MODAL ESTÉ EN EL DOM
  setTimeout(() => {
    const btnCancelar = document.getElementById('btn-cancelar-resumen');
    const btnContinuar = document.getElementById('btn-continuar-resumen');
    
    if (btnCancelar) {
      btnCancelar.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cerrarModalResumen();
      }, { once: true }); // ✅ solo una vez
    }
    
    if (btnContinuar) {
      btnContinuar.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ✅ Deshabilitar botón temporalmente
        btnContinuar.disabled = true;
        btnContinuar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Continuando...';
        
        setTimeout(() => {
          continuarADatos();
        }, 100);
      }, { once: true }); // ✅ solo una vez
    }
  }, 50); // ✅ pequeño delay para asegurar que el DOM esté listo
}

function cerrarModalResumen() {
  const modal = document.getElementById('modal-resumen');
  if (modal) {
    modal.remove();
  }
}

function continuarADatos() {
  cerrarModalResumen();
  mostrarModalDatos();
}

// ===== MODAL PARA RECOPILAR DATOS =====
function mostrarModalDatos() {
  const modal = document.getElementById('modal-datos');
  if (modal) {
    // Limpiar campos del modal
    document.getElementById('nombre-cliente').value = '';
    document.getElementById('telefono-cliente').value = '';
    document.getElementById('correo-cliente').value = '';
    
    // ✅ CONFIGURAR VALIDACIONES EN TIEMPO REAL CUANDO SE ABRE EL MODAL
    configurarValidacionesEnTiempoReal();
    
    modal.classList.remove('hidden');
  }
}

// ✅ VALIDAR Y ENVIAR - CON LOADING BUTTON
async function validarYEnviar() {
  console.log('🚀 Iniciando validación y envío...');
  
  const nombre = document.getElementById('nombre-cliente')?.value.trim();
  const telefono = document.getElementById('telefono-cliente')?.value.trim();
  const correo = document.getElementById('correo-cliente')?.value.trim();
  
  // ✅ PREVENIR MÚLTIPLES ENVÍOS
  const botonContinuar = document.querySelector('#modal-datos button[onclick="validarYEnviar()"]');
  if (botonContinuar && botonContinuar.disabled) {
    console.log('⚠️ Envío ya en proceso, ignorando...');
    return;
  }
  
  // Validaciones obligatorias
  if (!nombre) {
    mostrarAlerta('El nombre es obligatorio');
    return;
  }
  
  if (!telefono) {
    mostrarAlerta('El teléfono es obligatorio');
    return;
  }
  
  // ✅ VALIDACIÓN MEJORADA DE TELÉFONO
  // Solo números, 8 dígitos, debe iniciar con 2,3,8,9
  const telefonoLimpio = telefono.replace(/\D/g, '');
  
  if (telefonoLimpio.length !== 8) {
    mostrarAlerta('El teléfono debe tener exactamente 8 dígitos');
    return;
  }
  
  const primerDigito = telefonoLimpio.charAt(0);
  if (!['2', '3', '8', '9'].includes(primerDigito)) {
    mostrarAlerta('El teléfono debe iniciar con 2, 3, 8 o 9');
    return;
  }
  
  // ✅ VALIDACIÓN MEJORADA DE EMAIL
  if (correo) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      mostrarAlerta('El correo debe tener formato válido: usuario@dominio.com');
      return;
    }
  }
  
  // ✅ CAPITALIZAR DATOS CORRECTAMENTE
  const nombreCapitalizado = capitalizarNombre(nombre);
  const apellidoCapitalizado = ''; // Se separará del nombre completo
  const correoFormateado = correo ? correo.toLowerCase().trim() : '';
  
  // Separar nombre y apellido
  const partesNombre = nombreCapitalizado.split(' ');
  const primerNombre = partesNombre[0] || '';
  const apellidos = partesNombre.slice(1).join(' ') || '';
  
  // Guardar datos del cliente
  solicitudActual.cliente = {
    nombre: nombreCapitalizado,
    primerNombre: primerNombre,
    apellidos: apellidos,
    telefono: telefonoLimpio,
    correo: correoFormateado
  };
  
  console.log('✅ Datos validados y capitalizados:', solicitudActual.cliente);
  
  // ✅ CONFIGURAR LOADING EN BOTÓN
  if (botonContinuar) {
    botonContinuar.disabled = true;
    botonContinuar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  }
  
  console.log('✅ Datos validados, iniciando envío completo...');
  
  // ✅ PROCESAR ENVÍO COMPLETO (SHEETS + WHATSAPP + EMAILS)
  try {
    const resultado = await enviarSolicitudCompleta();
    
    if (resultado.success) {
      // ✅ ÉXITO - Cerrar modal de datos y mostrar modal final
      cerrarModal('modal-datos');
      mostrarModalExito();
      
    } else {
      // ❌ ERROR
      mostrarAlerta(resultado.message || '❌ Error enviando solicitud. Por favor intenta nuevamente.');
    }
    
  } catch (error) {
    console.error('❌ Error crítico en envío:', error);
    mostrarAlerta('❌ Error procesando solicitud. Por favor intenta nuevamente o contáctanos directamente.');
  } finally {
    // ✅ RESTAURAR BOTÓN SIEMPRE
    if (botonContinuar) {
      botonContinuar.disabled = false;
      botonContinuar.innerHTML = '<i class="fas fa-check"></i> Continuar';
    }
  }
}

// ✅ NUEVA FUNCIÓN PARA ENVÍO COMPLETO INTEGRADO - CORREGIDA
async function enviarSolicitudCompleta() {
  console.log('📨 Iniciando envío completo a Google Sheets + WhatsApp...');
  
  try {
    // ✅ PREPARAR DATOS PARA GOOGLE SHEETS CON CAMPOS ESPECÍFICOS
    const datosParaSheets = {
      // Datos básicos - NOMBRES EXACTOS QUE ESPERA GOOGLE APPS SCRIPT
      firstName: solicitudActual.cliente.primerNombre,
      lastName: solicitudActual.cliente.apellidos,
      phone: solicitudActual.cliente.telefono,
      email: solicitudActual.cliente.correo,
      city: solicitudActual.ciudad || '',
      serviceType: formatearNombreServicio(solicitudActual.servicio),
      message: solicitudActual.descripcion || 'Solicitud desde cotizador',
      
      // ✅ CAMPOS ESPECÍFICOS COTIZADOR - NOMBRES EXACTOS
      package: '',        // J
      capacity: '',       // K  
      reservationType: '', // L
      specificTime: '',   // M
      contractType: '',   // N
      estimatedPrice: '', // (para columna P)
      
      // ✅ MARCAR ORIGEN COMO COTIZADOR
      origen: 'cotizador' // O
    };
    
    // ✅ LLENAR CAMPOS ESPECÍFICOS SEGÚN EL TIPO DE SERVICIO - CORREGIDO
    console.log('🔄 Procesando servicio:', solicitudActual.servicio, 'tipo:', solicitudActual.tipo);
    
    if (solicitudActual.tipo === 'servicio') {
      switch(solicitudActual.servicio) {
        case 'oficina-virtual':
          datosParaSheets.package = solicitudActual.paquete || '';
          console.log('📦 Oficina Virtual - Paquete asignado:', datosParaSheets.package);
          break;
          
        case 'oficina-privada':
          datosParaSheets.capacity = solicitudActual.capacidad || '';
          datosParaSheets.reservationType = solicitudActual.tipoReserva || '';
          datosParaSheets.specificTime = solicitudActual.tiempo || '';
          console.log('🏢 Oficina Privada - Campos asignados:', {
            capacity: datosParaSheets.capacity,
            reservationType: datosParaSheets.reservationType, 
            specificTime: datosParaSheets.specificTime
          });
          break;
          
        case 'sala-juntas':
          datosParaSheets.capacity = solicitudActual.capacidad || '';
          datosParaSheets.reservationType = solicitudActual.tipoReserva || '';
          datosParaSheets.specificTime = solicitudActual.tiempo || '';
          console.log('🤝 Sala de Juntas - Campos asignados:', {
            capacity: datosParaSheets.capacity,
            reservationType: datosParaSheets.reservationType,
            specificTime: datosParaSheets.specificTime
          });
          break;
          
        case 'cowork':
          datosParaSheets.capacity = solicitudActual.espacios ? `${solicitudActual.espacios} espacios` : '';
          datosParaSheets.reservationType = solicitudActual.tipoReserva || '';
          datosParaSheets.specificTime = solicitudActual.tiempo || '';
          console.log('👥 Cowork - Campos asignados:', {
            capacity: datosParaSheets.capacity,
            reservationType: datosParaSheets.reservationType,
            specificTime: datosParaSheets.specificTime
          });
          break;
          
        case 'llave-mano':
          datosParaSheets.capacity = solicitudActual.capacidad || '';
          datosParaSheets.contractType = solicitudActual.tipoContrato || '';
          console.log('🔑 Llave en Mano - Campos asignados:', {
            capacity: datosParaSheets.capacity,
            contractType: datosParaSheets.contractType
          });
          break;
      }
    } else if (solicitudActual.tipo === 'otros') {
      // ✅ PARA SERVICIOS ADICIONALES
      datosParaSheets.serviceType = 'Servicios Adicionales'; // Nombre completo
      datosParaSheets.message = solicitudActual.descripcion || '';
      console.log('🔧 Servicios Adicionales - Descripción asignada:', datosParaSheets.message);
    }
    
    console.log('📊 Datos preparados para Google Sheets:', datosParaSheets);
    console.log('🔍 Verificando campos específicos ANTES de enviar:');
    console.log('   - Origen:', datosParaSheets.origen);
    console.log('   - Package (J):', datosParaSheets.package);
    console.log('   - Capacity (K):', datosParaSheets.capacity);
    console.log('   - ReservationType (L):', datosParaSheets.reservationType);
    console.log('   - SpecificTime (M):', datosParaSheets.specificTime);
    console.log('   - ContractType (N):', datosParaSheets.contractType);
    
    // ✅ ENVIAR A GOOGLE SHEETS - TODOS LOS CAMPOS COMO TEXTO
    console.log('📤 Enviando a Google Sheets...');
    const formData = new FormData();
    
    // ✅ AGREGAR TODOS LOS CAMPOS COMO STRING (NUNCA UNDEFINED)
    Object.keys(datosParaSheets).forEach(key => {
      const valor = String(datosParaSheets[key] || ''); // Convertir a string
      formData.append(key, valor);
      console.log(`📋 Campo ${key}: "${valor}"`);
    });
    
    console.log('📊 Total de campos enviados:', Object.keys(datosParaSheets).length);
    
    const responseSheets = await fetch(EASYOFFICE_CONFIG.googleSheetsURL, {
      method: 'POST',
      mode: 'no-cors', // Necesario para Google Apps Script
      body: formData
    });
    
    console.log('✅ Datos enviados a Google Sheets');
    
    // ✅ PREPARAR Y ENVIAR WHATSAPP
    console.log('📱 Preparando mensaje de WhatsApp...');
    const mensajeWhatsApp = generarMensajeWhatsApp();
    enviarWhatsApp(mensajeWhatsApp);
    
    return {
      success: true,
      message: 'Solicitud enviada exitosamente'
    };
    
  } catch (error) {
    console.error('❌ Error en envío completo:', error);
    
    // ✅ FALLBACK: AL MENOS ENVIAR WHATSAPP
    try {
      console.log('🔄 Fallback: Enviando solo WhatsApp...');
      const mensajeWhatsApp = generarMensajeWhatsApp();
      enviarWhatsApp(mensajeWhatsApp);
      
      return {
        success: true,
        message: 'Solicitud enviada por WhatsApp (problema temporal con base de datos)'
      };
    } catch (whatsappError) {
      console.error('❌ Error también en fallback WhatsApp:', whatsappError);
      return {
        success: false,
        message: 'Error enviando solicitud. Por favor contactanos directamente.'
      };
    }
  }
}

// ✅ GENERAR MENSAJE DE WHATSAPP MEJORADO
function generarMensajeWhatsApp() {
  let mensaje = `💰 SOLICITUD DE COTIZACIÓN EASYOFFICE\n\n`;
  
  // Información del cliente
  mensaje += `👤 Cliente: ${solicitudActual.cliente.nombre}\n`;
  mensaje += `📞 Teléfono: ${solicitudActual.cliente.telefono}\n`;
  if (solicitudActual.cliente.correo) {
    mensaje += `✉️ Email: ${solicitudActual.cliente.correo}\n`;
  }
  mensaje += `\n`;
  
  // Información del servicio
  mensaje += `🏗️ DETALLES DEL SERVICIO:\n`;
  mensaje += `📋 Tipo: ${formatearNombreServicio(solicitudActual.servicio)}\n`;
  
  if (solicitudActual.ciudad) {
    mensaje += `📍 Ciudad: ${solicitudActual.ciudad}\n`;
  }
  
  if (solicitudActual.paquete) {
    mensaje += `📦 Paquete: ${solicitudActual.paquete === 'basico' ? 'Básico' : 'Plus'}\n`;
  }
  
  if (solicitudActual.capacidad) {
    mensaje += `👥 Capacidad: ${solicitudActual.capacidad}\n`;
  }
  
  if (solicitudActual.espacios) {
    mensaje += `🪑 Espacios: ${solicitudActual.espacios}\n`;
  }
  
  if (solicitudActual.tipoReserva && solicitudActual.tiempo) {
    mensaje += `📅 Reserva: ${solicitudActual.tipoReserva} - ${solicitudActual.tiempo}\n`;
  }
  
  if (solicitudActual.tipoContrato) {
    mensaje += `📝 Contrato: ${solicitudActual.tipoContrato}\n`;
  }
  
  if (solicitudActual.descripcion) {
    mensaje += `💬 Descripción: ${solicitudActual.descripcion}\n`;
  }
  
  mensaje += `\n⏰ Fecha: ${new Date().toLocaleString('es-HN')}`;
  mensaje += `\n🌐 Cotización desde easyoffice.hn`;
  mensaje += `\n\n🚀 CLIENTE INTERESADO - COTIZAR PRONTO 🚀`;
  
  return mensaje;
}

// ✅ ENVIAR WHATSAPP
function enviarWhatsApp(mensaje) {
  const numeroLimpio = WHATSAPP_NUMBER.replace(/[^\d]/g, '');
  const mensajeCodificado = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`;
  
  console.log('📱 Abriendo WhatsApp...');
  window.open(urlWhatsApp, '_blank');
}

// ===== FUNCIONES AUXILIARES =====
function capitalizarNombre(nombre) {
  return nombre.toLowerCase().replace(/\b\w/g, letra => letra.toUpperCase());
}

function formatearNombreServicio(servicio) {
  const nombres = {
    'oficina-virtual': 'Oficina Virtual',
    'sala-juntas': 'Sala de Juntas',
    'oficina-privada': 'Oficina Privada',
    'cowork': 'Cowork',
    'llave-mano': 'Oficina Llave en Mano',
    'servicios-adicionales': 'Servicios Adicionales'
  };
  return nombres[servicio] || servicio;
}

// ✅ CONFIGURAR VALIDACIONES EN TIEMPO REAL
function configurarValidacionesEnTiempoReal() {
  // ✅ VALIDACIÓN DE TELÉFONO - SOLO NÚMEROS Y FORMATO
  const telefonoInput = document.getElementById('telefono-cliente');
  if (telefonoInput) {
    telefonoInput.addEventListener('input', function(e) {
      // Remover todo lo que no sea número
      let valor = e.target.value.replace(/\D/g, '');
      
      // Limitar a 8 dígitos
      if (valor.length > 8) {
        valor = valor.substring(0, 8);
      }
      
      // Formatear como xxxx-xxxx
      if (valor.length >= 5) {
        valor = valor.substring(0, 4) + '-' + valor.substring(4);
      }
      
      e.target.value = valor;
      
      // Validar primer dígito
      if (valor.length >= 1) {
        const primerDigito = valor.charAt(0);
        if (!['2', '3', '8', '9'].includes(primerDigito)) {
          e.target.style.borderColor = '#dc3545';
          e.target.style.backgroundColor = '#fff5f5';
        } else {
          e.target.style.borderColor = '#28a745';
          e.target.style.backgroundColor = '#f8fff8';
        }
      }
    });
    
    // Prevenir pegar texto no numérico
    telefonoInput.addEventListener('paste', function(e) {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text');
      const numerosSolo = paste.replace(/\D/g, '').substring(0, 8);
      if (numerosSolo) {
        let formatted = numerosSolo;
        if (formatted.length >= 5) {
          formatted = formatted.substring(0, 4) + '-' + formatted.substring(4);
        }
        e.target.value = formatted;
        e.target.dispatchEvent(new Event('input'));
      }
    });
  }
  
  // ✅ VALIDACIÓN DE EMAIL EN TIEMPO REAL
  const emailInput = document.getElementById('correo-cliente');
  if (emailInput) {
    emailInput.addEventListener('input', function(e) {
      const valor = e.target.value.trim();
      if (valor) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(valor)) {
          e.target.style.borderColor = '#28a745';
          e.target.style.backgroundColor = '#f8fff8';
        } else {
          e.target.style.borderColor = '#dc3545';
          e.target.style.backgroundColor = '#fff5f5';
        }
      } else {
        e.target.style.borderColor = '';
        e.target.style.backgroundColor = '';
      }
    });
  }
  
  // ✅ VALIDACIÓN DE NOMBRE - SOLO LETRAS Y ESPACIOS
  const nombreInput = document.getElementById('nombre-cliente');
  if (nombreInput) {
    nombreInput.addEventListener('input', function(e) {
      // Permitir solo letras, espacios y acentos
      const valor = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      e.target.value = valor;
    });
  }
}

function mostrarMensajeExito(mensaje) {
  mostrarAlerta(mensaje, 'success');
}

// ✅ 2. MODAL DE ÉXITO FINAL CON COLORES OFICIALES NARANJA
function mostrarModalExito() {
  const modalHtml = `
    <div id="modal-exito" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
      <div style="background: white; padding: 40px; border-radius: 15px; max-width: 450px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
        <i class="fas fa-check-circle" style="font-size: 64px; color: #ED8438; margin-bottom: 20px;"></i>
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 24px;">ATENCIÓN</h3>
        <p style="margin: 0 0 30px 0; color: #666; line-height: 1.6; font-size: 16px;">Solicitud enviada correctamente</p>
        <button onclick="cerrarModalExito()" style="background: linear-gradient(135deg, #ED8438, #ff8c42); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-size: 16px;">
          Entendido
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function cerrarModalExito() {
  const modal = document.getElementById('modal-exito');
  if (modal) {
    modal.remove();
    
    // ✅ RESETEAR FORMULARIO CUANDO SE CIERRA EL MODAL
    setTimeout(() => {
      resetearFormularios();
      solicitudActual = {}; // Limpiar solicitud actual
    }, 300);
  }
}

function mostrarAlerta(mensaje, tipo = 'error') {
  // Crear modal de alerta personalizado
  const tipoClass = tipo === 'success' ? 'success-alert' : 'error-alert';
  const icono = tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
  const color = tipo === 'success' ? '#ED8438' : '#ff6b35';
  
  const alertaHtml = `
    <div id="modal-alerta" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
      <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        <i class="fas ${icono}" style="font-size: 48px; color: ${color}; margin-bottom: 20px;"></i>
        <h3 style="margin: 0 0 15px 0; color: #333;">${tipo === 'success' ? '¡Excelente!' : 'Atención'}</h3>
        <p style="margin: 0 0 25px 0; color: #666; line-height: 1.5;">${mensaje}</p>
        <button onclick="cerrarAlerta()" style="background: linear-gradient(135deg, ${color}, ${color}aa); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
          ${tipo === 'success' ? '¡Perfecto!' : 'Entendido'}
        </button>
      </div>
    </div>
  `;
  
  // Remover alerta existente si la hay
  const alertaExistente = document.getElementById('modal-alerta');
  if (alertaExistente) {
    alertaExistente.remove();
  }
  
  // Agregar nueva alerta
  document.body.insertAdjacentHTML('beforeend', alertaHtml);
  
  // Auto-cerrar alertas de éxito después de 2 segundos
  if (tipo === 'success') {
    setTimeout(cerrarAlerta, 2000);
  }
}

function cerrarAlerta() {
  const alerta = document.getElementById('modal-alerta');
  if (alerta) {
    alerta.remove();
  }
}

// ===== RESTO DE TUS FUNCIONES ORIGINALES (sin cambios) =====
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
      // Si es el select de tipo-contrato, también limpiar su contenido
      if (id === 'tipo-contrato') {
        select.innerHTML = '<option value="">Seleccionar contrato</option>';
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
  
  // Resetear textareas
  const textareaOtros = document.getElementById('descripcion-otros');
  if (textareaOtros) textareaOtros.value = '';
  
  // ✅ RESETEAR CAMPOS DEL MODAL DE DATOS Y RESTAURAR ESTILOS
  const nombreCliente = document.getElementById('nombre-cliente');
  if (nombreCliente) {
    nombreCliente.value = '';
    nombreCliente.style.borderColor = '';
    nombreCliente.style.backgroundColor = '';
  }
  
  const telefonoCliente = document.getElementById('telefono-cliente');
  if (telefonoCliente) {
    telefonoCliente.value = '';
    telefonoCliente.style.borderColor = '';
    telefonoCliente.style.backgroundColor = '';
  }
  
  const correoCliente = document.getElementById('correo-cliente');
  if (correoCliente) {
    correoCliente.value = '';
    correoCliente.style.borderColor = '';
    correoCliente.style.backgroundColor = '';
  }
  
  // Ocultar todas las opciones
  ocultarElementos([
    'virtual-options', 'ciudad-options', 'capacidad-options', 
    'espacios-options', 'reserva-options', 'tiempo-options',
    'contrato-options', 'otros-descripcion'
  ]);
  
  // Resetear solicitud actual
  solicitudActual = {};
  
  updateButtonState();
  updateOtrosButtonState();
}

// ✅ FUNCIONES PARA COMPATIBILIDAD (si las necesitas)
function mostrarResumen() {
  // Esta función se puede mantener para compatibilidad
  // pero ahora usamos validarYEnviar() directamente
  console.log('ℹ️ mostrarResumen() - usando nuevo flujo directo');
}

function enviarSolicitudFinal() {
  // Esta función se puede mantener para compatibilidad
  // pero ahora usamos validarYEnviar()
  validarYEnviar();
}

// ✅ INICIALIZACIÓN FINAL
// Si el DOM ya está cargado cuando se ejecuta el script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCotizador);
} else {
  // DOM ya está listo
  setTimeout(initializeCotizador, 100);
}

// Hacer la función global para poder llamarla desde el fetch
window.initializeCotizadorFromFetch = initializeCotizador;

// ✅ FUNCIÓN PARA MANEJAR FORMULARIO DE CONTACTO CON LOADING
function manejarFormularioContacto() {
  const formContacto = document.getElementById('contactForm');
  if (!formContacto) {
    console.log('ℹ️ Formulario de contacto no encontrado en esta página');
    return;
  }
  
  console.log('✅ Configurando formulario de contacto con loading...');
  
  formContacto.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('📝 Formulario de contacto enviado');
    
    const submitBtn = formContacto.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    // ✅ PREVENIR MÚLTIPLES ENVÍOS
    if (submitBtn.disabled) {
      console.log('⚠️ Envío ya en proceso, ignorando...');
      return;
    }
    
    // ✅ CONFIGURAR LOADING
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviando...';
    
    // ✅ PROCESAR FORMULARIO ORIGINAL (tu código existente)
    setTimeout(() => {
      // Aquí va el código original del formulario de contacto
      // Por ahora simularemos el envío
      console.log('📤 Procesando formulario de contacto...');
      
      // Restaurar botón después de procesar
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        console.log('✅ Formulario de contacto procesado');
      }, 2000);
    }, 100);
  });
}

console.log('✅ EasyOffice Cotizador v3.0 cargado exitosamente');