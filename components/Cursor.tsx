import React, { useState, useEffect, useRef } from 'react';

const CURSOR_SPEED = 0.15;

const Cursor: React.FC = () => {
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    const mousePos = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, [role="button"], .cursor-pointer')) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, [role="button"], .cursor-pointer')) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseout', handleMouseOut);

        let animationFrameId: number;

        const animateCursor = () => {
            const { x: mouseX, y: mouseY } = mousePos.current;
            
            const dx = mouseX - ringPos.current.x;
            const dy = mouseY - ringPos.current.y;
            ringPos.current.x += dx * CURSOR_SPEED;
            ringPos.current.y += dy * CURSOR_SPEED;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
            }

            animationFrameId = requestAnimationFrame(animateCursor);
        };

        animateCursor();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div 
            ref={ringRef} 
            className={`cursor-ring ${isHovering ? 'hover' : ''}`}
        ></div>
    );
};

export default Cursor;
