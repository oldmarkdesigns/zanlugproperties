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
});

