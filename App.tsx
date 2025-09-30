import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import type { Event, User, Registration, TeamMember, Page } from './types';
import { MOCK_EVENTS, MOCK_USER } from './data/mockData';
import HomePage from './components/HomePage';
import EventsPage from './components/EventsPage';
import EventDetailsPage from './components/EventDetailsPage';
import RegistrationPage from './components/RegistrationPage';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import GalleryPage from './components/GalleryPage';
import ContactPage from './components/ContactPage';
import ParticleBackground from './components/ParticleBackground';
import Cursor from './components/Cursor';
import Footer from './components/Footer';

const AppContent: React.FC = () => {
    const navigate = useNavigate();
    const [appIsReady, setAppIsReady] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [currentUser] = useState<User>(MOCK_USER);
    const [registrations, setRegistrations] = useState<Registration[]>(() => {
        try {
            const saved = localStorage.getItem('lumina-fest-registrations');
            if (saved) {
                const parsedRegistrations = JSON.parse(saved);
                return parsedRegistrations.map((reg: any) => ({
                    ...reg,
                    event: {
                        ...reg.event,
                        startTime: new Date(reg.event.startTime),
                        endTime: new Date(reg.event.endTime),
                    },
                    registrationDate: new Date(reg.registrationDate),
                }));
            }
        } catch (e) {
            console.error('Could not load registrations from local storage', e);
        }
        return [];
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

    useEffect(() => {
        try {
            localStorage.setItem('lumina-fest-registrations', JSON.stringify(registrations));
        } catch (e) {
            console.error('Could not save registrations to local storage', e);
        }
    }, [registrations]);

    useEffect(() => {
        if (showSuccessMessage) {
            const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessMessage]);

    if (!appIsReady) {
      return <SplashScreen onFinished={() => setAppIsReady(true)} />;
    }

    const handleSelectEvent = (event: Event) => {
        setSelectedEvent(event);
        navigate(`/event/${event.id}`);
    };

    const handleNavigation = (page: Page) => {
        switch (page) {
            case 'home':
                navigate('/');
                break;
            case 'events':
                navigate('/events');
                break;
            case 'gallery':
                navigate('/gallery');
                break;
            case 'contact':
                navigate('/contact');
                break;
            default:
                navigate('/');
        }
    };
    
    const handleNavigateToEvents = () => {
        navigate('/events');
    };

    const handleNavigateToRegister = (event: Event) => {
        setSelectedEvent(event);
        navigate('/register');
    }

    const handleRegistrationSubmit = (registrationData: { selectedPriceTier: string, teamMembers: TeamMember[] }) => {
        if (!selectedEvent || !currentUser) return;

        setIsLoading(true);

        // FIX: The `Omit` utility type requires two arguments: the base type and the keys to omit.
        // Here, we're creating a partial registration object before the payment details (like id, paymentId, paymentStatus) are generated.
        const newRegistration: Omit<Registration, 'id' | 'paymentId' | 'paymentStatus'> = {
            event: selectedEvent,
            participant: currentUser,
            registrationDate: new Date(),
            ...registrationData
        };

        setTimeout(() => {
            const finalRegistration: Registration = {
                ...newRegistration,
                id: `reg_${Date.now()}`,
                paymentStatus: 'Paid',
                paymentId: `pi_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
            };
            setRegistrations(prev => [...prev, finalRegistration]);
            setIsLoading(false);
            setShowSuccessMessage(true);
            navigate('/'); // Navigate home after registration
        }, 3000);
    };

    const EventDetailsWrapper = () => {
        const { eventId } = useParams<{ eventId: string }>();
        const event = MOCK_EVENTS.find(e => e.id.toString() === eventId);
        if (!event) {
            // Optional: Redirect to a 404 page or back to events list
            useEffect(() => {
                navigate('/events');
            }, [navigate]);
            return null;
        }
        return <EventDetailsPage event={event} onRegister={() => handleNavigateToRegister(event)} onBack={() => navigate('/events')} />;
    };
    
    return (
        <>
            <div className="min-h-screen">
                <Cursor />
                <ParticleBackground />
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Header onNavigate={handleNavigation} />
                    {isLoading && (
                        <div className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm flex flex-col items-center justify-center z-[80]">
                            <div className="w-16 h-16 border-4 border-t-brand-accent border-r-brand-accent border-brand-secondary rounded-full animate-spin"></div>
                            <p className="mt-4 text-xl text-white">Processing Payment...</p>
                        </div>
                    )}
                    {showSuccessMessage && (
                         <div className="fixed top-24 right-6 bg-green-500/80 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
                            Registration Successful!
                        </div>
                    )}

                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage onNavigateToEvents={handleNavigateToEvents} />} />
                            <Route path="/events" element={<EventsPage events={MOCK_EVENTS} onSelectEvent={handleSelectEvent} onBack={() => navigate('/')} />} />
                            <Route path="/gallery" element={<GalleryPage onBack={() => navigate(-1)} />} />
                            <Route path="/contact" element={<ContactPage onBack={() => navigate(-1)} />} />
                            <Route path="/event/:eventId" element={<EventDetailsWrapper />} />
                            <Route path="/register" element={selectedEvent && currentUser ? <RegistrationPage event={selectedEvent} user={currentUser} onSubmit={handleRegistrationSubmit} onBack={() => navigate(-1)} /> : <EventsPage events={MOCK_EVENTS} onSelectEvent={handleSelectEvent} onBack={() => navigate('/')} />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </div>
            <style>{`
                /* --- Custom Cursor (Glowing Orb) --- */
                html, * {
                  cursor: none !important;
                }
                .cursor-orb {
                  position: fixed;
                  width: 24px;
                  height: 24px;
                  background-color: rgba(251, 191, 36, 0.7); /* brand-accent */
                  border-radius: 50%;
                  pointer-events: none;
                  z-index: 10000;
                  box-shadow: 0 0 20px 5px rgba(251, 191, 36, 0.4);
                  /* Smooth transitions for all properties */
                  transition: transform 0.15s ease-out, width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
                }

                .cursor-orb.hover {
                  width: 36px; /* Grow the orb */
                  height: 36px;
                  background-color: rgba(251, 191, 36, 0.9);
                  box-shadow: 0 0 35px 10px rgba(251, 191, 36, 0.6);
                }

                /* --- Reveal on Scroll --- */
                .reveal {
                  opacity: 0;
                  transform: translateY(40px);
                  transition: opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  transition-delay: 0.1s;
                }
                .reveal.visible {
                  opacity: 1;
                  transform: translateY(0);
                }

                /* --- Hero Button Glow --- */
                .hero-button {
                  position: relative;
                  isolation: isolate;
                  overflow: hidden;
                  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
                }
                .hero-button:hover {
                    box-shadow: 0 4px 25px rgba(251, 191, 36, 0.6);
                }

                /* --- 3D Event Card Styles --- */
                .card-3d-wrapper {
                  transform-style: preserve-3d;
                  transform: perspective(1000px);
                }
                
                .card-3d-inner {
                  transition: transform 0.1s;
                  will-change: transform;
                  position: relative;
                  border: 1px solid var(--border-color, rgba(22, 27, 34, 0.8));
                }

                .card-3d-wrapper:hover .card-3d-inner {
                    --border-color: rgba(251, 191, 36, 0.5);
                }

                .card-3d-glow {
                  position: absolute;
                  inset: 0;
                  width: 100%;
                  height: 100%;
                  border-radius: 0.5rem; /* same as card */
                  background: radial-gradient(
                    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                    rgba(251, 191, 36, 0.3),
                    transparent 40%
                  );
                  opacity: 0;
                  transition: opacity 0.3s ease-in-out;
                  will-change: opacity, background;
                }
                .card-3d-wrapper:hover .card-3d-glow {
                    opacity: 1;
                }

                /* Component Animations (Keep for non-section elements) */
                @keyframes item-enter {
                  from { opacity: 0; transform: translateY(30px) scale(0.98); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-item-enter {
                  opacity: 0; /* Start hidden */
                  animation: item-enter 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }

                @keyframes fade-in-out {
                    0% { opacity: 0; transform: translateX(100%); }
                    15% { opacity: 1; transform: translateX(0); }
                    85% { opacity: 1; transform: translateX(0); }
                    100% { opacity: 0; transform: translateX(100%); }
                }
                .animate-fade-in-out { animation: fade-in-out 5s ease-in-out forwards; }
                
                .bg-grid-brand-primary\/10 {
                    background-image:
                        linear-gradient(to right, rgba(249, 115, 22, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(249, 115, 22, 0.1) 1px, transparent 1px);
                    background-size: 40px 40px;
                }

                /* --- Splash Screen Loader Styles --- */
                @keyframes splash-loader-anim {
                    0% {
                        width: 0%;
                        opacity: 0;
                    }
                    40% {
                        width: 33.3333%; /* correspods to w-1/3 */
                        opacity: 1;
                    }
                    90% {
                        width: 33.3333%;
                        opacity: 1;
                    }
                    100% {
                        width: 0%;
                        opacity: 0;
                    }
                }
                .animate-splash-loader {
                    animation: splash-loader-anim 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                
                /* Registration Form Styles */
                .form-group {
                  position: relative;
                  margin-bottom: 2rem;
                }
                .form-input {
                    width: 100%;
                    background-color: rgba(13, 17, 23, 0.55);
                    border: 1px solid rgba(251,191,36,0.65); /* warm yellow border to match site */
                    border-radius: 0.5rem; /* rounded-lg */
                    padding: 1rem;
                    color: #E6EDF3; /* text-brand-text */
                    transition: all 0.12s ease-in-out;
                    caret-color: #FBBF24;
                    font-size: 1rem;
                }
                /* Filled state: make inner background slightly lighter and text brighter */
                input.form-input[data-empty="false"],
                textarea.form-input[data-empty="false"],
                .select-button:not(.placeholder) {
                    /* keep the same inner background as empty state to avoid visual shift */
                    background-color: rgba(13,17,23,0.55) !important;
                    color: #E6EDF3 !important;
                    border-color: rgba(251,191,36,1) !important;
                    box-shadow: none;
                }
                /* Ensure the filled select button value is visible */
                .select-button:not(.placeholder) .select-button-value {
                    color: #E6EDF3;
                }
                /* Hide any placeholder text inside the select button when empty */
                .select-button.placeholder .select-button-value {
                    color: transparent;
                }
                /* Smooth transitions for fill state */
                .form-input, .select-button {
                    transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
                }
                /* --- Neutralize browser autofill styling (Chrome/Safari/Edge and Firefox) --- */
                input.form-input:-webkit-autofill,
                textarea.form-input:-webkit-autofill,
                input.form-input:-webkit-autofill:focus,
                textarea.form-input:-webkit-autofill:focus {
                    -webkit-box-shadow: 0 0 0px 1000px rgba(13,17,23,0.55) inset !important;
                    box-shadow: 0 0 0px 1000px rgba(13,17,23,0.55) inset !important;
                    -webkit-text-fill-color: #E6EDF3 !important;
                    transition: background-color 5000s ease-in-out 0s !important;
                }
                input.form-input:-moz-autofill,
                textarea.form-input:-moz-autofill {
                    box-shadow: 0 0 0px 1000px rgba(13,17,23,0.55) inset !important;
                    -moz-text-fill-color: #E6EDF3 !important;
                }
                .form-label {
                    position: absolute;
                    left: 1rem;
                    top: 1rem;
                    color: #FBBF24; /* label stays yellow on the border */
                    pointer-events: none;
                    transition: all 0.12s ease-in-out;
                    background-color: #0d1117; /* match page background so label sits cleanly */
                    font-weight: 600;
                    font-size: 0.95rem;
                    padding: 0 0.5rem;
                    z-index: 30; /* ensure label floats above field text */
                    display: inline-block;
                }
                /* Apply focus/filled styles to inputs and textareas only (not selects) */
                input.form-input:focus,
                textarea.form-input:focus,
                input.form-input:not(:placeholder-shown),
                input.form-input[data-empty="false"] {
                    border-color: rgba(251,191,36,1); /* bright on focus/filled */
                    box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.08);
                    outline: none;
                }
                input.form-input:focus + .form-label,
                input.form-input:not(:placeholder-shown) + .form-label,
                input.form-input[data-empty="false"] + .form-label,
                textarea.form-input:focus + .form-label,
                textarea.form-input:not(:placeholder-shown) + .form-label,
                textarea.form-input[data-empty="false"] + .form-label {
                    top: -0.6rem;
                    left: 0.9rem;
                    font-size: 0.8rem; /* slightly smaller */
                    color: #FBBF24; /* label remains yellow */
                    padding: 0 0.35rem;
                    background-color: #0d1117; /* match page background so label appears cut out of border */
                }

                /* Selects: style the wrapper instead of the select itself to avoid double borders */
                .select-wrapper:focus-within,
                .select-wrapper[data-empty="false"] {
                    border-color: rgba(251,191,36,1);
                    box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.06);
                }
                .select-wrapper:focus-within .form-label,
                .select-wrapper[data-empty="false"] .form-label {
                    top: -0.6rem;
                    left: 0.9rem;
                    font-size: 0.8rem;
                    color: #FBBF24;
                    padding: 0 0.35rem;
                    background-color: #0d1117;
                }
            `}</style>
        </>
    );
};

// FIX: Added the main App component to provide the Router context and a default export.
const App: React.FC = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;
