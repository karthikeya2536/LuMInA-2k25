import React, { useState } from 'react';
import FloatingSelect from './FloatingSelect';
import type { Event, User, TeamMember } from '../types';

interface RegistrationPageProps {
  event: Event;
  user: User;
  onSubmit: (registrationData: { selectedPriceTier: string, teamMembers: TeamMember[] }) => void;
  onBack: () => void;
}

const memberInitialState = {
  fullName: '',
  phoneNumber: '', // Added for primary participant
  department: '',
  section: '',
  rollNo: '',
  year: '',
};

const RegistrationPage: React.FC<RegistrationPageProps> = ({ event, user, onSubmit, onBack }) => {
  const [formData, setFormData] = useState(memberInitialState);
  const [teamName, setTeamName] = useState('');
  const [member2Data, setMember2Data] = useState(memberInitialState);
  const [member3Data, setMember3Data] = useState(memberInitialState);
  const [member4Data, setMember4Data] = useState(memberInitialState);
  const [tacticalShowdownTeamSize, setTacticalShowdownTeamSize] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>(event.pricingTiers[0]);

  const createChangeHandler = (setter: React.Dispatch<React.SetStateAction<typeof memberInitialState>>) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value: rawValue } = e.target;
      const value = name === 'rollNo' ? rawValue.toUpperCase() : rawValue;
      setter(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = createChangeHandler(setFormData);
  const handleMember2Change = createChangeHandler(setMember2Data);
  const handleMember3Change = createChangeHandler(setMember3Data);
  const handleMember4Change = createChangeHandler(setMember4Data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!formData.fullName || !formData.rollNo) {
        setSubmitError('Primary participant Full Name and Roll No. are required.');
        setIsSubmitting(false);
        return;
    }

    const googleFormActionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSejMRTIGWD_tpJOsOC1UWYs3W7-F3vINXZIljI14ZTxUHl3Cg/formResponse';
    const googleFormData = new FormData();

    googleFormData.append('entry.1721128365', event.eventName);
    googleFormData.append('entry.1994438372', formData.fullName);
    googleFormData.append('entry.632548788', formData.phoneNumber);
    googleFormData.append('entry.1235040660', formData.rollNo);
    googleFormData.append('entry.1457360595', formData.year);
    googleFormData.append('entry.1843043796', formData.department);
    googleFormData.append('entry.475120707', formData.section);

    if (event.eventName === 'DEBATE' || event.eventName === 'LOGICAL LEAGUE') {
        googleFormData.append('entry.560605564', teamName);
        googleFormData.append('entry.1321823957', member2Data.fullName);
        googleFormData.append('entry.1454220941', member2Data.rollNo);
        googleFormData.append('entry.662259548', member2Data.year);
        googleFormData.append('entry.1160076544', member2Data.department);
        googleFormData.append('entry.729058130', member2Data.section);
        googleFormData.append('entry.315079404', member3Data.fullName);
        googleFormData.append('entry.1704218020', member3Data.rollNo);
        googleFormData.append('entry.1105480150', member3Data.year);
        googleFormData.append('entry.2114217522', member3Data.department);
        googleFormData.append('entry.837573074', member3Data.section);
    }

    if (event.eventName === 'TACTICAL SHOWDOWN') {
        googleFormData.append('entry.560605564', teamName);
        const members = [formData, member2Data, member3Data, member4Data];
        const memberEntries = [
            { name: '1321823957', roll: '1454220941', year: '662259548', dept: '1160076544', sec: '729058130' },
            { name: '315079404', roll: '1704218020', year: '1105480150', dept: '2114217522', sec: '837573074' },
            { name: '795983694', roll: '1655263982', year: '1073877070', dept: '364121594', sec: '1447708165' },
        ];
        for (let i = 1; i < tacticalShowdownTeamSize; i++) {
            const member = members[i];
            const entries = memberEntries[i-1];
            googleFormData.append(`entry.${entries.name}`, member.fullName);
            googleFormData.append(`entry.${entries.roll}`, member.rollNo);
            googleFormData.append(`entry.${entries.year}`, member.year);
            googleFormData.append(`entry.${entries.dept}`, member.department);
            googleFormData.append(`entry.${entries.sec}`, member.section);
        }
    }
    
    if (event.eventName === 'TECHQUIT') {
        googleFormData.append('entry.1321823957', member2Data.fullName);
        googleFormData.append('entry.1454220941', member2Data.rollNo);
        googleFormData.append('entry.662259548', member2Data.year);
        googleFormData.append('entry.1160076544', member2Data.department);
        googleFormData.append('entry.729058130', member2Data.section);
    }

    try {
      await fetch(googleFormActionURL, { method: 'POST', body: googleFormData, mode: 'no-cors' });
      setSubmitted(true);
      const team: TeamMember[] = [formData, member2Data, member3Data, member4Data].filter(m => m.fullName);
      onSubmit({ selectedPriceTier, teamMembers: team });
    } catch (err: any) {
      console.error('Failed to submit to Google Form:', err);
      setSubmitError(`An unexpected error occurred: ${err?.message ?? String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDebate = event.eventName === 'DEBATE';
  const isESports = event.eventName === 'E-SPORTS';
  const isTechquit = event.eventName === 'TECHQUIT';
  const isTacticalShowdown = event.eventName === 'TACTICAL SHOWDOWN';
  const isLogicalLeague = event.eventName === 'LOGICAL LEAGUE';

  const renderMemberFields = (memberData: typeof memberInitialState, handler: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, memberNumber: number) => (
    <div className="mt-8">
        {memberNumber > 1 && <h3 className="text-xl font-semibold mb-6 text-white">Member {memberNumber} Details</h3>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="form-group">
                <input type="text" id={`m${memberNumber}_fullName`} name="fullName" value={memberData.fullName} onChange={handler} className="form-input" placeholder=" " required />
                <label htmlFor={`m${memberNumber}_fullName`} className="form-label">Full Name</label>
            </div>
            {memberNumber === 1 && (
                <div className="form-group">
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={memberData.phoneNumber} onChange={handler} className="form-input" placeholder=" " required />
                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                </div>
            )}
            <div className="form-group">
                <input type="text" id={`m${memberNumber}_rollNo`} name="rollNo" value={memberData.rollNo} onChange={handler} className="form-input" placeholder=" " required />
                <label htmlFor={`m${memberNumber}_rollNo`} className="form-label">Roll No.</label>
            </div>
            <div className="form-group">
              <FloatingSelect id={`m${memberNumber}_year`} name="year" value={memberData.year} onChange={handler} label="Year" required options={[{ value: '', label: '' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }]} />
            </div>
            <div className="form-group">
              <FloatingSelect id={`m${memberNumber}_department`} name="department" value={memberData.department} onChange={handler} label="Department" required options={[{ value: '', label: '' }, { value: 'aiml', label: 'AIML' }, { value: 'cse', label: 'CSE' }, { value: 'csg', label: 'CSG' }, { value: 'aids', label: 'AIDS' }, { value: 'ece', label: 'ECE' }, { value: 'eee', label: 'EEE' }, { value: 'it', label: 'IT' }, { value: 'csm', label: 'CSM' }]} />
            </div>
            <div className="form-group">
              <FloatingSelect id={`m${memberNumber}_section`} name="section" value={memberData.section} onChange={handler} label="Section" required options={[{ value: '', label: '' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'C', label: 'C' }, { value: 'D', label: 'D' }]} />
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
       <button onClick={onBack} className="mb-8 text-brand-accent hover:underline">
        &larr; Back to Event Details
      </button>
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Registration</h1>
        <p className="text-brand-accent text-xl font-mono">Event: {event.eventName}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-12 space-y-10">
        <div className="bg-brand-secondary/30 p-8 rounded-xl shadow-lg border border-brand-secondary">
          <h2 className="text-2xl font-bold mb-8 text-white border-b border-brand-primary/50 pb-4">1. Primary Participant Details</h2>
          {renderMemberFields(formData, handleInputChange, 1)}
        </div>

        {(isDebate || isTechquit || isTacticalShowdown || isLogicalLeague) && (
            <div className="bg-brand-secondary/30 p-8 rounded-xl shadow-lg border border-brand-secondary">
                <h2 className="text-2xl font-bold mb-8 text-white border-b border-brand-primary/50 pb-4">2. Team Details</h2>
                {(isDebate || isTacticalShowdown || isLogicalLeague) && (
                    <div className="form-group">
                        <input type="text" id="teamName" name="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="form-input" placeholder=" " required />
                        <label htmlFor="teamName" className="form-label">Team Name</label>
                    </div>
                )}

                {isTacticalShowdown && (
                    <div className="form-group">
                        <FloatingSelect label="Team Size" id="teamSize" name="teamSize" required value={tacticalShowdownTeamSize.toString()} onChange={(e) => setTacticalShowdownTeamSize(parseInt(e.target.value, 10))}
                            options={[{value: '1', label: '1'}, {value: '2', label: '2'}, {value: '3', label: '3'}, {value: '4', label: '4'}]} />
                    </div>
                )}
                
                {(isTechquit || (isTacticalShowdown && tacticalShowdownTeamSize > 1) || isDebate || isLogicalLeague) && renderMemberFields(member2Data, handleMember2Change, 2)}

                {(isDebate || (isTacticalShowdown && tacticalShowdownTeamSize > 2) || isLogicalLeague) && renderMemberFields(member3Data, handleMember3Change, 3)}

                {(isTacticalShowdown && tacticalShowdownTeamSize > 3) && renderMemberFields(member4Data, handleMember4Change, 4)}
            </div>
        )}

        <div className="text-center">
            <button type="submit" disabled={isSubmitting} className={`w-full max-w-md px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-brand-accent/50 hover:scale-105'} focus:outline-none focus:ring-4 focus:ring-brand-accent/50`}>
              {isSubmitting ? 'Submitting...' : 'Proceed to Payment'}
            </button>
            {submitError && <p className="mt-4 text-sm text-red-400 whitespace-pre-wrap">{submitError}</p>}
            {submitted && <p className="mt-4 text-sm text-green-400">Registration submitted successfully!</p>}
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;