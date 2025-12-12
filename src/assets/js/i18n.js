// i18n.js ACTUALIZADO
(function() {
    // 1. Configuración de Idiomas
    const defaultLang = 'es';
    const supportedLangs = ['es', 'en', 'fr', 'de'];
    const flags = { 'es': '🇪🇸', 'en': '🇬🇧', 'fr': '🇫🇷', 'de': '🇩🇪' };

    // 2. Detectar idioma (localStorage > navegador > default)
    let currentLang = localStorage.getItem('upv-lang') || navigator.language.slice(0, 2);
    if (!supportedLangs.includes(currentLang)) currentLang = defaultLang;

    // 3. Función de Carga (Síncrona para evitar parpadeo)
    async function loadLanguage(lang) {
        try {
            const response = await fetch(`assets/lang/${lang}.json`);
            if (!response.ok) throw new Error("Idioma no encontrado");
            const translations = await response.json();
            
            applyTranslations(translations);
            updateSelectors(lang);
            
            document.documentElement.lang = lang;
            localStorage.setItem('upv-lang', lang);
        } catch (error) {
            console.error("Error cargando idioma:", error);
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
        // Actualizar selector de escritorio
        const currentFlag = document.getElementById('current-flag');
        const currentLangCode = document.getElementById('current-lang-code');
        if (currentFlag) currentFlag.textContent = flags[lang];
        if (currentLangCode) currentLangCode.textContent = lang.toUpperCase();

        // Actualizar selectores móviles (radio buttons o similar si usamos)
        const mobileSelect = document.getElementById('mobile-lang-select');
        if (mobileSelect) mobileSelect.value = lang;
    }

    // 4. Exponer función global para cambiar idioma
    window.changeLanguage = (lang) => {
        loadLanguage(lang);
        // Cerrar menú móvil si está abierto al cambiar idioma
        document.querySelector('.mobile-nav-menu')?.classList.remove('active');
        document.querySelector('.mobile-nav-overlay')?.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // 5. Iniciar carga
    document.addEventListener('DOMContentLoaded', () => {
        // Eventos para el dropdown de escritorio
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', () => changeLanguage(opt.dataset.lang));
        });

        // Evento para el select móvil
        const mobileSelect = document.getElementById('mobile-lang-select');
        if(mobileSelect) {
            mobileSelect.addEventListener('change', (e) => changeLanguage(e.target.value));
            mobileSelect.value = currentLang;
        }

        loadLanguage(currentLang);
    });

    // Ejecutar una primera carga rápida si es posible (aunque fetch es asíncrono, ayuda)
    loadLanguage(currentLang);

})();