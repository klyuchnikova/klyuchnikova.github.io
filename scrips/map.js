// Map JavaScript - Comprehensive map functionality
class CyberpunkMap {
    constructor() {
        this.map = document.getElementById('interactiveMap');
        this.markersContainer = document.getElementById('buildingMarkers');
        this.zoomLevel = 1;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.currentTranslate = { x: 0, y: 0 };
        this.maxZoom = 3;
        this.minZoom = 0.5;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createBuildingMarkers();
        this.setupZoomControls();
        this.setupFullscreen();
        this.setupResetView();
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

    updateMapTransform() {
        const transform = `translate(${this.currentTranslate.x}px, ${this.currentTranslate.y}px) scale(${this.zoomLevel})`;
        this.markersContainer.style.transform = transform;
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
        // Sample building data - you can replace this with your actual data
        const buildings = [
            {
                id: 'neontech-hq',
                name: 'NeonTech HQ',
                type: 'government',
                x: 20,
                y: 30,
                description: 'Corporate headquarters of NeonTech Corporation'
            },
            {
                id: 'cyber-market',
                name: 'Cyber Market',
                type: 'commercial',
                x: 60,
                y: 45,
                description: 'Underground marketplace for cybernetic enhancements'
            },
            {
                id: 'neon-dorms',
                name: 'Neon Dorms',
                type: 'residential',
                x: 35,
                y: 70,
                description: 'High-rise residential complex for corporate employees'
            },
            {
                id: 'data-factory',
                name: 'Data Factory',
                type: 'industrial',
                x: 80,
                y: 25,
                description: 'Industrial data processing facility'
            },
            {
                id: 'neural-clinic',
                name: 'Neural Clinic',
                type: 'government',
                x: 45,
                y: 55,
                description: 'Medical facility specializing in neural implants'
            },
            {
                id: 'street-vendors',
                name: 'Street Vendors',
                type: 'commercial',
                x: 25,
                y: 80,
                description: 'Street-level commercial district'
            }
        ];

        buildings.forEach(building => {
            this.createMarker(building);
        });
    }

    createMarker(building) {
        const marker = document.createElement('div');
        marker.className = 'location-marker';
        marker.id = building.id;
        marker.style.left = `${building.x}%`;
        marker.style.top = `${building.y}%`;
        marker.dataset.type = building.type;
        marker.dataset.description = building.description;

        // Create marker icon
        const icon = document.createElement('div');
        icon.className = 'marker-icon';
        marker.appendChild(icon);

        // Create neon sign
        const neonSign = document.createElement('div');
        neonSign.className = 'neon-sign';
        neonSign.textContent = building.name;
        marker.appendChild(neonSign);

        // Add click event
        marker.addEventListener('click', () => {
            this.showBuildingInfo(building);
        });

        // Add hover effects
        marker.addEventListener('mouseenter', () => {
            neonSign.style.opacity = '1';
            neonSign.style.transform = 'translateX(-50%) translateY(-5px)';
        });

        marker.addEventListener('mouseleave', () => {
            neonSign.style.opacity = '0';
            neonSign.style.transform = 'translateX(-50%)';
        });

        this.markersContainer.appendChild(marker);
    }

    showBuildingInfo(building) {
        // Create modal for building information
        const modal = document.createElement('div');
        modal.className = 'building-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid rgba(0, 200, 255, 0.6);
            border-radius: 8px;
            padding: 30px;
            max-width: 500px;
            color: white;
            font-family: 'PixelArt', monospace;
            text-align: center;
            position: relative;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: rgba(0, 200, 255, 0.8);
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
        `;

        const title = document.createElement('h2');
        title.textContent = building.name;
        title.style.cssText = `
            color: rgba(0, 200, 255, 0.9);
            margin-bottom: 20px;
            font-size: 1.8rem;
            text-transform: uppercase;
        `;

        const description = document.createElement('p');
        description.textContent = building.description;
        description.style.cssText = `
            line-height: 1.6;
            margin-bottom: 20px;
            font-size: 1rem;
        `;

        const type = document.createElement('div');
        type.textContent = `Type: ${building.type.charAt(0).toUpperCase() + building.type.slice(1)}`;
        type.style.cssText = `
            color: rgba(0, 200, 255, 0.7);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        `;

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(description);
        modalContent.appendChild(type);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
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