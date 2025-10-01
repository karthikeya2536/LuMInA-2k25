import React from 'react';
import type { Page } from '../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {

  const NavLink: React.FC<{ page: Page; children: React.ReactNode }> = ({ page, children }) => (
    <button 
      onClick={() => onNavigate(page)} 
      className="text-brand-text hover:text-brand-accent transition-colors duration-300 px-3 py-2"
    >
      {children}
    </button>
  );

  return (
    <header className="bg-brand-secondary/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-brand-primary/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button 
          className="text-3xl font-bold text-white cursor-pointer hover:text-brand-accent transition-colors duration-300"
          onClick={() => onNavigate('home')}
        >
          <img src="../assets/logo.png" alt="Lumina Fest 2025 Logo" className="h-24" />
        </button>
        <nav className="hidden md:flex items-center space-x-4">
          <NavLink page="home">Home</NavLink>
          <NavLink page="events">Events</NavLink>
          <NavLink page="schedule">Schedule</NavLink>
          <NavLink page="gallery">Gallery</NavLink>
          <NavLink page="contact">Contact Us</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;