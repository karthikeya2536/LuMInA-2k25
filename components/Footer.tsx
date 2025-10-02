import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-secondary/30 border-t border-brand-secondary mt-20">
      <div className="w-full px-6 py-16 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Branding */}
          <div>
            <Link to="/" className="text-3xl font-bold text-white mb-4 inline-block hover:text-brand-accent transition-colors duration-300">
              LuMInA <span className="text-brand-primary">2k25</span>
            </Link>
            <p className="text-brand-text-dark leading-relaxed max-w-xs">
              An exciting two-day festival where technology and creativity collide, hosted by the Department of AIML.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-brand-accent mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-brand-text-dark hover:text-brand-primary transition-colors">Home</Link></li>
              <li><Link to="/events" className="text-brand-text-dark hover:text-brand-primary transition-colors">Events</Link></li>
              <li><Link to="/gallery" className="text-brand-text-dark hover:text-brand-primary transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-brand-text-dark hover:text-brand-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
              
          {/* Column 3: Follow Us */}
          <div>
            <h4 className="text-lg font-semibold text-brand-accent mb-5 uppercase tracking-wider">Follow Us</h4>
            <div className="flex items-center space-x-6">
              <a href="#" aria-label="Twitter" className="text-brand-text-dark text-xl hover:text-brand-primary transition-colors"><FaTwitter /></a>
              <a href="#" aria-label="Facebook" className="text-brand-text-dark text-xl hover:text-brand-primary transition-colors"><FaFacebook /></a>
              <a href="#" aria-label="Instagram" className="text-brand-text-dark text-xl hover:text-brand-primary transition-colors"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn" className="text-brand-text-dark text-xl hover:text-brand-primary transition-colors"><FaLinkedin /></a>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-semibold text-brand-accent mb-5 uppercase tracking-wider">Contact</h4>
            <address className="not-italic space-y-4">
              <p className="text-brand-text-dark">St. Martin's Engineering College</p>
              <p>
                <a href="mailto:lumina2k25@gmail.com" className="text-brand-text-dark hover:text-brand-primary transition-colors">lumina2k25@gmail.com</a>
              </p>
              <p>
                 <a href="tel:+917993572969" className="text-brand-text-dark hover:text-brand-primary transition-colors">Sushanth: +91 79935 72969</a>
              </p>
              <p>
                <a href="tel:+917993066231" className="text-brand-text-dark hover:text-brand-primary transition-colors">Keerthi: +91 79930 66231</a>
              </p>
            </address>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-16 pt-8 border-t border-brand-secondary/50 text-center">
          <p className="text-brand-text-dark text-sm">
            &copy; {new Date().getFullYear()} LuMInA Fest. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;