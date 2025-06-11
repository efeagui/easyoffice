(function() {
    'use strict';
    
    // ===== CONFIGURACIÓN EASYOFFICE =====
    const EASYOFFICE_CONFIG = {
        phone: '50432777777', // ✅ TU NÚMERO AQUÍ
        message: 'Hola estimado cliente, gracias por contactar nuestros servicios de Easyoffice. En un momento te atenderemos.',
        companyName: 'EasyOffice',
        autoShow: true,
        showNotification: true,
        position: 'right' // right, left, bottom-right, bottom-left
    };

    // ===== DETECTAR MÓVIL =====
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    // ===== CREAR HTML DEL WIDGET =====
    function createWidgetHTML() {
        return `
            <div id="easyoffice-whatsapp-widget" class="easyoffice-whatsapp-widget">
                <!-- Botón principal flotante -->
                <div class="easyoffice-whatsapp-button" id="easyoffice-whatsapp-btn">
                    <div class="easyoffice-whatsapp-icon">
                        <i class="fab fa-whatsapp"></i>
                    </div>
                    <div class="easyoffice-notification-badge" id="easyoffice-notification-badge">1</div>
                    <div class="easyoffice-pulse-ring"></div>
                </div>

                <!-- Chat popup -->
                <div class="easyoffice-whatsapp-chat" id="easyoffice-whatsapp-chat">
                    <div class="easyoffice-chat-header">
                        <div class="easyoffice-agent-info">
                            <div class="easyoffice-agent-avatar">
                                <i class="fas fa-user-tie"></i>
                            </div>
                            <div class="easyoffice-agent-details">
                                <h4>${EASYOFFICE_CONFIG.companyName} Team</h4>
                                <span class="easyoffice-status">
                                    <span class="easyoffice-status-dot"></span>
                                    En línea - Respuesta rápida
                                </span>
                            </div>
                        </div>
                        <button class="easyoffice-close-chat" id="easyoffice-close-chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="easyoffice-chat-body">
                        <div class="easyoffice-message easyoffice-agent-message">
                            <div class="easyoffice-message-avatar">
                                <i class="fas fa-user-tie"></i>
                            </div>
                            <div class="easyoffice-message-content">
                                <p>¡Hola! 👋 Bienvenido a <strong>${EASYOFFICE_CONFIG.companyName}</strong></p>
                                <p>¿En qué podemos ayudarte hoy?</p>
                                <span class="easyoffice-message-time">Ahora</span>
                            </div>
                        </div>

                        <!-- Opciones rápidas -->
                        <div class="easyoffice-quick-options">
                            <button class="easyoffice-quick-option" data-message="Quiero información sobre oficinas privadas en Tegucigalpa">
                                🏢 Oficinas Privadas TGU
                            </button>
                            <button class="easyoffice-quick-option" data-message="Me interesa información sobre oficinas privadas en San Pedro Sula">
                                🏢 Oficinas Privadas SPS
                            </button>
                            <button class="easyoffice-quick-option" data-message="Me interesa el coworking">
                                👥 Coworking
                            </button>
                            <button class="easyoffice-quick-option" data-message="Necesito una sala de juntas">
                                🤝 Salas de Juntas
                            </button>
                            <button class="easyoffice-quick-option" data-message="Quiero información sobre oficina virtual">
                                💻 Oficina Virtual
                            </button>
                            <button class="easyoffice-quick-option" data-message="Quiero hablar con un asesor ahora">
                                💬 Hablar con asesor de Easy Ofice
                            </button>
                        </div>
                    </div>

                    <div class="easyoffice-chat-footer">
                        <div class="easyoffice-input-area">
                            <input type="text" id="easyoffice-message-input" placeholder="Escribe tu mensaje..." maxlength="100">
                            <button class="easyoffice-send-button" id="easyoffice-send-button">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="easyoffice-powered-by">
                            <small>💬 Respuesta garantizada en 5 minutos</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== CREAR CSS DEL WIDGET =====
    function createWidgetCSS() {
        const css = `
            <style id="easyoffice-whatsapp-styles">
            /* ===== EASYOFFICE WHATSAPP WIDGET 2025 ===== */
            :root {
                --easyoffice-whatsapp-green: #25d366;
                --easyoffice-whatsapp-dark: #128c7e;
                --easyoffice-shadow-light: rgba(37, 211, 102, 0.3);
                --easyoffice-shadow-dark: rgba(0, 0, 0, 0.15);
                --easyoffice-border-radius: 20px;
                --easyoffice-animation-speed: 0.3s;
            }

            .easyoffice-whatsapp-widget {
                position: fixed;
                bottom: 80px; /* Arriba de la flecha de subir */
                right: 20px;
                z-index: 999998; /* Menor que modales pero mayor que contenido */
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                user-select: none;
            }

            .easyoffice-whatsapp-button {
                position: relative;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, var(--easyoffice-whatsapp-green), var(--easyoffice-whatsapp-dark));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 8px 30px var(--easyoffice-shadow-light);
                transition: all var(--easyoffice-animation-speed) cubic-bezier(0.4, 0, 0.2, 1);
                animation: easyoffice-breathe 3s ease-in-out infinite;
            }

            .easyoffice-whatsapp-button:hover {
                transform: scale(1.1) translateY(-2px);
                box-shadow: 0 12px 40px var(--easyoffice-shadow-light);
            }

            .easyoffice-whatsapp-icon {
                color: white;
                font-size: 28px;
                transition: transform var(--easyoffice-animation-speed) ease;
            }

            .easyoffice-whatsapp-button:hover .easyoffice-whatsapp-icon {
                transform: scale(1.1) rotate(5deg);
            }

            .easyoffice-notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4444;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                animation: easyoffice-bounce 2s infinite;
                border: 2px solid white;
            }

            .easyoffice-pulse-ring {
                position: absolute;
                width: 60px;
                height: 60px;
                border: 3px solid var(--easyoffice-whatsapp-green);
                border-radius: 50%;
                animation: easyoffice-pulse 2s infinite;
                opacity: 0;
            }

            .easyoffice-whatsapp-chat {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                max-height: 500px;
                background: white;
                border-radius: var(--easyoffice-border-radius);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px) scale(0.9);
                transition: all var(--easyoffice-animation-speed) cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
                border: 1px solid #e0e0e0;
            }

            .easyoffice-whatsapp-chat.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }

            .easyoffice-chat-header {
                background: linear-gradient(135deg, var(--easyoffice-whatsapp-green), var(--easyoffice-whatsapp-dark));
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: white;
            }

            .easyoffice-agent-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .easyoffice-agent-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }

            .easyoffice-agent-details h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .easyoffice-status {
                font-size: 12px;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .easyoffice-status-dot {
                width: 8px;
                height: 8px;
                background: #4ade80;
                border-radius: 50%;
                animation: easyoffice-blink 2s infinite;
            }

            .easyoffice-close-chat {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background var(--easyoffice-animation-speed) ease;
            }

            .easyoffice-close-chat:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .easyoffice-chat-body {
                padding: 20px;
                max-height: 300px;
                overflow-y: auto;
            }

            .easyoffice-message {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                animation: easyoffice-slideInMessage 0.5s ease-out;
            }

            .easyoffice-message-avatar {
                width: 32px;
                height: 32px;
                background: var(--easyoffice-whatsapp-green);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                flex-shrink: 0;
            }

            .easyoffice-message-content {
                background: #f0f0f0;
                padding: 12px 15px;
                border-radius: 18px;
                border-bottom-left-radius: 4px;
                max-width: 250px;
                position: relative;
            }

            .easyoffice-message-content p {
                margin: 0 0 5px 0;
                font-size: 14px;
                line-height: 1.4;
                color: #333;
            }

            .easyoffice-message-time {
                font-size: 11px;
                color: #666;
                opacity: 0.7;
            }

            .easyoffice-quick-options {
                margin-top: 15px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .easyoffice-quick-option {
                background: white;
                border: 2px solid var(--easyoffice-whatsapp-green);
                color: var(--easyoffice-whatsapp-green);
                padding: 10px 15px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all var(--easyoffice-animation-speed) ease;
                text-align: left;
            }

            .easyoffice-quick-option:hover {
                background: var(--easyoffice-whatsapp-green);
                color: white;
                transform: translateX(5px);
            }

            .easyoffice-chat-footer {
                padding: 15px 20px;
                border-top: 1px solid #f0f0f0;
                background: #fafafa;
            }

            .easyoffice-input-area {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            #easyoffice-message-input {
                flex: 1;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 25px;
                outline: none;
                font-size: 14px;
                transition: border-color var(--easyoffice-animation-speed) ease;
            }

            #easyoffice-message-input:focus {
                border-color: var(--easyoffice-whatsapp-green);
            }

            .easyoffice-send-button {
                width: 45px;
                height: 45px;
                background: var(--easyoffice-whatsapp-green);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                transition: all var(--easyoffice-animation-speed) ease;
            }

            .easyoffice-send-button:hover {
                background: var(--easyoffice-whatsapp-dark);
                transform: scale(1.1);
            }

            .easyoffice-powered-by {
                text-align: center;
                margin-top: 10px;
                color: #666;
            }

            /* ===== ANIMACIONES ===== */
            @keyframes easyoffice-breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes easyoffice-pulse {
                0% { transform: scale(0.8); opacity: 1; }
                100% { transform: scale(2); opacity: 0; }
            }

            @keyframes easyoffice-bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-5px); }
                60% { transform: translateY(-3px); }
            }

            @keyframes easyoffice-blink {
                0%, 50%, 100% { opacity: 1; }
                25%, 75% { opacity: 0.5; }
            }

            @keyframes easyoffice-slideInMessage {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* ===== RESPONSIVE ===== */
            @media (max-width: 480px) {
                .easyoffice-whatsapp-widget {
                    bottom: 70px;
                    right: 15px;
                }
                
                .easyoffice-whatsapp-chat {
                    width: calc(100vw - 30px);
                    bottom: 75px;
                    right: -15px;
                }
                
                .easyoffice-whatsapp-button {
                    width: 55px;
                    height: 55px;
                }
                
                .easyoffice-whatsapp-icon {
                    font-size: 24px;
                }
            }

            /* ===== TEMA OSCURO ===== */
            @media (prefers-color-scheme: dark) {
                .easyoffice-whatsapp-chat {
                    background: #2a2a2a;
                    border-color: #444;
                }
                
                .easyoffice-message-content {
                    background: #3a3a3a;
                    color: #fff;
                }
                
                .easyoffice-chat-footer {
                    background: #333;
                    border-color: #444;
                }
                
                #easyoffice-message-input {
                    background: #444;
                    color: #fff;
                    border-color: #555;
                }
            }
            </style>
        `;
        return css;
    }

    // ===== CLASE PRINCIPAL DEL WIDGET =====
    class EasyOfficeWhatsAppWidget {
        constructor() {
            this.isOpen = false;
            this.isMobile = isMobile();
            this.init();
        }
        
        init() {
            this.injectWidget();
            this.bindEvents();
            this.setupAutoShow();
        }
        
        injectWidget() {
            // Inyectar CSS
            document.head.insertAdjacentHTML('beforeend', createWidgetCSS());
            
            // Inyectar HTML
            document.body.insertAdjacentHTML('beforeend', createWidgetHTML());
        }
        
        bindEvents() {
            const whatsappBtn = document.getElementById('easyoffice-whatsapp-btn');
            const closeChat = document.getElementById('easyoffice-close-chat');
            const sendButton = document.getElementById('easyoffice-send-button');
            const messageInput = document.getElementById('easyoffice-message-input');
            const quickOptions = document.querySelectorAll('.easyoffice-quick-option');
            
            if (!whatsappBtn) return;
            
            whatsappBtn.addEventListener('click', () => this.toggleChat());
            closeChat?.addEventListener('click', () => this.closeChat());
            sendButton?.addEventListener('click', () => this.sendMessage());
            messageInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
            
            quickOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const message = option.getAttribute('data-message');
                    this.openWhatsApp(message);
                });
            });
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.easyoffice-whatsapp-widget')) {
                    this.closeChat();
                }
            });
        }
        
        toggleChat() {
            this.isOpen ? this.closeChat() : this.openChat();
        }
        
        openChat() {
            const chat = document.getElementById('easyoffice-whatsapp-chat');
            const badge = document.getElementById('easyoffice-notification-badge');
            
            chat?.classList.add('active');
            if (badge) badge.style.display = 'none';
            this.isOpen = true;
            
            setTimeout(() => {
                document.getElementById('easyoffice-message-input')?.focus();
            }, 300);
        }
        
        closeChat() {
            const chat = document.getElementById('easyoffice-whatsapp-chat');
            chat?.classList.remove('active');
            this.isOpen = false;
        }
        
        sendMessage() {
            const input = document.getElementById('easyoffice-message-input');
            const message = input?.value.trim();
            
            if (message) {
                this.openWhatsApp(message);
                if (input) input.value = '';
            }
        }
        
        openWhatsApp(message = EASYOFFICE_CONFIG.message) {
            const encodedMessage = encodeURIComponent(message);
            let url;
            
            if (this.isMobile) {
                url = `whatsapp://send?phone=${EASYOFFICE_CONFIG.phone}&text=${encodedMessage}`;
            } else {
                url = `https://web.whatsapp.com/send?phone=${EASYOFFICE_CONFIG.phone}&text=${encodedMessage}`;
            }
            
            window.open(url, '_blank');
            setTimeout(() => this.closeChat(), 500);
        }
        
        setupAutoShow() {
            if (EASYOFFICE_CONFIG.autoShow) {
                setTimeout(() => this.showNotification(), 3000);
            }
        }
        
        showNotification() {
            const badge = document.getElementById('easyoffice-notification-badge');
            const button = document.getElementById('easyoffice-whatsapp-btn');
            
            if (badge) badge.style.display = 'flex';
            if (button) button.style.animation = 'easyoffice-bounce 0.5s ease-in-out 3';
        }
    }

    // ===== INICIALIZAR CUANDO EL DOM ESTÉ LISTO =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new EasyOfficeWhatsAppWidget());
    } else {
        new EasyOfficeWhatsAppWidget();
    }

    // ===== API GLOBAL PARA CONTROLAR EL WIDGET =====
    window.EasyOfficeWhatsApp = {
        show: () => document.querySelector('.easyoffice-whatsapp-widget').style.display = 'block',
        hide: () => document.querySelector('.easyoffice-whatsapp-widget').style.display = 'none',
        config: EASYOFFICE_CONFIG
    };

})();
