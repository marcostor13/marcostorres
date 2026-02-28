export interface ParticlesConfig {
    particles: {
        color: string;
        color_random: boolean;
        shape: 'circle' | 'edge' | 'triangle';
        opacity: {
            opacity: number;
            anim: {
                enable: boolean;
                speed: number;
                opacity_min: number;
                sync: boolean;
            };
        };
        size: number;
        size_random: boolean;
        nb: number;
        line_linked: {
            enable_auto: boolean;
            distance: number;
            color: string;
            opacity: number;
            width: number;
            condensed_mode: {
                enable: boolean;
                rotateX: number;
                rotateY: number;
            };
        };
        anim: {
            enable: boolean;
            speed: number;
        };
    };
    interactivity: {
        enable: boolean;
        mouse: {
            distance: number;
        };
        detect_on: 'canvas' | 'window';
        mode: 'grab' | false;
        line_linked: {
            opacity: number;
        };
        events: {
            onclick: {
                enable: boolean;
                mode: 'push' | 'remove';
                nb: number;
            };
            onresize: {
                enable: boolean;
                mode: 'out' | 'bounce';
                density_auto: boolean;
                density_area: number;
            };
        };
    };
    retina_detect: boolean;
} 