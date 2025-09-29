import React from 'react';
import type { Event } from '../types';

interface EventDetailsPageProps {
  event: Event;
  onRegister: () => void;
  onBack: () => void;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-sm font-bold text-brand-accent uppercase">{label}</p>
    <p className="text-lg text-brand-text">{value}</p>
  </div>
);

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ event, onRegister, onBack }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  const eventTime = `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;

  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
      <button onClick={onBack} className="mb-8 text-brand-accent hover:underline animate-item-enter">
        &larr; Back to All Events
      </button>
      <div className="lg:flex gap-12">
        <div className="lg:w-1/2 animate-item-enter" style={{ animationDelay: '100ms' }}>
          <img src={event.imageUrl} alt={event.eventName} className="rounded-lg shadow-lg w-full object-cover aspect-video" />
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <h1 className="text-5xl font-extrabold mb-4 animate-item-enter bg-clip-text text-transparent bg-gradient-to-br from-white to-brand-accent drop-shadow-[0_2px_4px_rgba(249,115,22,0.4)]" style={{ animationDelay: '200ms' }}>{event.eventName}</h1>
          <p className="text-brand-text-dark text-lg mb-6 animate-item-enter" style={{ animationDelay: '300ms' }}>{event.description}</p>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 bg-brand-secondary/50 p-6 rounded-lg animate-item-enter" style={{ animationDelay: '400ms' }}>
            <DetailItem label="Day" value={`Day ${event.day} (October ${16 + event.day}, 2025)`} />
            <DetailItem label="Time" value={eventTime} />
            <DetailItem label="Venue" value={event.venue} />
            <DetailItem label="Category" value={event.category} />
          </div>

          <div className="animate-item-enter" style={{ animationDelay: '500ms' }}>
            <p className="text-sm font-bold text-brand-accent uppercase mb-2">Pricing Tiers</p>
            <ul className="list-disc list-inside text-lg text-brand-text">
              {event.pricingTiers.map((tier, index) => (
                <li key={index}>{tier}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={onRegister}
            className="mt-10 w-full px-8 py-4 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-accent hover:text-brand-bg transition-all duration-300 transform hover:scale-105 animate-item-enter"
            style={{ animationDelay: '600ms' }}
          >
            Register for this Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;