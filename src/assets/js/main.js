document.addEventListener('DOMContentLoaded', () => {
    
    /* ==============================================
       1. MENÚ MÓVIL (Funciona en todas las páginas)
       ============================================== */
    const toggleBtn = document.querySelector('.mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const body = document.body;

    function toggleMenu() {
        const isActive = mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        // Bloquear scroll si el menú está abierto
        body.style.overflow = isActive ? 'hidden' : '';
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    }

    /* ==============================================
       2. ANIMACIONES SCROLL (Observer)
       ============================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Si el elemento revelado es el contador, iniciamos la animación
                    if (entry.target.querySelector('#record-counter')) {
                        animateCounter();
                    }
                }
            });
        }, { threshold: 0.15 }); // Se activa cuando se ve el 15% del elemento

        revealElements.forEach(el => observer.observe(el));
    }

    /* ==============================================
       3. CONTADOR DE NÚMEROS (Solo si existe)
       ============================================== */
    let counterPlayed = false;

    function animateCounter() {
        if (counterPlayed) return;
        
        const counter = document.getElementById('record-counter');
        if (!counter) return;

        counterPlayed = true;
        // Hacer visible el número
        counter.style.opacity = '1';

        const target = 1294; // Récord
        const duration = 2000; // 2 segundos
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        const increment = target / totalFrames;
        
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = target.toLocaleString('es-ES'); // Formato 1.294
                clearInterval(timer);
            } else {
                counter.innerText = Math.ceil(current).toLocaleString('es-ES');
            }
        }, frameDuration);
    }

    /* ==============================================
       4. MODAL PATROCINADORES (Solo en patrocinadores.html)
       ============================================== */
    const triggers = document.querySelectorAll('.sponsor-trigger');
    
    if (triggers.length > 0) {
        const modal = document.getElementById('sponsor-modal');
        const modalElements = {
            logo: document.getElementById('modal-logo'),
            title: document.getElementById('modal-title'),
            desc: document.getElementById('modal-desc'),
            link: document.getElementById('modal-link'),
            insta: document.getElementById('modal-insta'),
            linkedin: document.getElementById('modal-linkedin')
        };
        
        let currentIndex = 0;

        function openModal(index) {
            const item = document.querySelector(`.sponsor-trigger[data-index="${index}"]`);
            if (!item) return;

            currentIndex = index;
            
            // Rellenar datos
            modalElements.logo.src = item.dataset.logo;
            modalElements.title.innerText = item.dataset.name;
            // Truco: Leemos el texto oculto traducido
            modalElements.desc.innerHTML = item.querySelector('.hidden-desc').innerHTML;
            modalElements.link.href = item.dataset.link;

            // Redes sociales (mostrar solo si existen)
            const insta = item.dataset.insta;
            const linkedin = item.dataset.linkedin;

            modalElements.insta.style.display = insta ? 'inline-flex' : 'none';
            if (insta) modalElements.insta.href = insta;

            modalElements.linkedin.style.display = linkedin ? 'inline-flex' : 'none';
            if (linkedin) modalElements.linkedin.href = linkedin;

            modal.classList.add('active');
            body.style.overflow = 'hidden'; // Bloquear scroll fondo
        }

        function closeModal() {
            modal.classList.remove('active');
            body.style.overflow = '';
        }

        // Eventos Click en Logos
        triggers.forEach((item, index) => {
            item.setAttribute('data-index', index); // Asegurar índice
            item.addEventListener('click', () => openModal(index));
        });

        // Eventos Botones Modal
        document.querySelector('.modal-close')?.addEventListener('click', closeModal);
        
        // Click fuera para cerrar
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Navegación (Flechas)
        document.querySelector('.modal-nav.prev')?.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = triggers.length - 1;
            openModal(newIndex);
        });

        document.querySelector('.modal-nav.next')?.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= triggers.length) newIndex = 0;
            openModal(newIndex);
        });
    }

    /* ==============================================
       5. FIX: PRECARGA IMAGEN HISTORIA (Solo historia.html)
       ============================================== */
    // Si estamos en la página de historia, coordinar la carga
    if (document.querySelector('.history-hero')) {
        const bgImageSrc = 'assets/img/logo_upv_ecomarathon3.png';
        const imgLoader = new Image();
        imgLoader.src = bgImageSrc;
        
        // Intentar animar si la imagen ya cargó
        imgLoader.onload = () => {
            // La animación real la dispara el IntersectionObserver de arriba
            console.log("Imagen de fondo cargada");
        };
    }
    
    /* ==============================================
       6. SCROLL NAVEGACIÓN AÑOS (Solo historia.html)
       ============================================== */
    const yearLinks = document.querySelectorAll('.year-nav a');
    if (yearLinks.length > 0) {
        let isManualScrolling = false;

        // Observer para resaltar el año activo al hacer scroll
        const yearObserver = new IntersectionObserver((entries) => {
            if(isManualScrolling) return;
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    yearLinks.forEach(link => link.classList.remove('active'));
                    const id = entry.target.id;
                    const activeLink = document.querySelector(`.year-nav a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                }
            });
        }, { rootMargin: '-40% 0px -60% 0px' });

        document.querySelectorAll('.timeline-row').forEach(row => yearObserver.observe(row));

        // Click en los años
        yearLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                isManualScrolling = true;
                
                yearLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 180;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    setTimeout(() => { isManualScrolling = false; }, 1000);
                }
            });
        });
    }

    /* ==============================================
       7. VALIDACIÓN DE FORMULARIO (Contactanos)
       ============================================== */
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que se envíe de golpe
            
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            
            // Limpiar errores previos
            document.querySelectorAll('.error-msg').forEach(el => el.remove());
            inputs.forEach(input => input.style.borderColor = '');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    mostrarError(input, 'Este campo no puede estar vacío');
                } else if (input.type === 'email' && !validarEmail(input.value)) {
                    isValid = false;
                    mostrarError(input, 'Por favor, introduce un email válido');
                }
            });

            if (isValid) {
                // Aquí iría el código para enviar (ej: fetch o formspree)
                // Por ahora simulamos envío:
                const btn = contactForm.querySelector('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Enviado';
                btn.style.background = '#4CAF50';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = ''; // Volver al color original
                }, 3000);
            }
        });
    }

    function mostrarError(input, mensaje) {
        input.style.borderColor = '#ff4444';
        const msg = document.createElement('span');
        msg.className = 'error-msg';
        msg.style.color = '#ff4444';
        msg.style.fontSize = '0.8rem';
        msg.style.marginTop = '5px';
        msg.style.display = 'block';
        msg.innerText = mensaje;
        input.parentElement.appendChild(msg);
    }

    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }



});