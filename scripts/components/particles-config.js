/**
 * Particles config for contacts (and optionally index) page.
 * Changes that can affect smoothness (try reverting to compare):
 * 1. detectRetina: false — was true; false = less GPU work on retina, smoother.
 * 2. fps_limit: 60 — try 30 if still laggy.
 * 3. number.value: 100 — try 50–60 if still laggy.
 * 4. particles.shadow.enable / links.shadow — disable for less draw cost.
 * (Heaviest lag often from CSS: triangle-anim.css filter on #tsparticles canvas.)
 */
const particlesConfig = {
    fps_limit: 30, /* Lighter: try 30 to reduce CPU and smooth gaps */
    interactivity: {
        detectsOn: "canvas",
        events: {
            onClick: { enable: false },
            onHover: { enable: false },
            resize: true
        }
    },
    particles: {
        color: {
            value: "#ffffff"
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.6,
            width: 2,
            shadow: {
                enable: true,
                blur: 5,
                color: "#ffffff"
            }
        },
        move: {
            bounce: false,
            direction: "none",
            enable: true,
            outMode: "out",
            random: true,
            speed: 0.8,
            straight: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        },
        number: {
            density: { enable: true, area: 800 },
            value: 50 /* Lighter: try 50 or 60 if laggy */
        },
        opacity: {
            value: 0.7,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.3,
                sync: false
            }
        },
        shape: {
            type: ["circle", "triangle"], // Added triangle shapes!
            options: {
                triangle: {
                    sides: 3
                }
            }
        },
        size: {
            random: true,
            value: 6,
            anim: {
                enable: true,
                speed: 2,
                size_min: 2,
                sync: false
            }
        },
        shadow: {
            enable: true, /* Lighter: set false to reduce draw cost */
            blur: 10,
            color: "#ffffff"
        }
    },
    detectRetina: false, /* was true: 2x canvas on retina can cause lag; set true for sharper look */
    background: {
        color: "transparent"
    }
};

if (typeof window !== 'undefined') {
    window.particlesConfig = particlesConfig;
}