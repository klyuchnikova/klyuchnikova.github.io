document.addEventListener('DOMContentLoaded', function() {
    // Inject reusable arrow SVG into each .btn-icon-arrow (from template)
    const arrowTemplate = document.getElementById('arrow-icon-svg');
    if (arrowTemplate && arrowTemplate.content) {
        document.querySelectorAll('.btn-icon-arrow').forEach(function(container) {
            if (container.children.length === 0) {
                container.appendChild(arrowTemplate.content.cloneNode(true));
            }
        });
    }

    // ----------  Vertical news feed: hero in center, snap, four states  ----------
    const feed = document.querySelector('.news-feed');
    const viewport = document.querySelector('.news-feed-viewport');
    const track = document.querySelector('.news-feed-track');
    const items = track ? track.querySelectorAll('.news-feed-item') : [];

    /**
     * Card hexagon: same as clip-path polygon(40% 0, 100% 0, 100% 92%, 60% 100%, 0 100%, 0 8%)
     * Vertices in % of card width/height: [x%, y%]
     */
    const CARD_HEXAGON_PERCENT = [
        [40, 0], [100, 0], [100, 92], [60, 100], [0, 100], [0, 8]
    ];

    /**
     * Get the 4 edges we use: top (0), bottom-right (2), bottom (3), top-left (5).
     * Skip vertical left (4) and vertical right (1).
     * Returns edges with geometry and outward shift so strip borders touch the hexagon.
     */
    var FRAME_EDGE_INDICES = [0, 5, 2, 3];

    function getCardHexagonEdges(cardEl) {
        var rect = cardEl.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        var left = rect.left;
        var top = rect.top;
        var centerX = left + w / 2;
        var centerY = top + h / 2;

        var vertices = CARD_HEXAGON_PERCENT.map(function(p) {
            return {
                x: left + (p[0] / 100) * w,
                y: top + (p[1] / 100) * h
            };
        });

        var allEdges = [];
        for (var i = 0; i < 6; i++) {
            var v1 = vertices[i];
            var v2 = vertices[(i + 1) % 6];
            var dx = v2.x - v1.x;
            var dy = v2.y - v1.y;
            var length = Math.sqrt(dx * dx + dy * dy);
            var angleRad = Math.atan2(dy, dx);
            var angleDeg = (angleRad * 180 / Math.PI);
            var midX = (v1.x + v2.x) / 2;
            var midY = (v1.y + v2.y) / 2;
            var perpX = -dy / length;
            var perpY = dx / length;
            var toCenterX = centerX - midX;
            var toCenterY = centerY - midY;
            var outwardX = perpX;
            var outwardY = perpY;
            if (perpX * toCenterX + perpY * toCenterY > 0) {
                outwardX = -perpX;
                outwardY = -perpY;
            }
            allEdges.push({
                x1: v1.x, y1: v1.y, x2: v2.x, y2: v2.y,
                length: length, angleDeg: angleDeg, index: i,
                midX: midX, midY: midY, outwardX: outwardX, outwardY: outwardY
            });
        }
        return FRAME_EDGE_INDICES.map(function(i) {
            var e = allEdges[i];
            e.index = i;
            return e;
        });
    }

    /**
     * Place 4 warning banners: two along top edges, two along bottom edges.
     * All on top layer; keep angle and vertical position (midY), but stretch from left to right screen border.
     * Shift by half strip height so strip border touches hexagon; extra nudge for bottom edges so they don't cut.
     */
    var BANNER_HEIGHT = 24;
    var HALF_STRIP = BANNER_HEIGHT / 2;
    var EXTRA_OUTWARD_BOTTOM = 4;
    var TILTED_EXTRA_DOWN = -14;
    var EXTRA_LENGTH = 20;

    function placeWarningBannersAroundCard(cardEl) {
        var edges = getCardHexagonEdges(cardEl);
        var viewWidth = window.innerWidth;
        var container = document.getElementById('warning-banner-frame');
        if (!container) {
            container = document.createElement('div');
            container.id = 'warning-banner-frame';
            container.className = 'warning-banner-frame';
            container.setAttribute('aria-hidden', 'true');
            document.body.appendChild(container);
        }
        container.innerHTML = '';

        /* Fifth strip: top, tilted 30° right, full width (touches both sides), behind the card, same animation */
        var EXTRA_ANGLE_DEG = 15;
        var extraAngleRad = EXTRA_ANGLE_DEG * Math.PI / 180;
        var extraCos = Math.cos(extraAngleRad);
        var extraStripLength = viewWidth / Math.abs(extraCos) + EXTRA_LENGTH;
        var cardRect = cardEl.getBoundingClientRect();
        var extraMidY = cardRect.top - 0.3 * cardRect.height;
        var backContainer = document.getElementById('warning-banner-frame-back');
        if (!backContainer) {
            backContainer = document.createElement('div');
            backContainer.id = 'warning-banner-frame-back';
            backContainer.className = 'warning-banner-frame warning-banner-frame--back';
            backContainer.setAttribute('aria-hidden', 'true');
            document.body.insertBefore(backContainer, document.body.firstChild);
        }
        backContainer.innerHTML = '';
        var extraBanner = document.createElement('div');
        extraBanner.className = 'warning-banner warning-banner--frame-edge warning-banner--frame-extra-top warning-banner--stripes-move';
        extraBanner.style.left = -EXTRA_LENGTH/2 + 'px';
        extraBanner.style.top = (extraMidY - BANNER_HEIGHT / 2) + 'px';
        extraBanner.style.width = extraStripLength + 'px';
        extraBanner.style.setProperty('--frame-angle', EXTRA_ANGLE_DEG + 'deg');
        extraBanner.innerHTML = '<div class="warning-banner__edge"></div>' +
            '<div class="warning-banner__inner"><div class="warning-banner__text-track">' +
            '<span class="warning-banner__text">RECENT NEWS</span><span class="warning-banner__text">RECENT NEWS</span>' +
            '</div></div>' +
            '<div class="warning-banner__edge warning-banner__edge--bottom"></div>';
        backContainer.appendChild(extraBanner);
        backContainer.classList.remove('warning-banner-frame--disappearing');
        backContainer.classList.add('warning-banner-frame--appearing');

        edges.forEach(function(edge, i) {
            var isBottom = (i === 2 || i === 3);
            var isTilted = (i === 1 || i === 2);
            var shift = HALF_STRIP + (isBottom ? EXTRA_OUTWARD_BOTTOM : 0);
            var midY = edge.midY + edge.outwardY * shift;
            if (isTilted && i==2) midY += TILTED_EXTRA_DOWN;
            if (isTilted && i==1) midY -= TILTED_EXTRA_DOWN;
            var angleRad = edge.angleDeg * Math.PI / 180;
            var cosA = Math.cos(angleRad);
            var stripLength = Math.abs(cosA) < 0.001 ? viewWidth : viewWidth / Math.abs(cosA);
            stripLength += EXTRA_LENGTH;
            var centerX = viewWidth / 2;
            var banner = document.createElement('div');
            var reverseClass = (i === 1 || i === 3) ? ' warning-banner--stripes-reverse' : '';
            var rollRightClass = isBottom ? ' warning-banner--frame-roll-right' : '';
            banner.className = 'warning-banner warning-banner--frame-edge warning-banner--stripes-move warning-banner--frame-z' + (i + 1) + reverseClass + rollRightClass;
            /* Same position for all: strip spans centerX ± L/2; bottom strips use transform-origin right center so they roll from right */
            banner.style.left = (centerX - stripLength / 2) + 'px';
            banner.style.top = (midY - BANNER_HEIGHT / 2) + 'px';
            banner.style.width = stripLength + 'px';
            /* Normalize angle to -90..90 so no strip is turned 180° (text stays readable) */
            var frameAngle = edge.angleDeg;
            while (frameAngle > 90) frameAngle -= 180;
            while (frameAngle < -90) frameAngle += 180;
            banner.style.setProperty('--frame-angle', frameAngle + 'deg');
            banner.innerHTML = '<div class="warning-banner__edge"></div>' +
                '<div class="warning-banner__inner"><div class="warning-banner__text-track">' +
                '<span class="warning-banner__text">RECENT NEWS</span><span class="warning-banner__text">RECENT NEWS</span>' +
                '</div></div>' +
                '<div class="warning-banner__edge warning-banner__edge--bottom"></div>';
            container.appendChild(banner);
        });
        container.classList.remove('warning-banner-frame--disappearing');
        container.classList.add('warning-banner-frame--appearing');
    }

    var frameDisappearTimer = null;
    var FRAME_DISAPPEAR_MS = 350;

    function clearWarningBannerFrame() {
        if (frameDisappearTimer) {
            clearTimeout(frameDisappearTimer);
            frameDisappearTimer = null;
        }
        var container = document.getElementById('warning-banner-frame');
        if (container) {
            container.innerHTML = '';
            container.classList.remove('warning-banner-frame--appearing', 'warning-banner-frame--disappearing');
        }
        var backContainer = document.getElementById('warning-banner-frame-back');
        if (backContainer) {
            backContainer.innerHTML = '';
            backContainer.classList.remove('warning-banner-frame--appearing', 'warning-banner-frame--disappearing');
        }
    }

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
            if (heroIndex === 0) {
                if (frameDisappearTimer) {
                    clearTimeout(frameDisappearTimer);
                    frameDisappearTimer = null;
                }
                var container = document.getElementById('warning-banner-frame');
                var backContainer = document.getElementById('warning-banner-frame-back');
                if (container && container.classList.contains('warning-banner-frame--disappearing')) {
                    container.classList.remove('warning-banner-frame--disappearing');
                }
                if (backContainer && backContainer.classList.contains('warning-banner-frame--disappearing')) {
                    backContainer.classList.remove('warning-banner-frame--disappearing');
                }
                /* Place only when scroll has settled at target (card in final position), not while smooth scroll is in progress */
                var scrollSettled = Math.abs(viewport.scrollTop - targetScroll) <= 2;
                var frameAlreadyVisible = container && container.children.length > 0 && !container.classList.contains('warning-banner-frame--disappearing');
                if (!frameAlreadyVisible && scrollSettled) {
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            placeWarningBannersAroundCard(item);
                        });
                    });
                }
            } else {
                /* Disappear already triggered in onScroll when first card left center */
            }
        }

        function onScroll() {
            var heroIndex = getClosestIndex();
            assignStates(heroIndex, true);
            /* Disappear banners the moment user starts scrolling (frame visible) */
            var container = document.getElementById('warning-banner-frame');
            var backContainer = document.getElementById('warning-banner-frame-back');
            var hasFrame = (container && container.children.length > 0) || (backContainer && backContainer.children.length > 0);
            var notYetDisappearing = (!container || !container.classList.contains('warning-banner-frame--disappearing'));
            if (hasFrame && notYetDisappearing) {
                if (container) container.classList.add('warning-banner-frame--disappearing');
                if (backContainer) backContainer.classList.add('warning-banner-frame--disappearing');
                if (frameDisappearTimer) clearTimeout(frameDisappearTimer);
                frameDisappearTimer = setTimeout(clearWarningBannerFrame, FRAME_DISAPPEAR_MS);
            }
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
        /* Frame strips appear only when first card is centered after snap (see snapToClosest). */
    }

    // Flip card functionality – single bar button: READ MORE opens, BACK closes
    const flipCards = document.querySelectorAll('.square-flip');

    flipCards.forEach(card => {
        const barBtn = card.querySelector('.bar-toggle-btn');
        if (!barBtn) return;

        barBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (card.classList.contains('flipped')) {
                card.classList.remove('flipped');
                barBtn.classList.remove('is-opening');
            } else {
                barBtn.classList.add('is-opening');
                card.classList.add('flipped');
            }
        });

        card.addEventListener('click', (e) => {
            if (e.target.closest('.bar-toggle-btn')) return;
            if (card.classList.contains('flipped')) {
                card.classList.remove('flipped');
                barBtn.classList.remove('is-opening');
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
