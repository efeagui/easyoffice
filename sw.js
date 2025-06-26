// ===== SERVICE WORKER ULTIMATE EASYOFFICE PWA =====
// 🚀 VERSIÓN: 2.0.1 - ULTRA OPTIMIZADO
const CACHE_NAME = 'easyoffice-v2.0.1';
const OFFLINE_URL = '/offline.html';
const FALLBACK_IMAGE = '/assets/img/logo/fallback.png';

// 📦 ARCHIVOS CRÍTICOS (SE CACHEAN INMEDIATAMENTE)
const CRITICAL_CACHE = [
  './',                    
  './header.html',         
  './footer.html',
  './index.html',
  './contact.html',
  './offline.html',
  './manifest.json',
  './assets/css/main.css',
  './assets/js/main.js',
  './assets/img/logo/EasyOffice logo.png',
  './assets/img/logo/favicon_io/android-chrome-192x192.png',
  './assets/img/logo/favicon_io/android-chrome-512x512.png',
  './assets/img/logo/fallback.png'  
];

// 🎯 ARCHIVOS DE CONTENIDO (SE CACHEAN BAJO DEMANDA)
const CONTENT_CACHE = [
  '/oficinas-privadas.html',
  '/salas-juntas-tegucigalpa.html',
  '/coworking.html',
  '/oficina-virtual.html'
];

// 🖼️ RECURSOS ESTÁTICOS (IMÁGENES, FUENTES)
const STATIC_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.otf', '.css', '.js'];

// 📊 ANALYTICS Y TRACKING
let cacheHits = 0;
let cacheMisses = 0;
let offlineRequests = 0;

// ===== 🚀 INSTALACIÓN DEL SERVICE WORKER =====
self.addEventListener('install', (event) => {
  console.log('🚀 EasyOffice SW: INSTALANDO...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('📦 SW: Cacheando archivos críticos...');
        
        // CACHEAR ARCHIVOS CRÍTICOS CON TIMEOUT
        const cachePromises = CRITICAL_CACHE.map(async (url) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
            
            const response = await fetch(url, { 
              signal: controller.signal,
              cache: 'no-cache' 
            });
            clearTimeout(timeoutId);
            
            if (response.ok) {
              await cache.put(url, response);
              console.log(`✅ Cacheado: ${url}`);
            }
          } catch (error) {
            console.warn(`⚠️ Error cacheando ${url}:`, error);
          }
        });
        
        await Promise.allSettled(cachePromises);
        console.log('✅ SW: Instalación completada');
        
        // PRECACHE CONTENIDO EN BACKGROUND
        setTimeout(precacheContent, 2000);
        
      } catch (error) {
        console.error('❌ SW: Error en instalación:', error);
      }
    })()
  );
  
  // ACTIVAR INMEDIATAMENTE
  self.skipWaiting();
});

// ===== 🔄 ACTIVACIÓN DEL SERVICE WORKER =====
self.addEventListener('activate', (event) => {
  console.log('🔄 EasyOffice SW: ACTIVANDO...');
  
  event.waitUntil(
    (async () => {
      try {
        // LIMPIAR CACHES ANTIGUOS
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames
          .filter(name => name.startsWith('easyoffice-') && name !== CACHE_NAME)
          .map(name => {
            console.log(`🗑️ Eliminando cache antiguo: ${name}`);
            return caches.delete(name);
          });
        
        await Promise.all(deletePromises);
        
        // TOMAR CONTROL DE TODAS LAS PESTAÑAS
        await self.clients.claim();
        
        console.log('✅ SW: Activación completada');
        
        // NOTIFICAR A CLIENTES SOBRE ACTUALIZACIÓN
        broadcastMessage({ type: 'SW_ACTIVATED', version: CACHE_NAME });
        
      } catch (error) {
        console.error('❌ SW: Error en activación:', error);
      }
    })()
  );
});

