// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Header background on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.gallery-card, .stat-item, .swap-card, .banner-content');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Gallery cards hover effects
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Dynamic gallery generation
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryImages = [
        'images/gallery/img2.png',
        'images/gallery/img3.png',
        'images/gallery/img5.jpg',
        'images/gallery/img8.jpg',
        'images/gallery/img9.jpg',
        'images/gallery/img10.jpg',
        'images/gallery/img11.jpg',
        'images/gallery/img13.jpg',
        'images/gallery/img14.jpg',
        'images/gallery/img16.jpg',
        'images/gallery/img17.jpg',
        'images/gallery/img18.jpg'
    ];
    const galleryAnimations = ['galleryMove1', 'galleryMove2', 'galleryMove3', 'galleryMove4', 'galleryMove5', 'galleryMove6'];
    const activeGalleryItems = [];

    function createGalleryItem() {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        // Random position
        const top = Math.random() * 80; // 0-80%
        const left = Math.random() * 80; // 0-80%
        
        // Random image
        const randomImage = galleryImages[Math.floor(Math.random() * galleryImages.length)];
        
        // Random animation
        const randomAnimation = galleryAnimations[Math.floor(Math.random() * galleryAnimations.length)];
        const randomDuration = 5 + Math.random() * 3; // 5-8 seconds
        
        item.style.top = top + '%';
        item.style.left = left + '%';
        item.style.animation = `${randomAnimation} ${randomDuration}s linear infinite`;
        
        item.innerHTML = `<img src="${randomImage}" alt="Gallery Image">`;
        
        // Add to active items
        activeGalleryItems.push({ element: item, startTime: Date.now() });
        
        galleryGrid.appendChild(item);
        
        // Remove item after animation completes
        setTimeout(() => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
                // Remove from active items
                const index = activeGalleryItems.findIndex(activeItem => activeItem.element === item);
                if (index > -1) {
                    activeGalleryItems.splice(index, 1);
                }
            }
        }, randomDuration * 1000);
    }
    
    // Generate new items continuously
    setInterval(createGalleryItem, 400); // Create new item every 0.4 seconds
    
    // Initial items
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createGalleryItem(), i * 150);
    }

    function checkCollision(newPos, existingItems) {
        for (let item of existingItems) {
            const distance = Math.sqrt(
                Math.pow(newPos.x - item.x, 2) + 
                Math.pow(newPos.y - item.y, 2)
            );
            if (distance < minDistance) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }

    function findSafePosition() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (attempts < maxAttempts) {
            const top = Math.random() * 70; // 0-70% to keep items in view
            const left = Math.random() * 70; // 0-70% to keep items in view
            
            const newPos = { x: left, y: top };
            
            if (!checkCollision(newPos, activeItems)) {
                return { top, left };
            }
            
            attempts++;
        }
        
        // If no safe position found, return a position far from others
        return { top: Math.random() * 70, left: Math.random() * 70 };
    }

    function createTunnelItem() {
        const item = document.createElement('div');
        item.className = 'tunnel-item';
        
        // Find safe position
        const position = findSafePosition();
        
        // Random direction and animation
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const animation = animations[Math.floor(Math.random() * animations.length)];
        
        // Random content
        const randomIndex = Math.floor(Math.random() * icons.length);
        
        item.setAttribute('data-direction', direction);
        item.style.animation = `${animation} 6s linear infinite`;
        item.style.top = position.top + '%';
        item.style.left = position.left + '%';
        
        // Add to active items
        activeItems.push({ x: position.left, y: position.top, element: item });
        
        item.innerHTML = `
            <div class="gallery-card">
                <div class="gallery-icon">
                    <i class="${icons[randomIndex]}"></i>
                </div>
                <h3>${titles[randomIndex]}</h3>
                <p>${descriptions[randomIndex]}</p>
            </div>
        `;
        
        // Add hover effects
        const card = item.querySelector('.gallery-card');
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        tunnelGallery.appendChild(item);
        
        // Remove item after animation completes
        setTimeout(() => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
                // Remove from active items
                const index = activeItems.findIndex(activeItem => activeItem.element === item);
                if (index > -1) {
                    activeItems.splice(index, 1);
                }
            }
        }, 6000);
    }
    
    // Generate new items continuously
    setInterval(createTunnelItem, 1500); // Create new item every 1.5 seconds
    
    // Initial items with delay to prevent clustering
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createTunnelItem(), i * 500);
    }
    
    // Clean up old items periodically
    setInterval(() => {
        // Remove items that are no longer in DOM
        activeItems.forEach((item, index) => {
            if (!item.element.parentNode) {
                activeItems.splice(index, 1);
            }
        });
    }, 3000);

    // Add staggered animation for stats
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.animationDelay = `${index * 0.1}s`;
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add loading animation and scroll to bottom
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Scroll to bottom on page load
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 100);
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }, 20);
    };

    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const text = statNumber.textContent;
                let target = 0;
                
                if (text.includes('100K+')) {
                    target = 100;
                    animateCounter(statNumber, target);
                } else if (text.includes('$50M+')) {
                    target = 50;
                    animateCounter(statNumber, target);
                }
                
                statsObserver.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Add CSS for mobile menu
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 2rem;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nav-menu.active {
            transform: translateY(0);
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
    
    body.loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(style); 