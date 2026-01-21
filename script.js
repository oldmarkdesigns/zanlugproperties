// Simple page-load and content animations

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    
    // Move booking section after gallery on mobile/tablet
    const moveBookingSection = () => {
        const detailBooking = document.querySelector('.detail-booking');
        const detailGallery = document.querySelector('.detail-gallery');
        const detailLayout = document.querySelector('.detail-layout');
        
        if (!detailBooking || !detailGallery || !detailLayout) return;
        
        if (window.innerWidth <= 1024) {
            // On mobile/tablet: move booking section after gallery
            const galleryParent = detailGallery.parentElement;
            if (galleryParent && galleryParent.classList.contains('detail-content')) {
                // Only move if not already moved
                if (detailBooking.parentElement === detailLayout) {
                    detailGallery.insertAdjacentElement('afterend', detailBooking);
                    detailBooking.dataset.moved = 'mobile';
                }
            }
        } else {
            // On desktop: move back to original position if it was moved
            if (detailBooking.dataset.moved === 'mobile') {
                detailLayout.appendChild(detailBooking);
                detailBooking.removeAttribute('data-moved');
            }
        }
    };
    
    // Run on load and resize
    moveBookingSection();
    window.addEventListener('resize', moveBookingSection);
    
    // Hamburger menu toggle
    const hamburgerButton = document.getElementById('hamburger-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    
    if (hamburgerButton && mobileMenu) {
        hamburgerButton.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            hamburgerButton.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !hamburgerButton.contains(e.target)) {
                mobileMenu.classList.remove('active');
                hamburgerButton.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking on a link
        const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburgerButton.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
        
        // Mobile language selector
        const mobileLanguageSelectorWrapper = mobileMenu.querySelector('.mobile-language-selector-wrapper');
        const mobileLanguageSelectorButton = mobileMenu.querySelector('.mobile-language-selector-button');
        const mobileLanguageSelectorText = mobileMenu.querySelector('.mobile-language-selector-text');
        const mobileLanguageSelectorDropdown = mobileMenu.querySelector('.mobile-language-selector-dropdown');
        const mobileLanguageOptions = mobileMenu.querySelectorAll('.mobile-language-option');
        const languageNames = {
            en: 'English',
            sv: 'Swedish',
            tr: 'Turkish',
            no: 'Norwegian',
            da: 'Danish',
            de: 'German'
        };
        
        // Set initial language text
        const savedLang = localStorage.getItem('selectedLanguage') || 'en';
        if (mobileLanguageSelectorText) {
            mobileLanguageSelectorText.textContent = languageNames[savedLang] || 'English';
        }
        
        // Toggle dropdown on button click
        if (mobileLanguageSelectorButton && mobileLanguageSelectorWrapper) {
            mobileLanguageSelectorButton.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileLanguageSelectorWrapper.classList.toggle('active');
            });
        }
        
        // Handle language option clicks
        mobileLanguageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            const currentLang = localStorage.getItem('selectedLanguage') || 'en';
            
            // Hide the currently selected language option
            if (lang === currentLang) {
                option.style.display = 'none';
            }
            
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Call translatePage function from translations.js
                if (typeof translatePage === 'function') {
                    translatePage(lang);
                }
                
                // Update selector text
                if (mobileLanguageSelectorText) {
                    mobileLanguageSelectorText.textContent = languageNames[lang] || 'English';
                }
                
                // Update which option is hidden (hide the newly selected one)
                mobileLanguageOptions.forEach(opt => {
                    const optLang = opt.getAttribute('data-lang');
                    if (optLang === lang) {
                        opt.style.display = 'none';
                    } else {
                        opt.style.display = 'block';
                    }
                });
                
                // Close dropdown
                if (mobileLanguageSelectorWrapper) {
                    mobileLanguageSelectorWrapper.classList.remove('active');
                }
            });
        });
        
        // Update language selector text when language changes from desktop
        const updateMobileLanguageSelector = () => {
            const currentLang = localStorage.getItem('selectedLanguage') || 'en';
            if (mobileLanguageSelectorText) {
                mobileLanguageSelectorText.textContent = languageNames[currentLang] || 'English';
            }
            // Update which option is hidden
            mobileLanguageOptions.forEach(opt => {
                const optLang = opt.getAttribute('data-lang');
                if (optLang === currentLang) {
                    opt.style.display = 'none';
                } else {
                    opt.style.display = 'block';
                }
            });
        };
        
        // Listen for language changes (check periodically)
        setInterval(updateMobileLanguageSelector, 500);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileLanguageSelectorWrapper && 
                !mobileLanguageSelectorWrapper.contains(e.target) && 
                mobileLanguageSelectorWrapper.classList.contains('active')) {
                mobileLanguageSelectorWrapper.classList.remove('active');
            }
        });
    }
    
    // Gallery overlay functionality
    const initGalleryOverlay = () => {
        const gallery = document.querySelector('.detail-gallery');
        if (!gallery) return;
        
        const overlay = document.getElementById('gallery-overlay');
        const overlayImage = document.getElementById('gallery-overlay-image');
        const overlayCounter = document.getElementById('gallery-overlay-counter');
        const overlayThumbnails = document.getElementById('gallery-overlay-thumbnails');
        const overlayClose = document.getElementById('gallery-overlay-close');
        const overlayPrev = document.getElementById('gallery-overlay-prev');
        const overlayNext = document.getElementById('gallery-overlay-next');
        
        if (!overlay || !overlayImage || !overlayCounter || !overlayThumbnails) return;
        
        // Get all gallery images (including hidden ones)
        const allImages = Array.from(gallery.querySelectorAll('.detail-gallery-image'));
        let currentIndex = 0;
        
        // Build thumbnails
        const buildThumbnails = () => {
            overlayThumbnails.innerHTML = '';
            allImages.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img.src;
                thumb.alt = img.alt;
                thumb.className = 'gallery-overlay-thumbnail';
                if (index === currentIndex) {
                    thumb.classList.add('gallery-overlay-thumbnail--active');
                }
                thumb.addEventListener('click', () => {
                    currentIndex = index;
                    updateGallery();
                });
                overlayThumbnails.appendChild(thumb);
            });
        };
        
        // Update gallery display
        const updateGallery = () => {
            if (currentIndex < 0) currentIndex = allImages.length - 1;
            if (currentIndex >= allImages.length) currentIndex = 0;
            
            const currentImage = allImages[currentIndex];
            overlayImage.src = currentImage.src;
            overlayImage.alt = currentImage.alt;
            overlayCounter.textContent = `${currentIndex + 1} / ${allImages.length}`;
            
            // Update active thumbnail
            const thumbnails = overlayThumbnails.querySelectorAll('.gallery-overlay-thumbnail');
            thumbnails.forEach((thumb, index) => {
                if (index === currentIndex) {
                    thumb.classList.add('gallery-overlay-thumbnail--active');
                } else {
                    thumb.classList.remove('gallery-overlay-thumbnail--active');
                }
            });
        };
        
        // Open gallery
        const openGallery = (index) => {
            currentIndex = index;
            updateGallery();
            buildThumbnails();
            overlay.classList.add('gallery-overlay--active');
            document.body.style.overflow = 'hidden';
        };
        
        // Close gallery
        const closeGallery = () => {
            overlay.classList.remove('gallery-overlay--active');
            document.body.style.overflow = '';
        };
        
        // Event listeners for gallery images
        allImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                openGallery(index);
            });
        });
        
        // Event listener for "Show all" overlay
        const showAllOverlay = gallery.querySelector('.gallery-show-all-overlay');
        if (showAllOverlay) {
            showAllOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                const showAllItem = gallery.querySelector('.detail-gallery-item--show-all');
                if (showAllItem) {
                    const showAllImage = showAllItem.querySelector('.detail-gallery-image');
                    if (showAllImage) {
                        const index = parseInt(showAllImage.getAttribute('data-gallery-index'));
                        openGallery(index);
                    }
                }
            });
        }
        
        // Event listeners for overlay controls
        overlayClose.addEventListener('click', closeGallery);
        overlayPrev.addEventListener('click', () => {
            currentIndex--;
            updateGallery();
        });
        overlayNext.addEventListener('click', () => {
            currentIndex++;
            updateGallery();
        });
        
        // Close on overlay background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeGallery();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('gallery-overlay--active')) return;
            
            if (e.key === 'Escape') {
                closeGallery();
            } else if (e.key === 'ArrowLeft') {
                currentIndex--;
                updateGallery();
            } else if (e.key === 'ArrowRight') {
                currentIndex++;
                updateGallery();
            }
        });
    };
    
    initGalleryOverlay();
    
    // Amenities overlay functionality
    const initAmenitiesOverlay = () => {
        const showAmenitiesButton = document.querySelector('.show-amenities-button');
        const amenitiesContent = document.getElementById('amenities-content');
        const amenitiesOverlay = document.getElementById('amenities-overlay');
        const amenitiesOverlayContent = document.getElementById('amenities-overlay-content');
        const amenitiesOverlayClose = document.getElementById('amenities-overlay-close');
        
        if (!showAmenitiesButton || !amenitiesContent || !amenitiesOverlay || !amenitiesOverlayContent) return;
        
        // Hide amenities on page initially
        amenitiesContent.style.display = 'none';
        
        // Open overlay
        const openAmenitiesOverlay = () => {
            // Clone the content to the overlay
            const clonedContent = amenitiesContent.cloneNode(true);
            clonedContent.style.display = 'block';
            amenitiesOverlayContent.innerHTML = '';
            amenitiesOverlayContent.appendChild(clonedContent);
            
            // Apply translations to cloned content
            if (typeof translatePage === 'function') {
                const currentLang = localStorage.getItem('selectedLanguage') || 'en';
                translatePage(currentLang);
            }
            
            amenitiesOverlay.classList.add('amenities-overlay--active');
            document.body.style.overflow = 'hidden';
        };
        
        // Close overlay
        const closeAmenitiesOverlay = () => {
            amenitiesOverlay.classList.remove('amenities-overlay--active');
            document.body.style.overflow = '';
        };
        
        // Event listeners
        showAmenitiesButton.addEventListener('click', openAmenitiesOverlay);
        amenitiesOverlayClose.addEventListener('click', closeAmenitiesOverlay);
        
        // Close on overlay background click
        amenitiesOverlay.addEventListener('click', (e) => {
            if (e.target === amenitiesOverlay) {
                closeAmenitiesOverlay();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!amenitiesOverlay.classList.contains('amenities-overlay--active')) return;
            
            if (e.key === 'Escape') {
                closeAmenitiesOverlay();
            }
        });
    };
    
    initAmenitiesOverlay();
});

