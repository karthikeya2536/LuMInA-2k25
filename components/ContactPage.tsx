import React from 'react';

interface ContactPageProps {
  onBack: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here.
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen container mx-auto px-6 py-12 animate-item-enter">
      <button onClick={onBack} className="mb-8 text-brand-accent hover:underline">
        &larr; Back to Home
      </button>
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">Contact Us</h1>
        <p className="text-lg text-brand-text-dark max-w-2xl mx-auto">
          Have questions or suggestions? We'd love to hear from you. Reach out to us through any of the channels below.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8 animate-form-section" style={{animationDelay: '100ms'}}>
          <div>
            <h3 className="text-xl font-bold text-brand-accent">Event Coordinators</h3>
            <p className="text-brand-text mt-2">For general inquiries and support.</p>
            <a href="mailto:lumina2k25@gmail.com" className="text-brand-text-dark hover:text-brand-accent transition-colors">lumina2k25@gmail.com</a>
            <p className="text-brand-text-dark mt-2">
              <a href="tel:+917993572969" className="hover:text-brand-accent transition-colors">Sushanth: +91 79935 72969</a>
            </p>
            <p className="text-brand-text-dark">
              <a href="tel:+917993066231" className="hover:text-brand-accent transition-colors">Keerthi: +91 79930 66231</a>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-accent">Venue</h3>
            <p className="text-brand-text-dark mt-2">St. Martin's Engineering College</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="animate-form-section" style={{animationDelay: '300ms'}}>
          <form onSubmit={handleSubmit} className="bg-brand-secondary/30 p-8 rounded-xl shadow-lg border border-brand-secondary space-y-6">
            <div className="form-group">
              <input type="text" id="contactName" name="contactName" className="form-input" placeholder=" " required />
              <label htmlFor="contactName" className="form-label">Your Name</label>
            </div>
            <div className="form-group">
              <input type="email" id="contactEmail" name="contactEmail" className="form-input" placeholder=" " required />
              <label htmlFor="contactEmail" className="form-label">Your Email</label>
            </div>
            <div className="form-group">
              <textarea id="message" name="message" rows={4} className="form-input" placeholder=" " required></textarea>
              <label htmlFor="message" className="form-label">Your Message</label>
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-accent hover:text-brand-bg transition-all duration-300 transform hover:scale-105">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;