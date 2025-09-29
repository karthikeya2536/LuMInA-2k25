import React from 'react';
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
              <li className="mb-2"><a href="#home" className="hover:text-[#F97316] transition-colors">Home</a></li>
              <li className="mb-2"><a href="#events" className="hover:text-[#F97316] transition-colors">Events</a></li>
              <li className="mb-2"><a href="#gallery" className="hover:text-[#F97316] transition-colors">Gallery</a></li>
              <li className="mb-2"><a href="#contact" className="hover:text-[#F97316] transition-colors">Contact</a></li>
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
            <p className="text-gray-400">lumina2k25@gmail.com</p>
            <p className="text-gray-400">8008799505</p>
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