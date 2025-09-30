import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Registration } from '../types';
import { FaCheckCircle } from 'react-icons/fa';

interface ConfirmationPageProps {
  onNavigateToEvents: () => void;
  onNavigateHome: () => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row justify-between py-3 border-b border-brand-secondary">
    <p className="text-brand-text-dark font-semibold">{label}</p>
    <p className="text-white text-right">{value}</p>
  </div>
);

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ onNavigateToEvents, onNavigateHome }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const registration = location.state?.registration as Registration | undefined;

  useEffect(() => {
    if (!registration) {
      // If no registration data is passed, redirect to the events page.
      navigate('/events');
    }
  }, [registration, navigate]);

  if (!registration) {
    return null; // Render nothing while redirecting
  }
  
  const teamMembers = registration.teamMembers.map(m => m.fullName).join(', ');

  return (
    <div className="min-h-screen container mx-auto px-6 py-12 flex items-center justify-center animate-item-enter">
      <div className="max-w-2xl w-full bg-brand-secondary/50 p-8 rounded-xl shadow-lg border border-brand-secondary text-center">
        
        <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-6" />

        <h1 className="text-4xl font-bold text-white mb-2">Registration Confirmed!</h1>
        <p className="text-brand-text-dark mb-8">Thank you for registering. Here are your details:</p>

        <div className="text-left space-y-2 mb-10 bg-brand-bg/30 p-6 rounded-lg">
          <DetailRow label="Event" value={registration.event.eventName} />
          <DetailRow label="Participant(s)" value={teamMembers} />
          <DetailRow label="Tier" value={registration.selectedPriceTier} />
          <DetailRow label="Payment Status" value={
            <span className="bg-green-500/20 text-green-300 px-2 py-1 text-sm font-semibold rounded-full">{registration.paymentStatus}</span>
          } />
          <DetailRow label="Payment ID" value={<span className="font-mono text-sm">{registration.paymentId}</span>} />
          <DetailRow label="Registration ID" value={<span className="font-mono text-sm">{registration.id}</span>} />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
           <button 
            onClick={onNavigateToEvents}
            className="px-6 py-3 bg-brand-secondary text-white font-bold rounded-lg shadow-lg hover:bg-brand-secondary/80 transition-all duration-300 transform hover:scale-105"
          >
            Browse More Events
          </button>
          <button 
            onClick={onNavigateHome}
            className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-accent hover:text-brand-bg transition-all duration-300 transform hover:scale-105"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;