document.addEventListener('DOMContentLoaded', function() {
    // Параллакс-эффект для фона
    const videoBg = document.querySelector('.video-background');
    /* First .gradient-overlay is inside .headline (scrolls away); use fixed layer for scroll darken */
    const gradient = document.querySelector('.gradient-overlay--scroll');
    const contentHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = contentHeight - windowHeight;
    const bgScrollableHeight = videoBg.offsetHeight - windowHeight;
    const bgSpeed = bgScrollableHeight / maxScroll;

    const maxDarkness = 0.9; // Максимальная непрозрачность (0-1)
    const maxBlur = 15; // Максимальное размытие в пикселях
    const effectEndPoint = 500; // Пиксель скролла, где эффект достигает максимума

    document.addEventListener('scroll', function() {
        const scrollPos = window.scrollY;

        if (videoBg) {
            const bgOffset = Math.min(scrollPos * bgSpeed, bgScrollableHeight);
            videoBg.style.transform = `translateY(${bgOffset}px)`;
        }

        if (gradient) {
            const progress = Math.min(scrollPos / effectEndPoint, 1);
            const darkness = progress * maxDarkness;
            const blur = progress * maxBlur;
            gradient.style.opacity = String(darkness);
            gradient.style.backdropFilter = `blur(${blur}px)`;
            gradient.style.transform = 'none';
        }
    });

    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop < 0) {
            window.scrollTo(0, 0);
        }
        
        if (scrollTop <= 0) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 100);
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    window.scrollTo(0, 0);

    // Параллакс-эффект для текстовых блоков
    const textBlocks = document.querySelectorAll('.text-block');
    const triggerZone = 0.6;

    function updateParallax() {
        textBlocks.forEach(block => {
            const blockRect = block.getBoundingClientRect();
            const blockCenter = blockRect.top + blockRect.height / 2;
            const screenTriggerPoint = windowHeight * triggerZone;
            const proximity = 1 - Math.abs(screenTriggerPoint - blockCenter) / (windowHeight * 0.3);
            const clampedProximity = Math.max(0, Math.min(1, proximity));
            const offset = -clampedProximity * window.innerWidth * 0.1;
            const glowIntensity = 0.8 + clampedProximity * 0.4;

            block.style.transform = `translateX(${offset}px)`;
            block.style.filter = `brightness(${glowIntensity}) drop-shadow(0 0 ${clampedProximity * 15}px rgba(0, 200, 255, 0.7))`;
        });
    }

    window.addEventListener('scroll', updateParallax);
    window.addEventListener('resize', updateParallax);
    updateParallax();
});

document.addEventListener('DOMContentLoaded', function() {
  /* One carousel state per .carousel-container (multiple factions on index) */
  document.querySelectorAll('.carousel-container').forEach(function(container) {
    const cards = container.querySelectorAll('.cards .card');
    const leftBtn = container.querySelector('.carousel-arrow.left');
    const rightBtn = container.querySelector('.carousel-arrow.right');
    if (!cards.length || !leftBtn || !rightBtn) return;

    let currentIndex = Math.min(1, cards.length - 1);
    let isTransitioning = false;

    function updateCarousel() {
      if (isTransitioning) return;
      isTransitioning = true;

      cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next');
        if (index === currentIndex) {
          card.classList.add('active');
        } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
          card.classList.add('prev');
        } else if (index === (currentIndex + 1) % cards.length) {
          card.classList.add('next');
        }
      });

      const activeCard = cards[currentIndex];
      const transitionEndHandler = function() {
        isTransitioning = false;
        activeCard.removeEventListener('transitionend', transitionEndHandler);
      };
      activeCard.addEventListener('transitionend', transitionEndHandler);
    }

    leftBtn.addEventListener('click', function() {
      if (isTransitioning) return;
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    });

    rightBtn.addEventListener('click', function() {
      if (isTransitioning) return;
      currentIndex = (currentIndex + 1 + cards.length) % cards.length;
      updateCarousel();
    });

    updateCarousel();
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    const headline = document.querySelector('.headline');
    const inner = document.querySelector('.inner');
    const gifBackground = document.querySelector('.gif-background');
    /* After hero intro animations, enable full neon + flicker (matches previous default .activated) */
    if (document.body.classList.contains('page-index') && inner) {
        const introMs = 1750;
        setTimeout(function() {
            inner.classList.add('activated');
        }, introMs);
    }
    
    // Sticky nav on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const headlineHeight = headline.offsetHeight;
        
        // Nav background change
        if (scrollPosition > headlineHeight * 0.7) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Parallax effect for GIF background
        const gifOffset = scrollPosition * 0.5;
        gifBackground.style.transform = `translateY(${gifOffset}px)`;
        
        // Fade out header content
        const opacity = 1 - scrollPosition / (headlineHeight * 0.8);
        inner.style.opacity = Math.max(0, opacity).toString();
    });
});

document.querySelector('.inner')?.addEventListener('click', function() {
    this.classList.toggle('activated');
    document.querySelector('header')?.classList.toggle('neon-active');
});