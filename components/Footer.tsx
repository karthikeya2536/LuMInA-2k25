import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d1117] text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-bold text-[#F97316] mb-4">Lumina Fest 2025</h3>
            <p className="text-gray-400">
              The premier festival of light, art, and technology. Join us for an unforgettable experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-8 md:mb-0">
            <h4 className="text-lg font-semibold text-[#FBBF24] mb-4">Quick Links</h4>
            <ul>
              <li className="mb-2"><Link to="/" className="hover:text-[#F97316] transition-colors">Home</Link></li>
              <li className="mb-2"><Link to="/events" className="hover:text-[#F97316] transition-colors">Events</Link></li>
              <li className="mb-2"><Link to="/gallery" className="hover:text-[#F97316] transition-colors">Gallery</Link></li>
              <li className="mb-2"><Link to="/contact" className="hover:text-[#F97316] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="mb-8 md:mb-0">
            <h4 className="text-lg font-semibold text-[#FBBF24] mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-[#F97316] transition-colors"><FaTwitter /></a>
              <a href="#" className="text-2xl hover:text-[#F97316] transition-colors"><FaFacebook /></a>
              <a href="#" className="text-2xl hover:text-[#F97316] transition-colors"><FaInstagram /></a>
              <a href="#" className="text-2xl hover:text-[#F97316] transition-colors"><FaLinkedin /></a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-[#FBBF24] mb-4">Contact Us</h4>
            <p className="text-gray-400">AIML Department</p>
            <a href="mailto:lumina2k25@gmail.com" className="text-gray-400 block hover:text-[#F97316] transition-colors">lumina2k25@gmail.com</a>
            <a href="tel:+918008799505" className="text-gray-400 block hover:text-[#F97316] transition-colors">8008799505</a>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Lumina Fest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;