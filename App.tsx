import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
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
import ConfirmationPage from './components/ConfirmationPage';
import SchedulePage from './components/SchedulePage';
import Notification, { NotificationType } from './components/Notification';

const AppContent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [appIsReady, setAppIsReady] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [currentUser] = useState<User>(MOCK_USER);
    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        try {
            localStorage.setItem('lumina-fest-registrations', JSON.stringify(registrations));
        } catch (e) {
            console.error('Could not save registrations to local storage', e);
        }
    }, [registrations]);
    
    const showNotification = (message: string, type: NotificationType) => {
        setNotification({ message, type });
    };

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
            case 'schedule':
                navigate('/schedule');
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

    const handleRegistrationSubmit = (registrationData: { selectedPriceTier: string; teamMembers: TeamMember[]; teamName?: string; }) => {
        if (!selectedEvent || !currentUser) return;
    
        setIsProcessingPayment(true);
    
        const amountString = registrationData.selectedPriceTier.split(':').pop()?.trim();
        const amountInRupees = amountString ? parseInt(amountString, 10) : 0;
    
        if (isNaN(amountInRupees) || amountInRupees <= 0) {
            showNotification("Error: Invalid price for this event.", 'error');
            setIsProcessingPayment(false);
            return;
        }
    
        const options = {
            key: 'rzp_test_ROcO16Cak58YQk',
            amount: amountInRupees * 100,
            currency: "INR",
            name: "LuMInA Fest 2k25",
            description: `Registration for ${selectedEvent.eventName}`,
            image: "https://i.imgur.com/gJmB4g2.png",
            handler: async (response: any) => {
                const paymentId = response.razorpay_payment_id;
                showNotification('Payment successful! Saving your registration...', 'success');
    
                // --- Submit to Google Forms AFTER successful payment ---
                const googleFormActionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSejMRTIGWD_tpJOsOC1UWYs3W7-F3vINXZIljI14ZTxUHl3Cg/formResponse';
                const googleFormData = new FormData();
                
                googleFormData.append('entry.1721128365', selectedEvent.eventName);
                
                const primaryParticipant = registrationData.teamMembers[0];
                googleFormData.append('entry.1994438372', primaryParticipant.fullName);
                googleFormData.append('entry.632548788', primaryParticipant.phoneNumber || '');
                googleFormData.append('entry.1235040660', primaryParticipant.rollNo);
                googleFormData.append('entry.1457360595', primaryParticipant.year || '');
                googleFormData.append('entry.1843043796', primaryParticipant.department || '');
                googleFormData.append('entry.475120707', primaryParticipant.section || '');
        
                if (registrationData.teamName) {
                    googleFormData.append('entry.560605564', registrationData.teamName);
                }
                
                const otherMembers = registrationData.teamMembers.slice(1);
                const memberEntries = [
                    { name: '1321823957', roll: '1454220941', year: '662259548', dept: '1160076544', sec: '729058130' },
                    { name: '315079404', roll: '1704218020', year: '1105480150', dept: '2114217522', sec: '837573074' },
                    { name: '795983694', roll: '1655263982', year: '1073877070', dept: '364121594', sec: '1447708165' },
                ];
                
                otherMembers.slice(0, memberEntries.length).forEach((member, index) => {
                    const entries = memberEntries[index];
                    if (entries) {
                        googleFormData.append(`entry.${entries.name}`, member.fullName);
                        googleFormData.append(`entry.${entries.roll}`, member.rollNo || '');
                        googleFormData.append(`entry.${entries.year}`, member.year || '');
                        googleFormData.append(`entry.${entries.dept}`, member.department || '');
                        googleFormData.append(`entry.${entries.sec}`, member.section || '');
                    }
                });
    
                try {
                    await fetch(googleFormActionURL, { method: 'POST', body: googleFormData, mode: 'no-cors' });
                    
                    // --- Create final registration record ---
                    const finalRegistration: Registration = {
                        ...registrationData,
                        event: selectedEvent,
                        participant: currentUser,
                        registrationDate: new Date(),
                        id: `reg_${Date.now()}`,
                        paymentStatus: 'Paid',
                        paymentId: paymentId,
                    };
                    setRegistrations(prev => [...prev, finalRegistration]);
                    navigate('/confirmation', { state: { registration: finalRegistration } });
    
                } catch (error) {
                    console.error("Google Form submission failed AFTER payment:", error);
                    showNotification(`Payment Succeeded (ID: ${paymentId}), but registration failed. Please contact support.`, 'error');
                } finally {
                    setIsProcessingPayment(false);
                }
            },
            prefill: {
                name: registrationData.teamMembers[0]?.fullName || currentUser.fullName,
                email: currentUser.email,
                contact: registrationData.teamMembers[0]?.phoneNumber || currentUser.phoneNumber,
            },
            notes: {
                event_id: selectedEvent.id,
                user_id: currentUser.id,
            },
            theme: {
                color: "#DAA520"
            },
            modal: {
                ondismiss: () => {
                    showNotification("Payment was cancelled.", 'info');
                    setIsProcessingPayment(false);
                }
            }
        };
    
        try {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Error initializing Razorpay:", error);
            showNotification("Could not open payment window. Please try again.", 'error');
            setIsProcessingPayment(false);
        }
    };

    const EventDetailsWrapper = () => {
        const { eventId } = useParams<{ eventId: string }>();
        const navigate = useNavigate();

        const eventFromUrl = MOCK_EVENTS.find(e => e.id.toString() === eventId);
        
        if (!selectedEvent || !eventFromUrl || selectedEvent.id !== eventFromUrl.id) {
            return <Navigate to="/" replace />;
        }

        return <EventDetailsPage event={eventFromUrl} onRegister={() => handleNavigateToRegister(eventFromUrl)} onBack={() => navigate('/events')} />;
    };
    
    return (
        <>
            {notification && (
              <Notification
                  message={notification.message}
                  type={notification.type}
                  onClose={() => setNotification(null)}
              />
            )}
            <div className="min-h-screen">
                <Cursor />
                <ParticleBackground />
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Header onNavigate={handleNavigation} />
                    
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage onNavigateToEvents={handleNavigateToEvents} />} />
                            <Route path="/events" element={<EventsPage events={MOCK_EVENTS} onSelectEvent={handleSelectEvent} onBack={() => navigate('/')} />} />
                            <Route path="/schedule" element={<SchedulePage events={MOCK_EVENTS} onSelectEvent={handleSelectEvent} onBack={() => navigate(-1)} />} />
                            <Route path="/gallery" element={<GalleryPage onBack={() => navigate(-1)} />} />
                            <Route path="/contact" element={<ContactPage onBack={() => navigate(-1)} />} />
                            <Route path="/event/:eventId" element={<EventDetailsWrapper />} />
                            <Route path="/register" element={selectedEvent && currentUser ? <RegistrationPage event={selectedEvent} user={currentUser} onSubmit={handleRegistrationSubmit} onBack={() => navigate(-1)} isSubmitting={isProcessingPayment} /> : <Navigate to="/" replace />} />
                            <Route path="/confirmation" element={<ConfirmationPage onNavigateToEvents={handleNavigateToEvents} onNavigateHome={() => navigate('/')} />} />
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
                  background-color: rgba(251, 191, 36, 0.7); /* Gold */
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
                  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4);
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
                        linear-gradient(to right, rgba(218, 165, 32, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(218, 165, 32, 0.1) 1px, transparent 1px);
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

                /* --- Countdown Timer Styles (Split-Flap) --- */
                .flip-unit {
                  position: relative;
                  width: 50px;
                  height: 60px;
                  font-family: monospace;
                  perspective: 400px;
                  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                  border-radius: 6px;
                }
                @media (min-width: 768px) {
                  .flip-unit {
                    width: 70px;
                    height: 80px;
                  }
                }
                .flip-unit-label {
                  margin-top: 0.75rem;
                  font-size: 0.75rem;
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
                  color: #8B949E;
                }

                .digit-card {
                  position: absolute;
                  left: 0;
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  font-size: 2.5rem;
                  font-weight: bold;
                  color: #FBBF24;
                  background-color: #161B22;
                  overflow: hidden;
                  box-sizing: border-box;
                }
                @media (min-width: 768px) {
                  .digit-card {
                    font-size: 3rem;
                  }
                }

                .static-card.top-card, .flipper-front {
                  top: 0;
                  height: 50%;
                  border-radius: 6px 6px 0 0;
                  line-height: 60px; /* Aligns top half of text */
                }
                .static-card.bottom-card, .flipper-back {
                  top: 50%;
                  height: 50%;
                  border-radius: 0 0 6px 6px;
                  line-height: 0; /* Aligns bottom half of text */
                }
                
                @media (min-width: 768px) {
                    .static-card.top-card, .flipper-front {
                        line-height: 80px;
                    }
                }
                
                .static-card.top-card { z-index: 1; }
                .static-card.bottom-card { z-index: 0; }

                .flipper {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 50%;
                  z-index: 10;
                  transform-style: preserve-3d;
                  transform-origin: bottom;
                  transition: none; /* Transition is applied via class */
                }
                .flipper.flipping {
                  transform: rotateX(-180deg);
                  transition: transform 0.6s cubic-bezier(0.3, 0, 0.15, 1);
                  box-shadow: 0 10px 10px -5px rgba(0,0,0,0.4); /* Shadow for flipping element */
                }

                .flipper-card {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  backface-visibility: hidden;
                }
                .flipper-front { z-index: 2; transform: rotateX(0deg); }
                .flipper-back { transform: rotateX(180deg); }


                /* Registration Form Styles */
                .form-group {
                  position: relative;
                  margin-bottom: 2rem;
                }
                .form-input {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    background-color: rgba(13, 17, 23, 0.55);
                    border: 1px solid rgba(251,191,36,0.65); /* warm yellow border to match site */
                    border-radius: 0.5rem; /* rounded-lg */
                    padding: 1rem;
                    color: #E6EDF3; /* text-brand-text */
                    transition: all 0.12s ease-in-out;
                    font-size: 1rem;
                }
                input.form-input {
                  height: 3.5rem;
                  caret-color: #FBBF24;
                }
                .form-label {
                    position: absolute;
                    left: 1rem;
                    top: 1rem;
                    color: #8B949E; /* default label color */
                    pointer-events: none;
                    transition: all 0.12s ease-in-out;
                    background-color: transparent;
                    font-weight: 500;
                    font-size: 1rem;
                    padding: 0 0.5rem;
                    z-index: 1;
                }

                /* Focus/filled styles for text inputs */
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
                    font-size: 0.8rem;
                    color: #FBBF24;
                    padding: 0 0.35rem;
                    background-color: #0d1117; /* match page background */
                    z-index: 10;
                }
                
                /* --- Custom Select Styles --- */
                .select-wrapper {
                  position: relative;
                  display: flex;
                  align-items: center;
                  height: 3.5rem;
                  border-radius: 0.5rem; /* rounded-lg */
                  transition: all 0.12s ease-in-out;
                  border: 1px solid rgba(251,191,36,0.65); /* warm yellow border to match site */
                  background-color: rgba(13, 17, 23, 0.55);
                  box-sizing: border-box; /* FIX: Ensures total height matches inputs */
                }
                .select-button {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  background-color: transparent !important;
                  border: none !important;
                  box-shadow: none !important;
                  padding: 1rem;
                  text-align: left;
                  color: #E6EDF3;
                  font-size: 1rem;
                  position: relative;
                  cursor: pointer;
                }
                .select-button::after {
                  content: '';
                  position: absolute;
                  right: 1rem;
                  top: 50%;
                  transform: translateY(-50%) rotate(45deg);
                  width: 0.5rem;
                  height: 0.5rem;
                  border: solid #8B949E;
                  border-width: 0 2px 2px 0;
                  transition: transform 0.2s ease, border-color 0.2s ease;
                }
                .select-wrapper:focus-within .select-button::after,
                .select-button[aria-expanded="true"]::after {
                  border-color: #FBBF24;
                }
                .select-button[aria-expanded="true"]::after {
                  transform: translateY(-25%) rotate(225deg);
                }
                .select-button.placeholder .select-button-value {
                  color: transparent;
                }
                .select-wrapper:focus-within,
                .select-wrapper[data-empty="false"] {
                  border-color: rgba(251,191,36,1);
                  box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.08);
                  outline: none;
                }
                .select-wrapper:focus-within .form-label,
                .select-wrapper[data-empty="false"] .form-label {
                    top: -0.6rem;
                    left: 0.9rem;
                    font-size: 0.8rem;
                    color: #FBBF24;
                    padding: 0 0.35rem;
                    background-color: #0d1117;
                    z-index: 10;
                }
                .select-dropdown {
                  position: absolute;
                  top: calc(100% + 0.5rem);
                  left: 0;
                  right: 0;
                  background-color: #161B22; /* brand-secondary */
                  border: 1px solid rgba(251,191,36,0.65);
                  border-radius: 0.5rem;
                  padding: 0.5rem;
                  z-index: 20;
                  max-height: 200px;
                  overflow-y: auto;
                  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                }
                .select-option {
                  padding: 0.75rem 1rem;
                  color: #E6EDF3;
                  cursor: pointer;
                  border-radius: 0.375rem;
                  transition: background-color 0.15s ease;
                }
                .select-option:hover {
                  background-color: rgba(251, 191, 36, 0.1);
                  color: #FBBF24;
                }
                .select-option.selected {
                  background-color: rgba(218, 165, 32, 0.2);
                  color: #DAA520;
                  font-weight: 600;
                }

            `}</style>
        </>
    );
};

const App: React.FC = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;