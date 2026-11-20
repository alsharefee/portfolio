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

    // Lightbox modal for gallery images (with prev/next cycling & keyboard accessibility)
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightbox-img');
    const lightboxClose = $('#lightbox-close');
    const lightboxPrev = $('#lightbox-prev');
    const lightboxNext = $('#lightbox-next');
    const lightboxMeta = $('#lightbox-meta');
    const lightboxCount = $('#lightbox-count');
    const lightboxCaption = $('#lightbox-caption');

    if (lightbox && lightboxImg) {
        const galleryImgs = $$('.project-body img:not([data-no-zoom]), .gallery-item img, .media-card img:not([data-no-zoom])')
            .filter(img => !img.closest('a'));
        let currentIndex = 0;
        let lastTriggerEl = null;

        const showSlide = idx => {
            if (!galleryImgs.length) return;
            currentIndex = (idx + galleryImgs.length) % galleryImgs.length;
            const target = galleryImgs[currentIndex];
            lightboxImg.src = target.src;
            lightboxImg.alt = target.alt || '';
            const hasMultiple = galleryImgs.length > 1;
            if (lightboxPrev) lightboxPrev.hidden = !hasMultiple;
            if (lightboxNext) lightboxNext.hidden = !hasMultiple;
            if (lightboxMeta) {
                lightboxMeta.hidden = !hasMultiple && !target.alt;
                if (lightboxCount) {
                    lightboxCount.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(galleryImgs.length).padStart(2, '0')}`;
                }
                if (lightboxCaption) {
                    lightboxCaption.textContent = target.alt ? `· ${target.alt}` : '';
                }
            }
        };

        const openLightbox = (idx, triggerEl) => {
            lastTriggerEl = triggerEl || document.activeElement;
            showSlide(idx);
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (lightboxClose) setTimeout(() => lightboxClose.focus(), 40);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            lightboxImg.src = '';
            if (lastTriggerEl && typeof lastTriggerEl.focus === 'function') {
                lastTriggerEl.focus();
            }
            lastTriggerEl = null;
        };

        galleryImgs.forEach((img, idx) => {
            img.style.cursor = 'zoom-in';
            if (!img.hasAttribute('tabindex')) img.tabIndex = 0;
            if (!img.hasAttribute('role')) img.setAttribute('role', 'button');
            img.addEventListener('click', () => openLightbox(idx, img));
            img.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(idx, img);
                }
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', e => { e.stopPropagation(); showSlide(currentIndex - 1); });
        if (lightboxNext) lightboxNext.addEventListener('click', e => { e.stopPropagation(); showSlide(currentIndex + 1); });
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft' && galleryImgs.length > 1) {
                e.preventDefault();
                showSlide(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && galleryImgs.length > 1) {
                e.preventDefault();
                showSlide(currentIndex + 1);
            }
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

    // Local time and year in footer
    const clock = $('[data-clock]');
    if (clock) {
        const fmt = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam', hour12: false
        });
        const tz = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', timeZoneName: 'short' })
            .formatToParts(new Date()).find(p => p.type === 'timeZoneName');
        const tick = () => { clock.textContent = fmt.format(new Date()); };
        tick();
        setInterval(tick, 15000);
        $$('[data-tz]').forEach(el => { if (tz) el.textContent = tz.value; });
    }
    const yr = $('#footer-year');
    if (yr) yr.textContent = new Date().getFullYear();
})();
