import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const HighlightCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-brand-secondary/30 p-6 rounded-lg border border-brand-secondary hover:border-brand-accent hover:bg-brand-secondary/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-brand-accent/20">
    <h3 className="text-xl font-bold text-brand-accent mb-2">{title}</h3>
    <p className="text-brand-text-dark">{children}</p>
  </div>
);

const AboutSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="about-section" ref={sectionRef} className="reveal container mx-auto px-6 py-20">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-brand-primary tracking-widest">The Department of AIML Presents:</h2>
        <p className="mt-2 text-4xl md:text-5xl font-extrabold text-white">LuMInA – 2K25</p>
        <p className="mt-2 text-2xl text-brand-accent font-mono">- Where Culture meets code -</p>
        <p className="mt-8 text-lg text-brand-text-dark leading-relaxed">
          Join us on October 17th and 18th, 2025, for LuMInA – 2K25, an exciting two-day festival where technology and creativity collide. Hosted by the Department of AIML, our fest offers a diverse platform for students to learn, compete, and showcase their talents. Whether you're a coding prodigy, a creative artist, a gaming enthusiast, or a cultural performer, LuMInA has something for you. Explore a dynamic mix of technical challenges, artistic competitions, and vibrant cultural performances.
        </p>
      </div>

      <div className="mt-20">
        <h2 className="text-4xl font-bold text-center mb-12">Event Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <HighlightCard title="TechQuit (Technical Quiz)">
            Test your knowledge in a fast-paced quiz covering computer science, electronics, software, and emerging technologies.
          </HighlightCard>
          <HighlightCard title="Artify (Drawing Competition)">
            Showcase your creativity and artistic skill in a timed art competition where imagination knows no bounds.
          </HighlightCard>
          <HighlightCard title="Logical League (Debate)">
            Engage in a battle of words and ideas, focusing on the latest in technology and innovation.
          </HighlightCard>
          <HighlightCard title="Howzaat (Non-Technical Quiz)">
            Join a fun and engaging quiz that tests your general awareness, creativity, and quick thinking.
          </HighlightCard>
          <HighlightCard title="Tactical Showdown (E-Sports)">
            Team up and compete in an intense e-sports tournament featuring popular gaming titles.
          </HighlightCard>
          <HighlightCard title="Rangasthalam (Cultural Events)">
            Take the stage to express your passion for the arts through dance, music, and a dazzling theme walk.
          </HighlightCard>
        </div>
      </div>
      
      <div className="text-center mt-20 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white">Join Us!</h2>
          <p className="mt-4 text-lg text-brand-text-dark">
            Dive into our detailed schedule, choose your events, and get ready for two unforgettable days. Register now and be a part of the celebration!
          </p>
      </div>
    </section>
  );
};

export default AboutSection;