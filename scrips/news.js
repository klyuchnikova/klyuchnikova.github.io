document.addEventListener('DOMContentLoaded', function() {
    // Flip card functionality
    const flipCards = document.querySelectorAll('.square-flip');

    flipCards.forEach(card => {
        const readMoreBtn = card.querySelector('.read-more-btn');
        const flipBackBtn = card.querySelector('.flip-back-btn');
        
        readMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.add('flipped');
        });
        
        flipBackBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.remove('flipped');
        });
        
        card.addEventListener('click', (e) => {
            if (card.classList.contains('flipped')) {
                card.classList.remove('flipped');
            }
        });
    });

    document.querySelectorAll('.reaction').forEach(reaction => {
        reaction.addEventListener('click', function() {
            const countEl = this.querySelector('.reaction-count');
            if (!countEl) return;
            if (!this.classList.contains('active')) {
                const count = parseInt(countEl.textContent, 10) || 0;
                countEl.textContent = count + 1;
                this.classList.add('active');
            }
        });
    });

    // Sticky navigation
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});

// Enhanced parallax effect
document.addEventListener('DOMContentLoaded', function() {
    const bgTiles = document.querySelector('.news-bg-tiles');
    const newsGrid = document.querySelector('.news-grid');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        // Subtle parallax effect (adjust 0.01 for stronger/weaker effect)
        bgTiles.style.transform = `translateY(${-scrollY * 0.01}px)`;
        // Content lift effect
        newsGrid.style.transform = `translateZ(20px)`;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const img1 = new Image();
    const img2 = new Image();
    
    img1.src = '../src/images/news_background_mobile.jpeg';
    img2.src = '../src/images/news_background_mobile_flip.jpeg';
    
    img1.onload = img2.onload = function() {
        console.log('Images loaded. Heights:', img1.height, img2.height);
        // If heights differ, adjust background-position in CSS
    };
});

// Replace your existing glass-banner code in news.js with this:
document.addEventListener('DOMContentLoaded', function() {
    const banner = document.querySelector('.glass-banner');
    const content = banner.querySelector('.glass-banner-content');
    const originalContent = content.innerHTML;
    
    // Duplicate content for seamless looping
    content.innerHTML = originalContent + originalContent;
    
    // Get the total width of the original content
    const contentWidth = content.scrollWidth / 2;
    
    // Animation function
    function animateBanner() {
        // Reset position when halfway through
        if (content.style.transform === `translateX(-${contentWidth}px)`) {
            content.style.transition = 'none';
            content.style.transform = 'translateX(0)';
            // Force reflow
            void content.offsetWidth;
        }
        
        // Animate to the left
        content.style.transition = `transform ${contentWidth/50}s linear`;
        content.style.transform = `translateX(-${contentWidth}px)`;
    }
    
    // Start animation
    animateBanner();
    
    // Continue animation after each loop
    content.addEventListener('transitionend', animateBanner);
    
    // Pause on hover
    banner.addEventListener('mouseenter', () => {
        content.style.transition = 'none';
    });
    
    banner.addEventListener('mouseleave', () => {
        animateBanner();
    });
});