// ===== 🌐 INTERCEPTAR REQUESTS (ESTRATEGIAS INTELIGENTES) =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // SOLO MANEJAR REQUESTS HTTP/HTTPS
  if (!request.url.startsWith('http')) return;
  
  // IGNORAR REQUESTS DE ANALYTICS/TRACKING EXTERNOS
  if (isAnalyticsRequest(url.hostname)) return;
  
  // ESTRATEGIA POR TIPO DE RECURSO
  if (isStaticAsset(request.url)) {
    // ARCHIVOS ESTÁTICOS: Cache First
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.destination === 'document') {
    // PÁGINAS HTML: Network First con fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (isAPIRequest(request.url)) {
    // APIs: Network Only con fallback
    event.respondWith(networkOnlyStrategy(request));
  } else {
    // OTROS: Stale While Revalidate
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// ===== 📊 ESTRATEGIAS DE CACHE OPTIMIZADAS =====

// 🎯 CACHE FIRST: Para archivos estáticos (CSS, JS, imágenes)
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      cacheHits++;
      return cachedResponse;
    }
    
    cacheMisses++;
    const networkResponse = await fetchWithTimeout(request, 8000);
    
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse || await getFallbackResponse(request);
    
  } catch (error) {
    console.warn('⚠️ Cache First falló:', error);
    return await getFallbackResponse(request);
  }
}

// 🌐 NETWORK FIRST: Para páginas HTML
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetchWithTimeout(request, 5000);
    
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    console.warn('⚠️ Network First falló, usando cache:', error);
    offlineRequests++;
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // FALLBACK A PÁGINA OFFLINE
    return await caches.match(OFFLINE_URL) || 
           new Response(generateOfflineHTML(), {
             headers: { 'Content-Type': 'text/html' }
           });
  }
}

// 🔄 STALE WHILE REVALIDATE: Para recursos dinámicos
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await caches.match(request);
  
  // ACTUALIZAR EN BACKGROUND
  const fetchPromise = fetchWithTimeout(request, 6000)
    .then(networkResponse => {
      if (networkResponse && networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);
  
  // DEVOLVER CACHE INMEDIATAMENTE O ESPERAR NETWORK
  return cachedResponse || await fetchPromise || await getFallbackResponse(request);
}

// 🚫 NETWORK ONLY: Para APIs críticas
async function networkOnlyStrategy(request) {
  try {
    return await fetchWithTimeout(request, 10000);
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Service unavailable', 
      offline: true,
      message: 'Revisa tu conexión a internet'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ===== 🛠️ UTILIDADES AVANZADAS =====

// FETCH CON TIMEOUT
async function fetchWithTimeout(request, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// DETECTAR ARCHIVOS ESTÁTICOS
function isStaticAsset(url) {
  return STATIC_EXTENSIONS.some(ext => url.includes(ext));
}

// DETECTAR REQUESTS DE ANALYTICS
function isAnalyticsRequest(hostname) {
  const analyticsHosts = [
    'google-analytics.com',
    'googletagmanager.com',
    'facebook.com',
    'doubleclick.net',
    'hotjar.com'
  ];
  return analyticsHosts.some(host => hostname.includes(host));
}

// DETECTAR API REQUESTS
function isAPIRequest(url) {
  return url.includes('/api/') || url.includes('/ajax/') || url.includes('.json');
}

// RESPUESTA FALLBACK INTELIGENTE
async function getFallbackResponse(request) {
  const url = new URL(request.url);
  
  if (request.destination === 'image') {
    return await caches.match(FALLBACK_IMAGE) || 
           new Response('', { status: 204 });
  }
  
  if (request.destination === 'document') {
    return await caches.match(OFFLINE_URL) ||
           new Response(generateOfflineHTML(), {
             headers: { 'Content-Type': 'text/html' }
           });
  }
  
  return new Response('Service Unavailable', { status: 503 });
}

// GENERAR HTML OFFLINE DINÁMICO
function generateOfflineHTML() {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EasyOffice - Sin conexión</title>
    <style>
        body { 
            font-family: -apple-system, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: #f5f5f5;
        }
        .offline-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
            margin: 0 auto;
        }
        .emoji { font-size: 4rem; margin-bottom: 20px; }
        h1 { color: #ff7b3d; margin-bottom: 20px; }
        button {
            background: #ff7b3d;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="emoji">📱</div>
        <h1>¡Ups! Sin conexión</h1>
        <p>No hay conexión a internet. Revisa tu WiFi o datos móviles.</p>
        <button onclick="window.location.reload()">🔄 Reintentar</button>
    </div>
</body>
</html>`;
}

// PRECACHE CONTENIDO EN BACKGROUND
async function precacheContent() {
  try {
    const cache = await caches.open(CACHE_NAME);
    console.log('🔄 Precacheando contenido...');
    
    const precachePromises = CONTENT_CACHE.map(async (url) => {
      try {
        if (!(await caches.match(url))) {
          const response = await fetchWithTimeout(url, 5000);
          if (response && response.ok) {
            await cache.put(url, response);
            console.log(`📄 Precacheado: ${url}`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Error precacheando ${url}:`, error);
      }
    });
    
    await Promise.allSettled(precachePromises);
    console.log('✅ Precache completado');
    
  } catch (error) {
    console.error('❌ Error en precache:', error);
  }
}

