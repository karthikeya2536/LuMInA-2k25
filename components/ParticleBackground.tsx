import React, { useRef, useEffect } from 'react';

// A thematic background: a digital circuit board with pulsing lights.
const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const GRID_SPACING = 40;
        const PULSE_SPEED = 2;
        const NUM_PULSES = 25;

        let points: { x: number; y: number }[][] = [];
        let paths: { p1: { x: number; y: number }; p2: { x: number; y: number } }[] = [];
        let pulses: { pathIndex: number; progress: number; speed: number }[] = [];
        
        const colors = {
            gridPoint: 'rgba(139, 148, 158, 0.2)', // brand-text-dark
            gridLine: 'rgba(139, 148, 158, 0.1)', // brand-text-dark
            pulse: '#DAA520', // brand-primary
        };

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            points = [];
            paths = [];
            pulses = [];

            const cols = Math.ceil(canvas.width / GRID_SPACING);
            const rows = Math.ceil(canvas.height / GRID_SPACING);

            // Create grid points
            for (let i = 0; i <= cols; i++) {
                points[i] = [];
                for (let j = 0; j <= rows; j++) {
                    points[i][j] = { x: i * GRID_SPACING, y: j * GRID_SPACING };
                }
            }
            
            // Create paths (circuits)
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const p1 = points[i][j];
                    if (Math.random() > 0.5 && i + 1 <= cols) { // Connect to right neighbor
                        const p2 = points[i+1][j];
                        paths.push({p1, p2});
                    }
                    if (Math.random() > 0.5 && j + 1 <= rows) { // Connect to bottom neighbor
                        const p2 = points[i][j+1];
                        paths.push({p1, p2});
                    }
                }
            }

            if (paths.length === 0) return; // ainty check

            // Create pulses
            for (let i = 0; i < NUM_PULSES; i++) {
                pulses.push({
                    pathIndex: Math.floor(Math.random() * paths.length),
                    progress: Math.random(),
                    speed: (Math.random() * 0.5 + 0.5) * PULSE_SPEED,
                });
            }
        };

        const draw = () => {
            // Fading effect by drawing a semi-transparent background
            ctx.fillStyle = 'rgba(13, 17, 23, 0.1)'; // brand-bg with alpha
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw grid lines
            ctx.strokeStyle = colors.gridLine;
            ctx.lineWidth = 0.5;
            paths.forEach(path => {
                ctx.beginPath();
                ctx.moveTo(path.p1.x, path.p1.y);
                ctx.lineTo(path.p2.x, path.p2.y);
                ctx.stroke();
            });

            // Draw grid points
            ctx.fillStyle = colors.gridPoint;
            for (let i = 0; i < points.length; i++) {
                for (let j = 0; j < points[i].length; j++) {
                    const point = points[i][j];
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Update and draw pulses
            pulses.forEach(pulse => {
                const path = paths[pulse.pathIndex];
                if (!path) return;

                const dx = path.p2.x - path.p1.x;
                const dy = path.p2.y - path.p1.y;
                const pathLength = Math.sqrt(dx*dx + dy*dy);

                if (pathLength === 0) return;

                pulse.progress += pulse.speed / pathLength;

                if (pulse.progress >= 1) {
                    pulse.progress = 0;
                    pulse.pathIndex = Math.floor(Math.random() * paths.length);
                }

                const currentX = path.p1.x + dx * pulse.progress;
                const currentY = path.p1.y + dy * pulse.progress;

                ctx.beginPath();
                ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
                ctx.fillStyle = colors.pulse;
                
                // Add glow effect
                ctx.shadowColor = colors.pulse;
                ctx.shadowBlur = 10;
                ctx.fill();

                // Reset shadow for other elements
                ctx.shadowBlur = 0;
            });
        };

        const animate = () => {
            draw();
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        window.addEventListener('resize', init);

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationFrameId);
        };

    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />;
};

export default ParticleBackground;
