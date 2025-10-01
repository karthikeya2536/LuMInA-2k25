import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import AboutSection from './AboutSection';
import CountdownTimer from './CountdownTimer';
import type { Event } from '../types';

interface HomePageProps {
  onNavigateToEvents: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToEvents }) => {
  const heroContentRef = useScrollReveal<HTMLDivElement>();
  const FEST_START_DATE = "2025-10-17T09:00:00";

  return (
    <>
      <section id="home-hero" className="h-screen flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-bg"></div>
        <div ref={heroContentRef} className="z-10 reveal">
           <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-wide animate-item-enter" style={{ animationDelay: '100ms' }}>
            LuMInA 2k25
          </h1>
          <p className="text-xl md:text-2xl text-brand-accent mt-4 font-mono animate-item-enter" style={{ animationDelay: '300ms'}}>October 17-18, 2025</p>
          
          <CountdownTimer targetDate={FEST_START_DATE} />

          <button 
            onClick={onNavigateToEvents}
            className="hero-button px-8 py-4 bg-brand-primary text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 animate-item-enter"
            style={{ animationDelay: '600ms'}}
          >
            Register Now
          </button>
        </div>
      </section>

      <AboutSection />
      
    </>
  );
};

export default HomePage;