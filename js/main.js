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

        // --- Awards Text Toggle ---
        const awardsToggleBtn = document.getElementById('awards-text-toggle');
        const awardsTextContent = document.getElementById('awards-text-content');
        const awardsTextLabel = document.getElementById('awards-text-label');
        const awardsTextIcon = document.getElementById('awards-text-icon');
        
        if (awardsToggleBtn && awardsTextContent) {
            awardsToggleBtn.addEventListener('click', () => {
                const isHidden = awardsTextContent.classList.contains('hidden');
                if (isHidden) {
                    awardsTextContent.classList.remove('hidden');
                    awardsTextIcon.classList.add('rotate-180');
                    awardsTextLabel.textContent = 'Read Less';
                } else {
                    awardsTextContent.classList.add('hidden');
                    awardsTextIcon.classList.remove('rotate-180');
                    awardsTextLabel.textContent = 'Read Full Story';
                }
            });
        }

        // --- Awards Carousel ---
        const carousel = document.getElementById('awards-carousel');
        if (carousel) {
            const images = carousel.querySelectorAll('img');
            const prevBtn = document.getElementById('carousel-prev');
            const nextBtn = document.getElementById('carousel-next');
            const dots = document.getElementById('carousel-dots').querySelectorAll('button');
            
            let currentIndex = 0;
            let intervalId;

            const showImage = (index) => {
                images.forEach((img, i) => {
                    img.style.opacity = '0';
                    img.style.zIndex = '0';
                    if(dots[i]) {
                        dots[i].style.opacity = '0.5';
                    }
                });
                
                if(images[index]) {
                    images[index].style.opacity = '1';
                    images[index].style.zIndex = '10';
                }
                if(dots[index]) {
                    dots[index].style.opacity = '1';
                }
            };

            const nextImage = () => {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            };

            const prevImage = () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            };

            const startAutoPlay = () => {
                intervalId = setInterval(nextImage, 2000);
            };

            const stopAutoPlay = () => {
                clearInterval(intervalId);
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextImage();
                    stopAutoPlay();
                    startAutoPlay();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevImage();
                    stopAutoPlay();
                    startAutoPlay();
                });
            }

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    showImage(currentIndex);
                    stopAutoPlay();
                    startAutoPlay();
                });
            });

            // Pause on hover
            const carouselContainer = carousel.parentElement;
            if (carouselContainer) {
                carouselContainer.addEventListener('mouseenter', stopAutoPlay);
                carouselContainer.addEventListener('mouseleave', startAutoPlay);
            }

            // Start autoplay
            startAutoPlay();
        }