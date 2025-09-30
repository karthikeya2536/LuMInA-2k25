import React from 'react';
import type { Event } from '../types';
import EventCard from './EventCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface EventsPageProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onBack: () => void;
}

const EventsPage: React.FC<EventsPageProps> = ({ events, onSelectEvent, onBack }) => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const registrableEvents = events.filter(event => !event.scheduleOnly);

  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
      <button onClick={onBack} className="mb-8 text-brand-accent hover:underline animate-item-enter">
        &larr; Back to Home
      </button>
      <section id="events-section" ref={sectionRef} className="reveal">
        <h1 className="text-5xl font-extrabold text-center text-white mb-12">Explore All Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registrableEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;