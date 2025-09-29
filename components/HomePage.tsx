import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import AboutSection from './AboutSection';
import { Link } from 'react-router-dom';


interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const heroContentRef = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <section id="home-hero" className="h-screen flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-bg"></div>
        <div ref={heroContentRef} className="z-10 reveal">
           <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-wide animate-item-enter" style={{ animationDelay: '100ms' }}>
            LuMInA 2k25
          </h1>
          <p className="text-xl md:text-2xl text-brand-accent mt-4 font-mono animate-item-enter" style={{ animationDelay: '300ms' }}>October 17-18, 2025</p>
          <br />
          <Link
            to="/register"
            className="hero-button px-8 py-4 bg-brand-primary text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 animate-item-enter"
            style={{ animationDelay: '500ms' }}
          >
            Register Now
          </Link>
        </div>
      </section>

      <AboutSection />


    </>
  );
};

export default HomePage;