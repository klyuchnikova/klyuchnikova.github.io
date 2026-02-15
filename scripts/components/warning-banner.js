/**
 * Warning banner – stripe movement (optional) and roll-in trigger.
 * Listen for custom event 'warning-banner-roll-in' to run the roll-in animation.
 * Optionally trigger roll-in once on load (see below).
 */
(function () {
    function init() {
        var banner = document.querySelector('.warning-banner');
        if (!banner) return;

        document.addEventListener('warning-banner-roll-in', function () {
            banner.classList.remove('warning-banner--initially-hidden');
            banner.classList.add('warning-banner--roll-in');
        });

        // Optional: roll in once after a short delay (remove or comment out if you only want manual trigger)
        setTimeout(function () {
            document.dispatchEvent(new CustomEvent('warning-banner-roll-in'));
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
