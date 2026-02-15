document.addEventListener('DOMContentLoaded', function() {
    // ----------  Vertical news feed: hero in center, snap, four states  ----------
    const feed = document.querySelector('.news-feed');
    const viewport = document.querySelector('.news-feed-viewport');
    const track = document.querySelector('.news-feed-track');
    const items = track ? track.querySelectorAll('.news-feed-item') : [];

    if (feed && viewport && track && items.length) {
        let scrollEndTimer = null;
        const SNAP_DELAY_MS = 120;

        function getViewportCenterY() {
            var rect = viewport.getBoundingClientRect();
            return rect.top + viewport.clientHeight / 2;
        }

        function getItemCenterY(el) {
            var rect = el.getBoundingClientRect();
            return rect.top + rect.height / 2;
        }

        function distanceToCenter(item) {
            var viewCenter = getViewportCenterY();
            var itemCenter = getItemCenterY(item);
            return Math.abs(itemCenter - viewCenter);
        }

        function isInView(item) {
            var rect = item.getBoundingClientRect();
            var vh = viewport.clientHeight;
            return rect.bottom > 0 && rect.top < vh;
        }

        function getClosestIndex() {
            var closest = 0;
            var minDist = Infinity;
            items.forEach(function(item, i) {
                var d = distanceToCenter(item);
                if (d < minDist) {
                    minDist = d;
                    closest = i;
                }
            });
            return closest;
        }

        function assignStates(heroIndex, isScrolling) {
            items.forEach(function(item, i) {
                item.classList.remove('state-invisible', 'state-background', 'state-candidate', 'state-hero');
                if (!isInView(item)) {
                    item.classList.add('state-invisible');
                    return;
                }
                if (i === heroIndex) {
                    item.classList.add(isScrolling ? 'state-candidate' : 'state-hero');
                    return;
                }
                item.classList.add('state-background');
            });
        }

        function snapToClosest() {
            var heroIndex = getClosestIndex();
            var item = items[heroIndex];
            if (!item) return;
            var itemTop = item.offsetTop;
            var itemHeight = item.offsetHeight;
            var viewHeight = viewport.clientHeight;
            var targetScroll = itemTop - (viewHeight / 2) + (itemHeight / 2);
            targetScroll = Math.max(0, Math.min(viewport.scrollHeight - viewHeight, targetScroll));
            viewport.scrollTo({ top: targetScroll, behavior: 'smooth' });
            assignStates(heroIndex, false);
            feed.classList.toggle('hero-is-first', heroIndex === 0);
        }

        function onScroll() {
            var heroIndex = getClosestIndex();
            assignStates(heroIndex, true);
            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(function() {
                snapToClosest();
            }, SNAP_DELAY_MS);
        }

        viewport.addEventListener('scroll', onScroll, { passive: true });

        function centerCard(index) {
            var item = items[index];
            if (!item) return;
            var targetScroll = item.offsetTop - (viewport.clientHeight / 2) + (item.offsetHeight / 2);
            targetScroll = Math.max(0, Math.min(viewport.scrollHeight - viewport.clientHeight, targetScroll));
            viewport.scrollTop = targetScroll;
        }

        centerCard(0);
        assignStates(0, false);
        feed.classList.toggle('hero-is-first', true);
        onScroll();
    }

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
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        if (bgTiles) bgTiles.style.transform = 'translateY(' + (-scrollY * 0.01) + 'px)';
    });
});

// Glass-banner marquee
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