// BROADCAST MENSAJES A CLIENTES
function broadcastMessage(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

// ===== 🔔 NOTIFICACIONES PUSH AVANZADAS =====
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nueva notificación de EasyOffice',
      icon: '/assets/img/logo/favicon_io/android-chrome-192x192.png',
      badge: '/assets/img/logo/favicon_io/favicon-32x32.png',
      image: data.image || null,
      vibrate: [200, 100, 200, 100, 200],
      tag: 'easyoffice-' + Date.now(),
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: '👁️ Ver',
          icon: '/assets/img/icons/view.png'
        },
        {
          action: 'dismiss',
          title: '❌ Cerrar',
          icon: '/assets/img/icons/close.png'
        }
      ],
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'EasyOffice', options)
    );
    
  } catch (error) {
    console.error('❌ Error en push notification:', error);
  }
});

// MANEJAR CLICKS EN NOTIFICACIONES
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const url = event.notification.data?.url || '/';
  
  if (action === 'view' || !action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          // SI YA HAY UNA VENTANA ABIERTA, ENFOCARLA
          for (const client of clientList) {
            if (client.url.includes(url) && 'focus' in client) {
              return client.focus();
            }
          }
          // SI NO, ABRIR NUEVA VENTANA
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});

// ===== 📊 ANALYTICS Y REPORTING =====
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATS':
      event.ports[0].postMessage({
        cacheHits,
        cacheMisses,
        offlineRequests,
        version: CACHE_NAME
      });
      break;
      
    case 'CLEAR_CACHE':
      clearOldCaches();
      break;
      
    default:
      console.log('📧 SW: Mensaje recibido:', event.data);
  }
});

// LIMPIAR CACHES ANTIGUOS
async function clearOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames
      .filter(name => name !== CACHE_NAME)
      .map(name => caches.delete(name));
    
    await Promise.all(deletePromises);
    console.log('🗑️ Caches antiguos eliminados');
    
  } catch (error) {
    console.error('❌ Error limpiando caches:', error);
  }
}

// ===== 🔄 BACKGROUND SYNC =====
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background Sync activado');
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  try {
    // SINCRONIZAR FORMULARIOS PENDIENTES
    await syncPendingForms();
    
    // ACTUALIZAR CACHE CRÍTICO
    await updateCriticalCache();
    
    console.log('✅ Background Sync completado');
    
  } catch (error) {
    console.error('❌ Error en Background Sync:', error);
  }
}

// SINCRONIZAR FORMULARIOS PENDIENTES
async function syncPendingForms() {
  // AQUÍ PUEDES IMPLEMENTAR LÓGICA PARA ENVIAR 
  // FORMULARIOS QUE SE GUARDARON MIENTRAS ESTABA OFFLINE
  console.log('📝 Sincronizando formularios pendientes...');
}

// ACTUALIZAR CACHE CRÍTICO
async function updateCriticalCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    for (const url of CRITICAL_CACHE) {
      try {
        const response = await fetchWithTimeout(url, 5000);
        if (response && response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.warn(`⚠️ Error actualizando ${url}:`, error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error actualizando cache:', error);
  }
}

// ===== 🚀 INICIALIZACIÓN =====
console.log('🚀 EasyOffice Service Worker v2.0.1 CARGADO');
console.log('📊 Cache Name:', CACHE_NAME);
console.log('📱 Funcionalidades: Cache Strategies, Push Notifications, Background Sync, Offline Support');