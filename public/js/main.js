/**
 * SCIDI - Rusty-Spotted Cat Conservation Project
 * Main JavaScript File
 * * [修正済み] スクロールイベントリスナー (ProgressBar, BackToTop, Navbar, Parallax, ActiveLink) は
 * Layout.astro 側の <script> タグに移管されました。
 * このファイルは、メニュー開閉、スムーズスクロール、スクロールアニメーション(Observer)、通知システムなどを担当します。
 */

// Wait for Astro to be fully loaded
document.addEventListener('astro:page-load', function() {
    
    // ===========================
    // Navigation Functionality
    // ===========================
    
    const navbar = document.getElementById('navbar'); // スムーズスクロールで高さを参照するため残す
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Change icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.className = 'fas fa-bars text-2xl';
                } else {
                    icon.className = 'fas fa-times text-2xl';
                }
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars text-2xl';
                }
            });
        });
    }
    
    // ===========================
    // Active Section Highlighting in Navigation
    // ===========================
    
    // (Layout.astroに移管されました)
    
    // ===========================
    // Smooth Scrolling
    // ===========================
    
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===========================
    // Scroll Animations (Intersection Observer)
    // ===========================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optionally stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with scroll-animate class
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add scroll-animate class to sections for entrance animations
    // (二重宣言エラー修正済み)
    const animatedSections = document.querySelectorAll('section:not(#hero)');
    animatedSections.forEach(section => { 
        section.classList.add('scroll-animate');
        observer.observe(section);
    });
    

    
    // ===========================
    // Parallax Effect for Hero
    // ===========================
    
    // (Layout.astroに移管されました)
    
    // ===========================
    // Donation Button Interactions
    // ===========================
    
    const donationButtons = document.querySelectorAll('button[class*="donate"]');
    donationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default behavior
            e.preventDefault();
            
            // Add loading state
            const originalText = this.textContent;
            this.textContent = '処理中...';
            this.disabled = true;
            
            // Simulate donation process (replace with actual implementation)
            setTimeout(() => {
                // Show success message
                showNotification('ご支援ありがとうございます！', 'success');
                
                // Reset button
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    });
    
    // ===========================
    // Notification System
    // ===========================
    
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 translate-x-full`;
        
        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
            notification.innerHTML = `
                <div class="flex items-center space-x-3">
                    <i class="fas fa-check-circle text-2xl"></i>
                    <span class="font-medium">${message}</span>
                </div>
            `;
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
            notification.innerHTML = `
                <div class="flex items-center space-x-3">
                    <i class="fas fa-exclamation-circle text-2xl"></i>
                    <span class="font-medium">${message}</span>
                </div>
            `;
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // ===========================
    // Image Lazy Loading
    // ===========================
    
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // ===========================
    // Social Share Functionality
    // ===========================
    
    function shareOnSocial(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('サビイロネコ保護プロジェクト - 密猟ゼロの世界へ');
        const description = encodeURIComponent('世界最小級の野生ネコ、サビイロネコを守るプロジェクトを応援しています。');
        
        let shareUrl = '';
        
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'line':
                shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
                break;
            default:
                return;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    // Add share functionality to social buttons
    const socialButtons = document.querySelectorAll('.social-share');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            shareOnSocial(platform);
        });
    });
    
    // ===========================
    // Form Validation (if forms exist)
    // ===========================
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                } else {
                    input.classList.remove('border-red-500');
                }
            });
            
            if (isValid) {
                // Form is valid, proceed with submission
                showNotification('送信しました', 'success');
                form.reset();
            } else {
                showNotification('必須項目を入力してください', 'error');
            }
        });
    });
    
    // ===========================
    // Accessibility Enhancements
    // ===========================
    
    // Add keyboard navigation for custom interactive elements
    const interactiveElements = document.querySelectorAll('[role="button"]:not(button)');
    interactiveElements.forEach(element => {
        element.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Focus trap for modals (if implemented)
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                // Close modal functionality
                element.classList.add('hidden');
            }
        });
    }
    
    // ===========================
    // Performance Optimization
    // ===========================
    
    // (Debounce / Throttle はここでは不要)
    
    // ===========================
    // Analytics Event Tracking
    // ===========================
    
    function trackEvent(category, action, label = '') {
        // Placeholder for analytics tracking
        // Replace with actual analytics implementation (e.g., Google Analytics, Matomo)
        console.log(`Event: ${category} - ${action} - ${label}`);
    }
    
    // Track CTA clicks
    const ctaButtons = document.querySelectorAll('a[href*="support"], button[class*="support"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('CTA', 'click', 'Support Button');
        });
    });
    
    // Track section views
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId) {
                    trackEvent('Section View', sectionId);
                }
            }
        });
    }, { threshold: 0.5 });
    
    const sections = document.querySelectorAll('section[id]'); // Analytics用に必要
    sections.forEach(section => {
        if (section.id) {
            sectionObserver.observe(section);
        }
    });
    
    // ===========================
    // Console Welcome Message
    // ===========================
    
    console.log('%c🐱 SCIDI - サビイロネコ保護プロジェクト', 'font-size: 20px; font-weight: bold; color: #009688;');
    console.log('%c密猟ゼロの世界を目指して', 'font-size: 14px; color: #004B87;');
    console.log('%cご支援ありがとうございます！', 'font-size: 14px; color: #666;');
    
    // ===========================
    // Initialize All Features
    // ===========================
    
    console.log('✅ All features initialized successfully (main.js)');
    
});

// ===========================
// Service Worker Registration (for PWA - optional)
// ===========================

if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js')
    //         .then(registration => console.log('SW registered:', registration))
    //         .catch(error => console.log('SW registration failed:', error));
    // });
}

// ===========================
// Error Handling
// ===========================

window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // Optionally send errors to logging service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Optionally send errors to logging service
});