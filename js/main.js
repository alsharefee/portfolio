// --- Mobile menu toggle ---
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        menuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            menuButton.setAttribute('aria-expanded', String(!isHidden));
            menuButton.setAttribute('aria-label', isHidden ? 'Open menu' : 'Close menu');
            menuButton.querySelector('i').className = isHidden ? 'fas fa-bars text-2xl' : 'fas fa-times text-2xl';
        });

        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.setAttribute('aria-label', 'Open menu');
                menuButton.querySelector('i').className = 'fas fa-bars text-2xl';
            });
        });

        // --- Footer year ---
        document.getElementById('footer-year').textContent = new Date().getFullYear();

        // --- Lite YouTube: load iframe only on click ---
        document.querySelectorAll('.lite-yt').forEach(el => {
            const activate = () => {
                const id = el.dataset.videoId;
                if (!id) return;
                const iframe = document.createElement('iframe');
                iframe.className = 'w-full h-full';
                iframe.setAttribute('src', `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`);
                iframe.setAttribute('title', 'YouTube video player');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                el.replaceWith(iframe);
            };
            el.addEventListener('click', activate);
            el.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
            });
        });

        // --- Scroll reveal ---
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        // --- Scroll-spy active nav ---
        const sections = ['about', 'projects', 'code', 'testimonials', 'skills', 'contact']
            .map(id => document.getElementById(id))
            .filter(Boolean);
        const navLinks = document.querySelectorAll('.nav-link');
        const spyObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        sections.forEach(s => spyObserver.observe(s));