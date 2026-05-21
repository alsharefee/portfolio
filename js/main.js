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

        // --- Project Keyword Filtering ---
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('#projects .reveal.bg-slate-800');

        if (filterBtns.length > 0 && projectCards.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active styling
                    filterBtns.forEach(b => {
                        b.classList.remove('border-blue-500', 'bg-blue-600', 'text-white');
                        b.classList.add('border-slate-700', 'bg-slate-800', 'text-blue-300');
                    });
                    
                    btn.classList.remove('border-slate-700', 'bg-slate-800', 'text-blue-300');
                    btn.classList.add('border-blue-500', 'bg-blue-600', 'text-white');
                    
                    const filterValue = btn.getAttribute('data-filter');
                    
                    projectCards.forEach(card => {
                        // Apply a smooth transition if not already present
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        
                        if (filterValue === 'all') {
                            card.style.display = '';
                            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
                        } else {
                            // Find all keyword spans in this card
                            const spans = card.querySelectorAll('span.text-xs.bg-slate-900.text-blue-300');
                            let hasKeyword = false;
                            spans.forEach(span => {
                                if (span.textContent.replace(/\s+/g, ' ').trim() === filterValue) {
                                    hasKeyword = true;
                                }
                            });
                            
                            if (hasKeyword) {
                                card.style.display = '';
                                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
                            } else {
                                card.style.opacity = '0';
                                card.style.transform = 'scale(0.95)';
                                setTimeout(() => {
                                    if(btn.getAttribute('data-filter') === filterValue) {
                                        card.style.display = 'none';
                                    }
                                }, 300); // Wait for transition
                            }
                        }
                    });
                });
            });

            // Make keyword spans inside project cards clickable to trigger the same filter
            const projectKeywords = document.querySelectorAll('#projects span.text-xs.bg-slate-900.text-blue-300');
            projectKeywords.forEach(kw => {
                kw.style.cursor = 'pointer';
                kw.style.transition = 'border-color 0.2s ease, background-color 0.2s ease';
                
                kw.addEventListener('mouseenter', () => {
                    kw.style.borderColor = '#3b82f6'; // Tailwind blue-500
                    kw.style.backgroundColor = '#1e293b'; // Tailwind slate-800
                });
                kw.addEventListener('mouseleave', () => {
                    kw.style.borderColor = '';
                    kw.style.backgroundColor = '';
                });
                
                kw.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const filterValue = kw.textContent.replace(/\s+/g, ' ').trim();
                    const targetBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === filterValue);
                    if (targetBtn) {
                        targetBtn.click();
                        // Scroll up to the filter section smoothly
                        const filterSection = document.getElementById('project-filters');
                        if (filterSection) {
                            const offset = 100; // Account for fixed navbar
                            const bodyRect = document.body.getBoundingClientRect().top;
                            const elementRect = filterSection.getBoundingClientRect().top;
                            const elementPosition = elementRect - bodyRect;
                            const offsetPosition = elementPosition - offset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        }
