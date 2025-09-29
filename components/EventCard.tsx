import React, { useEffect, useRef } from 'react';
import type { Event } from '../types';

// Declare VanillaTilt to TypeScript
declare global {
  interface Window {
    VanillaTilt: any;
  }
}

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const tiltRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = tiltRef.current;
    if (element) {
      window.VanillaTilt.init(element, {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        perspective: 1000,
        scale: 1.02,
      });

      const handleMouseMove = (e: MouseEvent) => {
        if (glowRef.current) {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          glowRef.current.style.setProperty('--mouse-x', `${x}px`);
          glowRef.current.style.setProperty('--mouse-y', `${y}px`);
        }
      };

      element.addEventListener('mousemove', handleMouseMove);

      return () => {
        // FIX: The vanilla-tilt library dynamically adds the `vanillaTilt` property to the
        // DOM element, which TypeScript doesn't know about. Casting to `any` allows us to
        // access `destroy()` for cleanup without a compile-time error.
        (element as any).vanillaTilt.destroy();
        element.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div ref={tiltRef} className="card-3d-wrapper bg-brand-secondary rounded-lg" onClick={onClick}>
      <div className="card-3d-inner rounded-lg overflow-hidden shadow-lg cursor-pointer group w-full h-full">
        <div ref={glowRef} className="card-3d-glow"></div>
        <div className="relative z-10">
          <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" src={event.imageUrl} alt={event.eventName} />
          <div className="p-4 bg-brand-secondary/80 backdrop-blur-sm">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${event.category === 'Technical' ? 'bg-blue-500/20 text-blue-300' : event.category === 'Cultural' ? 'bg-pink-500/20 text-pink-300' : 'bg-green-500/20 text-green-300'}`}>
              {event.category}
            </span>
            <h3 className="text-xl font-bold text-white mb-1">{event.eventName}</h3>
            <p className="text-brand-text-dark">Day {event.day}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;