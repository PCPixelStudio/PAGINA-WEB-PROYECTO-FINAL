// ==========================================
// PC PIXEL STUDIO — SCRIPT PRINCIPAL WEB
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------
    // 1. MENÚ MÓVIL (HAMBURGUESA)
    // --------------------------------------
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-links');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --------------------------------------
    // 2. EFECTO NAVBAR AL HACER SCROLL
    // --------------------------------------
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.8)';
                navbar.style.borderBottomColor = 'rgba(0, 210, 255, 0.6)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.borderBottomColor = 'var(--border)';
            }
        });
    }

    // --------------------------------------
    // 3. INTERACTIVO DOS MUNDOS (NIL / VOLT + TECLA Q)
    // --------------------------------------
    const worldToggle = document.getElementById('world-toggle');
    const worldStatus = document.getElementById('world-status');
    const worldBosque = document.querySelector('.world-bosque');
    const worldCuevas = document.querySelector('.world-cuevas');
    let controllingVolt = false;

    function switchWorld(forceVolt = null) {
        if (!worldToggle || !worldBosque || !worldCuevas) return;
        controllingVolt = forceVolt !== null ? forceVolt : !controllingVolt;

        worldBosque.classList.toggle('is-active', !controllingVolt);
        worldCuevas.classList.toggle('is-active', controllingVolt);
        worldToggle.setAttribute('aria-pressed', controllingVolt);

        if (controllingVolt) {
            worldToggle.innerHTML = '<span class="key" aria-hidden="true">Q</span> Cambiar a Nil';
            if (worldStatus) worldStatus.innerHTML = 'Ahora controlas a <strong>Volt</strong>';
        } else {
            worldToggle.innerHTML = '<span class="key" aria-hidden="true">Q</span> Cambiar a Volt';
            if (worldStatus) worldStatus.innerHTML = 'Ahora controlas a <strong>Nil</strong>';
        }
    }

    if (worldToggle) {
        worldToggle.addEventListener('click', () => switchWorld());
        worldBosque.addEventListener('click', () => switchWorld(false));
        worldCuevas.addEventListener('click', () => switchWorld(true));

        document.addEventListener('keydown', (e) => {
            if ((e.key === 'q' || e.key === 'Q') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                switchWorld();
            }
        });
    }

    // --------------------------------------
    // 4. VISOR DE CAPTURAS (LIGHTBOX)
    // --------------------------------------
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lbImg = lightbox.querySelector('img');
        const lbCaption = lightbox.querySelector('p');
        const lbClose = lightbox.querySelector('.lightbox-close');

        document.querySelectorAll('.gallery button[data-full]').forEach(btn => {
            btn.addEventListener('click', () => {
                const img = btn.querySelector('img');
                const caption = btn.parentElement.querySelector('figcaption');
                lbImg.src = btn.getAttribute('data-full');
                lbImg.alt = img ? img.alt : '';
                lbCaption.textContent = caption ? caption.textContent : '';
                lightbox.classList.add('is-open');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lbImg.src = '';
        };

        lbClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
        });
    }

    // --------------------------------------
    // 5. ANIMACIÓN DE APARICIÓN (REVEAL)
    // --------------------------------------
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // --------------------------------------
    // 6. ANOMALÍA DIMENSIONAL (CANVAS PARTÍCULAS)
    // --------------------------------------
    const canvas = document.getElementById('anomaly-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];

        function resizeCanvas() {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.7;
                this.speedY = (Math.random() - 0.5) * 0.7;
                this.color = Math.random() > 0.5 ? '#00d2ff' : '#9d4edd';
                this.opacity = Math.random();
                this.fadeSpeed = Math.random() * 0.02 + 0.005;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 1 || this.opacity <= 0.2) this.fadeSpeed = -this.fadeSpeed;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.abs(this.opacity);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fillRect(this.x, this.y, this.size, this.size);
                ctx.restore();
            }
        }

        for (let i = 0; i < 65; i++) particlesArray.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }
});