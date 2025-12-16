(function() {
    // 1. Configuración
    const defaultLang = 'es';
    const supportedLangs = ['es', 'en', 'fr', 'de'];
    
    // MAPA DE IMÁGENES DE BANDERAS (Ya no usamos emojis)
    const flagUrls = { 
        'es': 'https://flagcdn.com/w40/es.png', 
        'en': 'https://flagcdn.com/w40/gb.png', 
        'fr': 'https://flagcdn.com/w40/fr.png', 
        'de': 'https://flagcdn.com/w40/de.png' 
    };

    // 2. Detectar idioma (Memoria > Navegador > Defecto)
    let currentLang = localStorage.getItem('upv-lang') || navigator.language.slice(0, 2);
    if (!supportedLangs.includes(currentLang)) currentLang = defaultLang;

    // 3. Función Principal de Carga
    async function loadLanguage(lang) {
        try {
            const response = await fetch(`assets/lang/${lang}.json`);
            if (!response.ok) throw new Error("Idioma no encontrado");
            
            const translations = await response.json();
            
            applyTranslations(translations);
            updateSelectors(lang);
            
            // Guardar configuración
            document.documentElement.lang = lang;
            localStorage.setItem('upv-lang', lang);

        } catch (error) {
            console.error("Error cargando idioma:", error);
        } finally {
            // 4. LEVANTAR LA CORTINA (Anti-Pestañeo)
            // Cuando todo está listo, añadimos la clase para que el CSS muestre la web
            document.body.classList.add('loaded');
        }
    }

    function applyTranslations(translations) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (translations[key].includes('<')) {
                    el.innerHTML = translations[key];
                } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[key];
                } else {
                    el.textContent = translations[key];
                }
            }
        });
    }

    function updateSelectors(lang) {
        // --- ESCRITORIO ---
        const currentFlag = document.getElementById('current-flag');
        const currentLangCode = document.getElementById('current-lang-code');
        
        // Aquí cambiamos la IMAGEN (src), no el texto
        if (currentFlag) {
            currentFlag.src = flagUrls[lang];
            currentFlag.alt = lang.toUpperCase();
        }
        
        if (currentLangCode) {
            currentLangCode.textContent = lang.toUpperCase();
        }

        // --- MÓVIL ---
        const mobileSelect = document.getElementById('mobile-lang-select');
        if (mobileSelect) mobileSelect.value = lang;
    }

    // Función global para cambiar idioma manualmente
    window.changeLanguage = (lang) => {
        // Ocultamos la web un momento para hacer el cambio suave
        document.body.classList.remove('loaded');
        
        loadLanguage(lang).then(() => {
            // Cerrar menú móvil si está abierto
            document.querySelector('.mobile-nav-menu')?.classList.remove('active');
            document.querySelector('.mobile-nav-overlay')?.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    };

    // Eventos
    document.addEventListener('DOMContentLoaded', () => {
        // Clics en el dropdown de escritorio
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', () => changeLanguage(opt.dataset.lang));
        });

        // Cambio en el select del móvil
        const mobileSelect = document.getElementById('mobile-lang-select');
        if(mobileSelect) {
            mobileSelect.addEventListener('change', (e) => changeLanguage(e.target.value));
            // Asegurar que el select marque el idioma actual al cargar
            mobileSelect.value = currentLang; 
        }
        
        // Iniciar la carga del idioma
        loadLanguage(currentLang);
    });

})();