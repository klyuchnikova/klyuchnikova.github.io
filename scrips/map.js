// =============================================================================
// MAP BUILDINGS DATA – fixed pixel coordinates on the map images
// Schema per building: { id, name_capital, description, mobile: { x, y }, desktop: { x, y } }
// Coordinates are in pixels on mobile-maps.jpg (mobile) and desktop-maps.jpg (desktop).
// =============================================================================

const MAP_IMAGES = {
    mobile: { width: 1080, height: 1920 },   // mobile-maps.jpg dimensions (px)
    desktop: { width: 1920, height: 1080 }   // desktop-maps.jpg dimensions (px)
};

const MAP_BUILDINGS = [
    { id: 'b1', name_capital: 'BC TEIS', description: 'Главное здание Оракула', mobile: { x: 378, y: 1344 }, desktop: { x: 948, y: 353 } },
    { id: 'b2', name_capital: 'NeoTech HQ', description: 'Corporate headquarters of NeonTech Corporation', mobile: { x: 270, y: 480 }, desktop: { x: 726, y: 612 } },
    { id: 'b3', name_capital: 'Neon Light Bar', description: 'Один из множества баров. Известен благодаря своки концертам', mobile: { x: 486, y: 1056 }, desktop: { x: 1174, y: 670 } },
    { id: 'b4', name_capital: 'Street Vendors', description: 'Street-level commercial district', mobile: { x: 270, y: 1536 }, desktop: { x: 480, y: 864 } }
];

// =============================================================================
// Map JavaScript - Points fixed to map image pixel coordinates
// =============================================================================

const MOBILE_BREAKPOINT = 768;
const PARALLAX_FACTOR = 0.2;  // full-page background moves slower, same direction

class CyberpunkMap {
    constructor() {
        this.map = document.getElementById('interactiveMap');
        this.mapInner = document.getElementById('mapInner');
        this.markersContainer = document.getElementById('buildingMarkers');
        this.bgImage = document.querySelector('.map-bg-image');
        this.zoomLevel = 1;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.currentTranslate = { x: 0, y: 0 };
        this.maxZoom = 3;
        this.minZoom = 1;  // can't zoom out past map filling the frame
        this.isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
        window.cyberpunkMap = this;
        this.init();
    }

    init() {
        this.setMapAspectRatio();
        this.setupEventListeners();
        this.createBuildingMarkers();
        this.setupZoomControls();
        this.setupFullscreen();
        this.setupResetView();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    isMobileView() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    getCurrentImageConfig() {
        return this.isMobileView() ? MAP_IMAGES.mobile : MAP_IMAGES.desktop;
    }

    setMapAspectRatio() {
        const cfg = this.getCurrentImageConfig();
        this.map.style.aspectRatio = `${cfg.width} / ${cfg.height}`;
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = this.isMobileView();
        this.setMapAspectRatio();
        if (wasMobile !== this.isMobile) {
            this.updateMarkerPositions();
        } else {
            this.updateMarkerPositions();
        }
    }

    setupEventListeners() {
        // Mouse events for dragging
        this.map.addEventListener('mousedown', this.startDragging.bind(this));
        this.map.addEventListener('mousemove', this.drag.bind(this));
        this.map.addEventListener('mouseup', this.stopDragging.bind(this));
        this.map.addEventListener('mouseleave', this.stopDragging.bind(this));

        // Touch events for mobile
        this.map.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.map.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.map.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Wheel event for zooming
        this.map.addEventListener('wheel', this.handleWheel.bind(this));

        // Prevent context menu
        this.map.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    startDragging(e) {
        this.isDragging = true;
        this.dragStart = {
            x: e.clientX || e.touches[0].clientX,
            y: e.clientY || e.touches[0].clientY
        };
        this.map.style.cursor = 'grabbing';
    }

    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const currentX = e.clientX || e.touches[0].clientX;
        const currentY = e.clientY || e.touches[0].clientY;
        
        const deltaX = currentX - this.dragStart.x;
        const deltaY = currentY - this.dragStart.y;
        
        this.currentTranslate.x += deltaX;
        this.currentTranslate.y += deltaY;
        
        this.updateMapTransform();
        
        this.dragStart = { x: currentX, y: currentY };
    }

    stopDragging() {
        this.isDragging = false;
        this.map.style.cursor = 'grab';
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.startDragging(e);
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 1) {
            this.drag(e);
        }
    }

