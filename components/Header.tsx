import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0d1117] shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-bold text-white cursor-pointer hover:text-[#FBBF24] transition-colors duration-300"
        >
          Lumina Fest
        </Link>
        <nav className="hidden md:flex items-center space-x-2">
          <Link to="/" className="text-white hover:text-[#FBBF24] transition-colors duration-300 px-3 py-2">Home</Link>
          <Link to="/events" className="text-white hover:text-[#FBBF24] transition-colors duration-300 px-3 py-2">Events</Link>
          <Link to="/gallery" className="text-white hover:text-[#FBBF24] transition-colors duration-300 px-3 py-2">Gallery</Link>
          <Link to="/contact" className="text-white hover:text-[#FBBF24] transition-colors duration-300 px-3 py-2">Contact</Link>
          <Link
            to="/events"
            className="bg-[#F97316] text-white font-bold py-2 px-4 rounded-full hover:bg-[#FBBF24] transition-colors duration-300"
          >
            Register Now
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;