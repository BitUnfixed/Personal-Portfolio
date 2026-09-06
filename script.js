(function() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const progressBar = document.getElementById('scrollProgressBar');
    let ticking = false;
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateProgress);
        }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileLinks = document.querySelectorAll('.nav-mobile-menu a');
    function setActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) current = section.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
        mobileLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(() => { setActiveNav(); ticking = false; });
        }
    }, { passive: true });
    setActiveNav();

    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    }, { passive: true });
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    navToggle.addEventListener('click', () => {
        const open = navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('open')) {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    const typedTextElement = document.getElementById('typewriterText');
    if (typedTextElement) {
        const phrases = [
            'Programming',
            'Artificial Intelligence',
            'Software Development',
            'Game Development',
            'Cybersecurity',
            'Linux',
            'Open Source Technologies'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeTimeout;

        function typeWriter() {
            const currentPhrase = phrases[phraseIndex];
            if (!isDeleting) {
                charIndex++;
                typedTextElement.textContent = currentPhrase.substring(0, charIndex);
                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    typeTimeout = setTimeout(typeWriter, 2000);
                    return;
                }
            } else {
                charIndex--;
                typedTextElement.textContent = currentPhrase.substring(0, charIndex);
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typeTimeout = setTimeout(typeWriter, 400);
                    return;
                }
            }
            typeTimeout = setTimeout(typeWriter, isDeleting ? 35 : 60);
        }

        setTimeout(typeWriter, 500);
        window.addEventListener('beforeunload', () => {
            if (typeTimeout) clearTimeout(typeTimeout);
        });
    }
})();