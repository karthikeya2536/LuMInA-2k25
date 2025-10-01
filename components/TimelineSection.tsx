import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import type { Event } from '../types';

interface TimelineSectionProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

const TimelineEvent: React.FC<{ event: Event; onSelectEvent: (event: Event) => void; isLeft: boolean; delay: number }> = ({ event, onSelectEvent, isLeft, delay }) => {
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(' ', '');

  const content = (
    <div
      className="timeline-item-content group cursor-pointer"
      onClick={() => onSelectEvent(event)}
    >
      <span className="timeline-item-time">{formatTime(event.startTime)}</span>
      <h3 className="timeline-item-title">{event.eventName}</h3>
      <p className="timeline-item-venue">{event.venue}</p>
      <span className="timeline-item-cta">View Details &rarr;</span>
    </div>
  );

  return (
    <div
      className={`timeline-item animate-item-enter ${isLeft ? 'timeline-item-left' : 'timeline-item-right'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {content}
    </div>
  );
};

const TimelineSection: React.FC<TimelineSectionProps> = ({ events, onSelectEvent }) => {
  const sectionRef = useScrollReveal<HTMLElement>();

  const featuredEvents: Event[] = [
    events.find(e => e.eventName === "Opening Ceremony"),
    events.find(e => e.eventName === "TECHQUIT"),
    events.find(e => e.eventName === "TACTICAL SHOWDOWN"),
    events.find(e => e.eventName === "RANGASTALAM"),
    events.find(e => e.eventName === "Closing Ceremony"),
  ].filter(Boolean) as Event[]; // Filter out undefined if an event name changes

  const day1Events = featuredEvents.filter(e => e.day === 1);
  const day2Events = featuredEvents.filter(e => e.day === 2);
  let eventIndex = 0;

  return (
    <section id="timeline-section" ref={sectionRef} className="reveal container mx-auto px-6 py-20">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">Fest Timeline</h2>
        <p className="mt-4 text-lg text-brand-text-dark leading-relaxed">
          A glimpse into the key moments of LuMInA 2k25.
        </p>
      </div>
      
      <div className="timeline-container">
        {/* Day 1 */}
        <div className="timeline-header">
          <h3>Day 1 - Oct 17</h3>
        </div>
        {day1Events.map((event, index) => (
          <TimelineEvent
            key={event.id}
            event={event}
            onSelectEvent={onSelectEvent}
            isLeft={index % 2 === 0}
            delay={200 * eventIndex++}
          />
        ))}

        {/* Day 2 */}
        <div className="timeline-header">
          <h3>Day 2 - Oct 18</h3>
        </div>
        {day2Events.map((event, index) => (
          <TimelineEvent
            key={event.id}
            event={event}
            onSelectEvent={onSelectEvent}
            isLeft={index % 2 === 0}
            delay={200 * eventIndex++}
          />
        ))}
      </div>
    </section>
  );
};

export default TimelineSection;
