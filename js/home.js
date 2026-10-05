/* =====================================================================
   Mohammed Marzouq — Portfolio (homepage interactions)
   ===================================================================== */
(() => {
    'use strict';

    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => [...root.querySelectorAll(s)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    /* ---------- Nav state + scroll progress ---------- */
    const nav = $('#nav');
    const progress = $('#progress');
    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            nav.classList.toggle('is-scrolled', y > 24);
            progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
            ticking = false;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    const menu = $('#mobile-menu');
    const menuBtn = $('#mobile-menu-button');
    const menuClose = $('#mobile-menu-close');
    const openMenu = () => {
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        setTimeout(() => menuClose.focus(), 100);
    };
    const closeMenu = (restoreFocus = true) => {
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (restoreFocus) menuBtn.focus();
    };
    menuBtn.addEventListener('click', openMenu);
    menuClose.addEventListener('click', () => closeMenu());
    $$('#mobile-menu a').forEach(a => a.addEventListener('click', () => closeMenu(false)));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });

    /* ---------- Fit hero name to container width ---------- */
    const heroName = $('#hero-name');
    const fitInner = heroName && $('.fit', heroName);
    const fitHero = () => {
        if (!heroName || !fitInner) return;
        heroName.style.fontSize = '100px';
        const w = fitInner.getBoundingClientRect().width;
        const target = heroName.clientWidth;
        if (w > 0) heroName.style.fontSize = `${Math.floor((100 * target / w) * 10) / 10 - 0.2}px`;
    };
    let resizeT;
    window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(fitHero, 80);
    });
    fitHero();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHero);

    /* ---------- Scroll reveal ---------- */
    const revealIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealIO.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => revealIO.observe(el));

    /* ---------- Count-up stats ---------- */
    const countIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            countIO.unobserve(el);
            const end = parseInt(el.dataset.count, 10);
            if (reduceMotion || Number.isNaN(end)) { el.textContent = end; return; }
            const dur = 1400;
            const t0 = performance.now();
            const tick = now => {
                const p = Math.min((now - t0) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 4);
                el.textContent = Math.round(end * eased);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(el => countIO.observe(el));

    /* ---------- Scroll-spy ---------- */
    const navLinks = $$('.nav-link');
    const spyTargets = navLinks
        .map(l => document.getElementById(l.getAttribute('href').slice(1)))
        .filter(Boolean);
    const spyIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyTargets.forEach(s => spyIO.observe(s));

    /* ---------- Pause off-screen autoplay videos (saves CPU/battery) ---------- */
    const vidIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const v = entry.target;
            if (entry.isIntersecting) {
                const p = v.play();
                if (p && p.catch) p.catch(() => { });
            } else {
                v.pause();
            }
        });
    }, { threshold: 0.05 });
    $$('video[data-autoplay]').forEach(v => vidIO.observe(v));

    /* ---------- Project filtering ---------- */
    const rows = $$('#project-index .row');
    const catChips = $$('[data-filter-cat]');
    const tagChips = $$('[data-filter-tag]');
    const countEl = $('#result-count');
    const clearBtn = $('#clear-filter');
    const emptyEl = $('#empty-state');
    const drawer = $('#tag-drawer');
    const state = { cat: 'all', tag: null };

    const applyFilters = () => {
        let shown = 0;
        rows.forEach(row => {
            const catOk = state.cat === 'all' || row.dataset.cat === state.cat;
            const tagOk = !state.tag || row.dataset.tags.split('|').includes(state.tag);
            const show = catOk && tagOk;
            const wasHidden = row.hidden;
            row.hidden = !show;
            if (show) {
                if (wasHidden && !reduceMotion) {
                    row.classList.remove('is-entering');
                    void row.offsetWidth;
                    row.style.animationDelay = `${Math.min(shown, 10) * 35}ms`;
                    row.classList.add('is-entering');
                }
                shown++;
            }
        });
        catChips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filterCat === state.cat)));
        tagChips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filterTag === state.tag)));
        countEl.textContent = `${String(shown).padStart(2, '0')} / ${String(rows.length).padStart(2, '0')}`;
        clearBtn.hidden = state.cat === 'all' && !state.tag;
        emptyEl.hidden = shown !== 0;
    };

    catChips.forEach(chip => chip.addEventListener('click', () => {
        state.cat = chip.dataset.filterCat;
        applyFilters();
    }));
    tagChips.forEach(chip => chip.addEventListener('click', () => {
        state.tag = state.tag === chip.dataset.filterTag ? null : chip.dataset.filterTag;
        applyFilters();
    }));
    clearBtn.addEventListener('click', () => {
        state.cat = 'all';
        state.tag = null;
        applyFilters();
    });
    // Tags inside rows act as shortcuts to the tag filter
    $$('#project-index .tag').forEach(tag => tag.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        state.cat = 'all';
        state.tag = tag.dataset.tag;
        if (drawer) drawer.open = true;
        applyFilters();
        const filters = $('#project-filters');
        const top = filters.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 16);
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }));
    if (rows.length) applyFilters();

    /* ---------- Lazy thumbnails (mobile list view) ---------- */
    const thumbIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.offsetParent === null) return; // not displayed at this breakpoint
            thumbIO.unobserve(el);
            el.src = el.dataset.src;
            if (el.tagName === 'VIDEO') {
                el.load();
                vidIO.observe(el);
            }
        });
    }, { rootMargin: '200px 0px' });
    $$('.row-thumb [data-src]').forEach(el => thumbIO.observe(el));

    /* ---------- Cursor-following media preview (desktop) ---------- */
    const preview = $('#preview');
    if (preview) {
        const cache = new Map();
        let active = null;
        let x = 0, y = 0, tx = 0, ty = 0, raf = null;
        const w = () => preview.offsetWidth;
        const h = () => preview.offsetHeight;

        const loop = () => {
            x += (tx - x) * 0.18;
            y += (ty - y) * 0.18;
            preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            raf = Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : null;
        };
        const setTarget = (cx, cy) => {
            const pw = w(), ph = h();
            let nx = cx + 28;
            if (nx + pw > window.innerWidth - 16) nx = cx - pw - 28;
            let ny = cy - ph / 2;
            ny = Math.max(16, Math.min(ny, window.innerHeight - ph - 16));
            tx = nx; ty = ny;
            if (!raf) raf = requestAnimationFrame(loop);
        };
        const getMedia = el => {
            const key = el.dataset.preview;
            if (cache.has(key)) return cache.get(key);
            let m;
            if (el.dataset.previewType === 'video') {
                m = document.createElement('video');
                m.muted = true; m.loop = true; m.playsInline = true; m.preload = 'auto';
                m.src = key;
            } else {
                m = document.createElement('img');
                m.alt = '';
                m.decoding = 'async';
                m.src = key;
            }
            m.className = 'pv-item';
            preview.appendChild(m);
            cache.set(key, m);
            return m;
        };

        $$('[data-preview]').forEach(el => {
            el.addEventListener('mouseenter', e => {
                if (!finePointer.matches || window.innerWidth < 900) return;
                const m = getMedia(el);
                if (active && active !== m) {
                    active.classList.remove('is-on');
                    if (active.tagName === 'VIDEO') active.pause();
                }
                active = m;
                m.classList.add('is-on');
                if (m.tagName === 'VIDEO') { const p = m.play(); if (p && p.catch) p.catch(() => { }); }
                if (!preview.classList.contains('is-on')) {
                    // jump into place on first show, then follow smoothly
                    setTarget(e.clientX, e.clientY);
                    x = tx; y = ty;
                    preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                }
                preview.classList.add('is-on');
            });
            el.addEventListener('mousemove', e => setTarget(e.clientX, e.clientY));
            el.addEventListener('mouseleave', () => {
                preview.classList.remove('is-on');
                if (active && active.tagName === 'VIDEO') active.pause();
            });
        });
    }

    /* ---------- Awards: read more ---------- */
    const awardToggle = $('#awards-text-toggle');
    const awardMore = $('#awards-text-content');
    if (awardToggle && awardMore) {
        awardToggle.addEventListener('click', () => {
            const open = awardToggle.getAttribute('aria-expanded') === 'true';
            awardToggle.setAttribute('aria-expanded', String(!open));
            awardMore.classList.toggle('is-open', !open);
            awardMore.setAttribute('aria-hidden', String(open));
            $('#awards-text-label').textContent = open ? 'Read the full story' : 'Show less';
        });
    }

    /* ---------- Awards: carousel ---------- */
    const carousel = $('#awards-carousel');
    if (carousel) {
        const slides = $$('img', carousel);
        const cur = $('#carousel-current');
        const bar = $('#carousel-progress');
        const DURATION = 4500;
        let i = 0, t0 = 0, raf = null, paused = false, elapsed = 0;

        const show = n => {
            i = (n + slides.length) % slides.length;
            slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
            cur.textContent = String(i + 1).padStart(2, '0');
            elapsed = 0;
            t0 = performance.now();
        };
        const frame = now => {
            if (!paused) {
                const p = Math.min((elapsed + (now - t0)) / DURATION, 1);
                bar.style.transform = `scaleX(${p})`;
                if (p >= 1) show(i + 1);
            }
            raf = requestAnimationFrame(frame);
        };
        const pause = () => { if (!paused) { paused = true; elapsed += performance.now() - t0; } };
        const resume = () => { if (paused) { paused = false; t0 = performance.now(); } };

        $('#carousel-prev').addEventListener('click', () => show(i - 1));
        $('#carousel-next').addEventListener('click', () => show(i + 1));
        const wrap = carousel.closest('.award-media');
        wrap.addEventListener('mouseenter', pause);
        wrap.addEventListener('mouseleave', resume);

        show(0);
        if (!reduceMotion) {
            // only run while visible
            new IntersectionObserver(([e]) => {
                if (e.isIntersecting) { if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); } }
                else if (raf) { cancelAnimationFrame(raf); raf = null; elapsed = 0; }
            }, { threshold: 0.2 }).observe(carousel);
        }
    }

    /* ---------- Copy email ---------- */
    const copyBtn = $('#copy-email');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const email = copyBtn.dataset.email;
            try {
                await navigator.clipboard.writeText(email);
            } catch {
                const ta = Object.assign(document.createElement('textarea'), { value: email });
                document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
            }
            const label = $('span', copyBtn);
            copyBtn.classList.add('is-done');
            label.textContent = 'Copied ✓';
            setTimeout(() => { copyBtn.classList.remove('is-done'); label.textContent = 'Copy'; }, 2000);
        });
    }

    /* ---------- Local time (Netherlands) ---------- */
    const clocks = $$('[data-clock]');
    if (clocks.length) {
        const fmt = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam', hour12: false
        });
        const tz = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', timeZoneName: 'short' })
            .formatToParts(new Date()).find(p => p.type === 'timeZoneName');
        const tick = () => clocks.forEach(c => { c.textContent = fmt.format(new Date()); });
        tick();
        setInterval(tick, 15000);
        $$('[data-tz]').forEach(el => { if (tz) el.textContent = tz.value; });
    }

    /* ---------- Footer year ---------- */
    const yr = $('#footer-year');
    if (yr) yr.textContent = new Date().getFullYear();
})();
