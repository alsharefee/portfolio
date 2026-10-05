/* =====================================================================
   Mohammed Marzouq — Portfolio
   Project Detail Pages: Interactive Script
   ===================================================================== */
(() => {
    'use strict';

    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => [...root.querySelectorAll(s)];

    // Scroll progress & nav frosted background
    const nav = $('#nav');
    const progress = $('#progress');
    let ticking = false;

    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (nav) nav.classList.toggle('is-scrolled', y > 24);
            if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
            ticking = false;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Pause offscreen videos
    const vidIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const v = entry.target;
            if (entry.isIntersecting) {
                const p = v.play();
                if (p && p.catch) p.catch(() => {});
            } else {
                v.pause();
            }
        });
    }, { threshold: 0.1 });
    $$('video[autoplay]').forEach(v => vidIO.observe(v));

    // Lightbox modal for gallery images
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightbox-img');
    const lightboxClose = $('#lightbox-close');

    if (lightbox && lightboxImg) {
        const openLightbox = (src, alt) => {
            lightboxImg.src = src;
            lightboxImg.alt = alt || '';
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            lightboxImg.src = '';
        };

        $$('.project-body img:not([data-no-zoom]), .gallery-item img, .media-card img:not([data-no-zoom])').forEach(img => {
            if (img.closest('a')) return;
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => openLightbox(img.src, img.alt));
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
        });
    }

    // Keyboard navigation: Left Arrow (Prev project), Right Arrow (Next project)
    const prevLink = $('#prev-project-link');
    const nextLink = $('#next-project-link');

    document.addEventListener('keydown', e => {
        // Ignore if user is inside an input/textarea
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
        if (lightbox && lightbox.classList.contains('is-open')) return;

        if (e.key === 'ArrowLeft' && prevLink) {
            prevLink.click();
        } else if (e.key === 'ArrowRight' && nextLink) {
            nextLink.click();
        }
    });

    // Local time in footer
    const clock = $('[data-clock]');
    if (clock) {
        const fmt = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam', hour12: false
        });
        const tick = () => { clock.textContent = fmt.format(new Date()); };
        tick();
        setInterval(tick, 15000);
    }
})();
