// ============================================================
// QUIRÓS FOTÓGRAFOS — Main JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ── Page Loader ──────────────────────────────────────────
    const loader = document.getElementById('page-loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1400);
    });

    // ── Current Year ─────────────────────────────────────────
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Sticky Navbar ────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        // Active nav link highlight
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Mobile Menu ──────────────────────────────────────────
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');
    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
    });
    // Close on nav-link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('open');
        });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            menu.classList.remove('open');
            toggle.classList.remove('open');
        }
    });

    // ── Hero Slider ──────────────────────────────────────────
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let sliderTimer;

    const goToSlide = (idx) => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (idx + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const startTimer = () => {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
    };

    document.getElementById('slide-prev').addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        startTimer();
    });
    document.getElementById('slide-next').addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        startTimer();
    });
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); startTimer(); });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { goToSlide(currentSlide - 1); startTimer(); }
        if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); startTimer(); }
    });

    startTimer();

    // ── Gallery Filter ───────────────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gridItems = document.querySelectorAll('.grid-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            gridItems.forEach(item => {
                const matches = filter === 'all' || item.dataset.cat === filter;
                if (matches) {
                    item.classList.remove('hidden');
                    item.style.display = '';
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => item.style.display = 'none', 350);
                }
            });
        });
    });

    // ── Lightbox ─────────────────────────────────────────────
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `<button class="lightbox-close" id="lb-close"><ion-icon name="close-outline"></ion-icon></button><img class="lightbox-img" id="lb-img" src="" alt="">`;
    document.body.appendChild(lightbox);

    const lbImg = document.getElementById('lb-img');
    const lbClose = document.getElementById('lb-close');

    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.querySelector('img').src;
            const alt = item.querySelector('img').alt;
            lbImg.src = src; lbImg.alt = alt;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => lbImg.src = '', 300);
    };

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    // ── Reviews Carousel (scroll) ────────────────────────────
    const revCarousel = document.getElementById('reviews-carousel');
    const revPrev = document.getElementById('rev-prev');
    const revNext = document.getElementById('rev-next');

    if (revCarousel && revPrev && revNext) {
        // On mobile, display as horizontal scroll
        revPrev.addEventListener('click', () => {
            revCarousel.scrollBy({ left: -380, behavior: 'smooth' });
        });
        revNext.addEventListener('click', () => {
            revCarousel.scrollBy({ left: 380, behavior: 'smooth' });
        });
    }

    // ── Scroll Reveal ─────────────────────────────────────────
    const revealEls = document.querySelectorAll(
        '.service-card, .grid-item, .review-card, .about-badge, .insta-item, .contact-detail, .stat'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Also observe section headers
    document.querySelectorAll('.section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });
});

// ── Contact Form Handler ──────────────────────────────────
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = document.getElementById('form-submit');
    const successEl = document.getElementById('form-success');

    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const formData = new FormData(form);

    try {
        // Enviar datos usando FormSubmit (versión AJAX)
        // Por defecto usará info@quirosfotografos.com. ¡Requiere activación en el primer uso!
        const response = await fetch("https://formsubmit.co/ajax/info@quirosfotografos.com", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            btn.style.display = 'none';
            successEl.style.display = 'flex';
            form.reset();
        } else {
            throw new Error('Server response not ok');
        }
    } catch (error) {
        console.error(error);
        btn.textContent = 'Error al enviar (Reintentar)';
        btn.disabled = false;
        alert("Hubo un error al enviar el mensaje. Por favor, asegúrate de haber confirmado tu email en FormSubmit o inténtalo más tarde.");
    }
}