    handleTouchEnd() {
        this.stopDragging();
    }

    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(delta, e.offsetX, e.offsetY);
    }

    zoom(factor, centerX = null, centerY = null) {
        const oldZoom = this.zoomLevel;
        this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel * factor));
        
        if (this.zoomLevel === oldZoom) return;

        // Calculate zoom center
        if (centerX === null) {
            centerX = this.map.offsetWidth / 2;
            centerY = this.map.offsetHeight / 2;
        }

        // Adjust translation to zoom towards cursor
        const zoomRatio = this.zoomLevel / oldZoom;
        this.currentTranslate.x = centerX - (centerX - this.currentTranslate.x) * zoomRatio;
        this.currentTranslate.y = centerY - (centerY - this.currentTranslate.y) * zoomRatio;

        this.updateMapTransform();
        this.updateMarkerSizes();
    }

    getTranslateBounds() {
        const w = this.map.offsetWidth;
        const h = this.map.offsetHeight;
        const s = this.zoomLevel;
        return {
            xMin: w * (1 - s),
            xMax: 0,
            yMin: h * (1 - s),
            yMax: 0
        };
    }

    updateMapTransform() {
        const b = this.getTranslateBounds();
        this.currentTranslate.x = Math.max(b.xMin, Math.min(b.xMax, this.currentTranslate.x));
        this.currentTranslate.y = Math.max(b.yMin, Math.min(b.yMax, this.currentTranslate.y));
        const tx = this.currentTranslate.x;
        const ty = this.currentTranslate.y;
        const transform = `translate(${tx}px, ${ty}px) scale(${this.zoomLevel})`;
        this.mapInner.style.transform = transform;
        this.markersContainer.style.transform = 'none';
        if (this.bgImage) {
            const px = tx * PARALLAX_FACTOR;
            const py = ty * PARALLAX_FACTOR;
            this.bgImage.style.transform = `translate(${px}px, ${py}px)`;
        }
    }

    updateMarkerSizes() {
        const markers = document.querySelectorAll('.location-marker');
        markers.forEach(marker => {
            const baseSize = 40; // Base size from CSS
            const newSize = baseSize * this.zoomLevel;
            marker.style.width = `${newSize}px`;
            marker.style.height = `${newSize}px`;
        });
    }

    setupZoomControls() {
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');

        zoomIn.addEventListener('click', () => {
            this.zoom(1.2);
        });

        zoomOut.addEventListener('click', () => {
            this.zoom(0.8);
        });
    }

    setupResetView() {
        const resetBtn = document.getElementById('resetView');
        resetBtn.addEventListener('click', () => {
            this.zoomLevel = 1;
            this.currentTranslate = { x: 0, y: 0 };
            this.updateMapTransform();
            this.updateMarkerSizes();
        });
    }

    setupFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreen');
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                fullscreenBtn.textContent = '⛶';
            } else {
                document.exitFullscreen();
                fullscreenBtn.textContent = '⛶';
            }
        });
    }

    createBuildingMarkers() {
        MAP_BUILDINGS.forEach(building => {
            this.createMarker(building);
        });
        this.updateMarkerPositions();
    }

    updateMarkerPositions() {
        const cfg = this.getCurrentImageConfig();
        const isMobile = this.isMobileView();
        this.markersContainer.querySelectorAll('.location-marker').forEach((el, i) => {
            const building = MAP_BUILDINGS[i];
            if (!building) return;
            const coords = isMobile ? building.mobile : building.desktop;
            const leftPct = (coords.x / cfg.width) * 100;
            const topPct = (coords.y / cfg.height) * 100;
            el.style.left = `${leftPct}%`;
            el.style.top = `${topPct}%`;
        });
    }

    createMarker(building) {
        const marker = document.createElement('div');
        marker.className = 'location-marker';
        marker.id = building.id;
        marker.dataset.description = building.description;

        // Create marker icon
        const icon = document.createElement('div');
        icon.className = 'marker-icon';
        marker.appendChild(icon);

        // Create neon sign (name_capital)
        const neonSign = document.createElement('div');
        neonSign.className = 'neon-sign';
        neonSign.textContent = building.name_capital;
        marker.appendChild(neonSign);

        // Add click event – toggle pin popup (name + description) above marker
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMarkerPopup(marker, building);
        });

        this.markersContainer.appendChild(marker);
    }

    closeAnyMarkerPopup() {
        document.querySelectorAll('.marker-popup').forEach(el => el.remove());
    }

    toggleMarkerPopup(markerEl, building) {
        const existing = markerEl.querySelector('.marker-popup');
        if (existing) {
            existing.remove();
            return;
        }
        this.closeAnyMarkerPopup();
        const popup = document.createElement('div');
        popup.className = 'marker-popup';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'marker-popup-close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.textContent = '×';
        const title = document.createElement('div');
        title.className = 'marker-popup-title';
        title.textContent = building.name_capital;
        const desc = document.createElement('p');
        desc.className = 'marker-popup-desc';
        desc.textContent = building.description;
        const closeOnMapClick = (e) => {
            if (!markerEl.contains(e.target)) {
                popup.remove();
                document.removeEventListener('click', closeOnMapClick);
            }
        };
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.remove();
            document.removeEventListener('click', closeOnMapClick);
        });
        popup.appendChild(closeBtn);
        popup.appendChild(title);
        popup.appendChild(desc);
        markerEl.appendChild(popup);
        setTimeout(() => document.addEventListener('click', closeOnMapClick), 0);
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberpunkMap();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const map = window.cyberpunkMap;
    if (!map) return;

    switch(e.key) {
        case '+':
        case '=':
            e.preventDefault();
            map.zoom(1.2);
            break;
        case '-':
            e.preventDefault();
            map.zoom(0.8);
            break;
        case '0':
            e.preventDefault();
            map.zoomLevel = 1;
            map.currentTranslate = { x: 0, y: 0 };
            map.updateMapTransform();
            map.updateMarkerSizes();
            break;
        case 'Escape':
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
});