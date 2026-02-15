/**
 * Glass banner – marquee / scroll behaviour.
 * Runs only when .glass-banner exists on the page.
 */
document.addEventListener('DOMContentLoaded', function() {
    const banner = document.querySelector('.glass-banner');
    if (!banner) return;

    const content = banner.querySelector('.glass-banner-content');
    if (!content) return;

    const originalContent = content.innerHTML;

    // Duplicate content for seamless looping
    content.innerHTML = originalContent + originalContent;

    // Total width of one copy (half of duplicated content)
    const contentWidth = content.scrollWidth / 2;

    function animateBanner() {
        if (content.style.transform === `translateX(-${contentWidth}px)`) {
            content.style.transition = 'none';
            content.style.transform = 'translateX(0)';
            void content.offsetWidth;
        }

        content.style.transition = `transform ${contentWidth / 50}s linear`;
        content.style.transform = `translateX(-${contentWidth}px)`;
    }

    animateBanner();
    content.addEventListener('transitionend', animateBanner);

    banner.addEventListener('mouseenter', () => {
        content.style.transition = 'none';
    });

    banner.addEventListener('mouseleave', () => {
        animateBanner();
    });
});
