 // Variables globales para el carrusel
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        
        document.addEventListener('DOMContentLoaded', function() {
            // Efectos interactivos mejorados en las tarjetas
            const cards = document.querySelectorAll('.company-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-12px) scale(1.03)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Configurar carrusel interactivo
            const carouselContainer = document.getElementById('carouselContainer');
            const carouselTrack = document.getElementById('carouselTrack');
            
            if (carouselContainer && carouselTrack) {
                // Detener animación CSS y usar JavaScript para control manual
                carouselTrack.style.animation = 'none';
                
                // Variables para el desplazamiento
                let currentX = 0;
                let targetX = 0;
                let isAnimating = false;
                
                // Función de animación suave
                function animate() {
                    if (Math.abs(targetX - currentX) > 0.1) {
                        currentX += (targetX - currentX) * 0.1;
                        carouselTrack.style.transform = `translateX(${currentX}px)`;
                        requestAnimationFrame(animate);
                    } else {
                        currentX = targetX;
                        carouselTrack.style.transform = `translateX(${currentX}px)`;
                        isAnimating = false;
                    }
                }
                
                // Auto-scroll
                function autoScroll() {
                    if (!isDragging) {
                        targetX -= 1;
                        if (targetX < -2000) { // Reset cuando llegue al final
                            targetX = 0;
                            currentX = 0;
                        }
                        if (!isAnimating) {
                            isAnimating = true;
                            animate();
                        }
                    }
                }
                
                // Iniciar auto-scroll
                setInterval(autoScroll, 50);
                
                // Eventos de mouse
                carouselContainer.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    startX = e.pageX;
                    scrollLeft = currentX;
                    carouselContainer.style.cursor = 'grabbing';
                    e.preventDefault();
                });
                
                carouselContainer.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    const x = e.pageX;
                    const walk = (x - startX) * 2;
                    targetX = scrollLeft + walk;
                    if (!isAnimating) {
                        isAnimating = true;
                        animate();
                    }
                });
                
                carouselContainer.addEventListener('mouseup', () => {
                    isDragging = false;
                    carouselContainer.style.cursor = 'grab';
                });
                
                carouselContainer.addEventListener('mouseleave', () => {
                    isDragging = false;
                    carouselContainer.style.cursor = 'grab';
                });
                
                // Eventos táctiles
                carouselContainer.addEventListener('touchstart', (e) => {
                    isDragging = true;
                    startX = e.touches[0].pageX;
                    scrollLeft = currentX;
                    e.preventDefault();
                });
                
                carouselContainer.addEventListener('touchmove', (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    const x = e.touches[0].pageX;
                    const walk = (x - startX) * 2;
                    targetX = scrollLeft + walk;
                    if (!isAnimating) {
                        isAnimating = true;
                        animate();
                    }
                });
                
                carouselContainer.addEventListener('touchend', () => {
                    isDragging = false;
                });
                
                // Prevenir selección de texto
                carouselContainer.addEventListener('selectstart', (e) => {
                    e.preventDefault();
                });
            }

            // Efecto de entrada escalonada mejorado
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1
            });

            // Observar elementos para animaciones
            document.querySelectorAll('.company-card').forEach(card => {
                observer.observe(card);
            });

            console.log('✨ Sección de empresas afiliadas cargada con controles táctiles funcionales');
        });

        // Prevenir el comportamiento de arrastre de imágenes
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.carousel-logo img').forEach(img => {
                img.addEventListener('dragstart', e => e.preventDefault());
            });
        });