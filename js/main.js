// --- Mobile menu toggle ---
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');

        const closeMobileMenu = () => {
            mobileMenu.classList.add('hidden');
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Open menu');
            document.body.style.overflow = '';
        };

        const openMobileMenu = () => {
            mobileMenu.classList.remove('hidden');
            menuButton.setAttribute('aria-expanded', 'true');
            menuButton.setAttribute('aria-label', 'Close menu');
            document.body.style.overflow = 'hidden';
        };

        menuButton.addEventListener('click', () => {
            if (mobileMenu.classList.contains('hidden')) {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
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

        // --- Image Modal Logic ---
        const imageModal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const modalClose = document.getElementById('modal-close');
        const modalContent = document.getElementById('modal-content');

        if (imageModal && modalImage && modalClose) {
            // Find all images in the archive section
            const archiveImages = document.querySelectorAll('#archive img');
            
            archiveImages.forEach(img => {
                img.style.cursor = 'pointer'; // Add pointer cursor
                
                // Add hover effect
                img.addEventListener('mouseenter', () => {
                    img.style.opacity = '0.8';
                });
                img.addEventListener('mouseleave', () => {
                    img.style.opacity = '1';
                });

                img.addEventListener('click', () => {
                    modalImage.src = img.src;
                    
                    // Show modal (remove hidden class first)
                    imageModal.classList.remove('hidden');
                    
                    // Small delay to allow display:flex to apply before animating opacity
                    setTimeout(() => {
                        imageModal.classList.remove('opacity-0');
                        modalContent.classList.remove('scale-95');
                        modalContent.classList.add('scale-100');
                    }, 10);
                });
            });

            const closeModal = () => {
                imageModal.classList.add('opacity-0');
                modalContent.classList.remove('scale-100');
                modalContent.classList.add('scale-95');
                
                // Wait for transition to finish before hiding
                setTimeout(() => {
                    imageModal.classList.add('hidden');
                    modalImage.src = ''; // Clear source so it doesn't flash old image next time
                }, 300);
            };

            modalClose.addEventListener('click', closeModal);
            
            // Close on click outside the image
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal || e.target.parentElement === imageModal && e.target !== modalContent && !modalContent.contains(e.target)) {
                    closeModal();
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
                    closeModal();
                }
            });
        }