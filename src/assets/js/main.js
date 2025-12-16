document.addEventListener('DOMContentLoaded', () => {
    
    /* ==============================================
       1. HEADER DINÁMICO (Sticky Effect)
       ============================================== */
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==============================================
       2. MENÚ MÓVIL
       ============================================== */
    const toggleBtn = document.querySelector('.mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const body = document.body;

    function toggleMenu() {
        const isActive = mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
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
       3. ANIMACIONES SCROLL AVANZADAS (Observer)
       ============================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealOptions = {
            threshold: 0.15, // Se activa al ver el 15% del elemento
            rootMargin: "0px 0px -50px 0px"
        };

        const revealOnScroll = new IntersectionObserver((entries, revealOnScroll) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('active');
                    
                    // Si es el contador, arrancar animación
                    if (entry.target.querySelector('#record-counter')) {
                        animateCounter();
                    }
                    
                    // Dejar de observar una vez animado
                    revealOnScroll.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealOnScroll.observe(el);
        });
    }

    /* ==============================================
       4. CONTADOR DE NÚMEROS
       ============================================== */
    let counterPlayed = false;

    function animateCounter() {
        if (counterPlayed) return;
        
        const counter = document.getElementById('record-counter');
        if (!counter) return;

        counterPlayed = true;
        counter.style.opacity = '1';

        const target = 1294; // Récord
        const duration = 2000;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        const increment = target / totalFrames;
        
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = target.toLocaleString('es-ES');
                clearInterval(timer);
            } else {
                counter.innerText = Math.ceil(current).toLocaleString('es-ES');
            }
        }, frameDuration);
    }

    /* ==============================================
       5. MODAL PATROCINADORES (Solo si existe)
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
            modalElements.logo.src = item.dataset.logo;
            modalElements.title.innerText = item.dataset.name;
            modalElements.desc.innerHTML = item.querySelector('.hidden-desc').innerHTML;
            modalElements.link.href = item.dataset.link;

            const insta = item.dataset.insta;
            const linkedin = item.dataset.linkedin;

            modalElements.insta.style.display = insta ? 'inline-flex' : 'none';
            if (insta) modalElements.insta.href = insta;

            modalElements.linkedin.style.display = linkedin ? 'inline-flex' : 'none';
            if (linkedin) modalElements.linkedin.href = linkedin;

            modal.classList.add('active');
            body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            body.style.overflow = '';
        }

        triggers.forEach((item, index) => {
            item.setAttribute('data-index', index);
            item.addEventListener('click', () => openModal(index));
        });

        document.querySelector('.modal-close')?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

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
       6. FIX: PRECARGA IMAGEN HISTORIA
       ============================================== */
    if (document.querySelector('.history-hero')) {
        const bgImageSrc = 'assets/img/logo_upv_ecomarathon3.png';
        const imgLoader = new Image();
        imgLoader.src = bgImageSrc;
        imgLoader.onload = () => { console.log("Imagen de fondo cargada"); };
    }
    
    /* ==============================================
       7. SCROLL NAVEGACIÓN AÑOS
       ============================================== */
    const yearLinks = document.querySelectorAll('.year-nav a');
    if (yearLinks.length > 0) {
        let isManualScrolling = false;
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
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    setTimeout(() => { isManualScrolling = false; }, 1000);
                }
            });
        });
    }

    /* ==============================================
       8. VALIDACIÓN DE FORMULARIO
       ============================================== */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
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

            if (!isValid) {
                e.preventDefault();
            } else {
                const btn = contactForm.querySelector('button');
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
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

    /* ==============================================
       9. GESTIÓN DE COOKIES (FLOTANTE)
       ============================================== */
    (function initCookieConsent() {
        const cookieModal = document.getElementById('cookie-consent');
        const acceptBtn = document.getElementById('btn-accept-cookies');
        const rejectBtn = document.getElementById('btn-reject-cookies');
        const closeBtn = document.getElementById('btn-close-cookies');
        const COOKIE_NAME = 'upv_consent_status';

        const consent = localStorage.getItem(COOKIE_NAME);

        if (!consent) {
            setTimeout(() => {
                if(cookieModal) {
                    cookieModal.style.display = 'block';
                    setTimeout(() => cookieModal.classList.add('show'), 10);
                }
            }, 2000);
        }

        function closeCookieModal() {
            if(!cookieModal) return;
            cookieModal.classList.remove('show');
            setTimeout(() => {
                cookieModal.style.display = 'none';
            }, 500);
        }

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem(COOKIE_NAME, 'accepted');
                closeCookieModal();
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                localStorage.setItem(COOKIE_NAME, 'rejected');
                closeCookieModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeCookieModal();
            });
        }
    })();

    

});

