import React from 'react';
import type { Event } from '../types';

interface SchedulePageProps {
  events: Event[];
  onBack: () => void;
  onSelectEvent: (event: Event) => void;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const DaySchedule: React.FC<{
  day: number;
  date: string;
  dayEvents: Event[];
  onSelectEvent: (event: Event) => void;
}> = ({ day, date, dayEvents, onSelectEvent }) => (
  <div className="mb-16">
    <h2 className="text-4xl font-extrabold text-center text-white mb-12 animate-item-enter">
      Day {day} - <span className="text-brand-accent">{date}</span>
    </h2>
    <div className="relative max-w-4xl mx-auto">
      {/* The vertical line */}
      <div className="absolute top-0 h-full w-1 bg-brand-secondary left-4 md:left-1/2 md:-translate-x-1/2"></div>
      {dayEvents.map((event, index) => {
        const isRightOnDesktop = index % 2 !== 0;
        const isClickable = !event.scheduleOnly;
        return (
          <div key={event.id} className="relative pl-12 md:pl-0 mb-8 animate-item-enter" style={{ animationDelay: `${100 + index * 50}ms` }}>
            {/* Dot */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-1/2 md:-translate-x-1/2 w-5 h-5 bg-brand-accent rounded-full border-4 border-brand-bg z-10"></div>
            {/* Content Card */}
            <div className={`md:flex items-center ${isRightOnDesktop ? 'md:flex-row-reverse' : ''}`}>
              {/* Spacer */}
              <div className="md:w-1/2"></div>
              <div className="md:w-1/2">
                <div 
                  onClick={isClickable ? () => onSelectEvent(event) : undefined}
                  className={`p-4 rounded-lg bg-brand-secondary/50 border border-brand-secondary transition-all duration-300 hover:border-brand-primary/50 hover:bg-brand-secondary/80 hover:shadow-lg hover:shadow-brand-primary/20 transform hover:-translate-y-1 ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${isRightOnDesktop ? 'md:ml-8' : 'md:mr-8 md:text-right'}`}>
                  <p className="text-sm font-semibold text-brand-primary">{`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</p>
                  <h3 className="mb-1 font-bold text-white text-lg">{event.eventName}</h3>
                  <p className="text-sm leading-snug tracking-wide text-brand-text-dark">Venue: {event.venue}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const SchedulePage: React.FC<SchedulePageProps> = ({ events, onBack, onSelectEvent }) => {
  const day1Events = events
    .filter(e => e.day === 1)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const day2Events = events
    .filter(e => e.day === 2)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
      <button onClick={onBack} className="mb-8 text-brand-accent hover:underline animate-item-enter">
        &larr; Back
      </button>
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4 animate-item-enter">Fest Schedule</h1>
        <p className="text-lg text-brand-text-dark max-w-2xl mx-auto animate-item-enter" style={{ animationDelay: '100ms' }}>
          Plan your days. Don't miss out on any of the action.
        </p>
      </div>

      <div className="mt-16">
        <DaySchedule day={1} date="October 17, 2025" dayEvents={day1Events} onSelectEvent={onSelectEvent} />
        <DaySchedule day={2} date="October 18, 2025" dayEvents={day2Events} onSelectEvent={onSelectEvent} />
      </div>
    </div>
  );
};

export default SchedulePage;