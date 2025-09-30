import React, { useState, useEffect } from 'react';
import FloatingSelect from './FloatingSelect';
import type { Event, User, TeamMember } from '../types';

interface RegistrationPageProps {
  event: Event;
  user: User;
  onSubmit: (registrationData: { selectedPriceTier: string, teamMembers: TeamMember[] }) => void;
  onBack: () => void;
}

const memberInitialState: TeamMember = {
  fullName: '',
  phoneNumber: '',
  department: '',
  section: '',
  rollNo: '',
  year: '',
};

const RegistrationPage: React.FC<RegistrationPageProps> = ({ event, user, onSubmit, onBack }) => {
  // --- Unified State ---
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([memberInitialState]);
  const [teamName, setTeamName] = useState('');
  const [numberOfMembers, setNumberOfMembers] = useState(1);
  
  // --- Event Specific State ---
  const [tacticalShowdownTeamSize, setTacticalShowdownTeamSize] = useState(1);

  const rangasthalamOptions = [
    { value: 'Dance (Per Person): 60', label: 'Dance (Per Person) - 60' },
    { value: 'Dance (Pair): 100', label: 'Dance (Pair) - 100' },
    { value: 'Dance (Group 3-5): 150', label: 'Dance (Group 3-5) - 150' },
    { value: 'Dance (Group >5): 200', label: 'Dance (Group >5) - 200' },
    { value: 'Song (Per Person): 50', label: 'Song (Per Person) - 50' },
    { value: 'Theme Walk (Per Person): 50', label: 'Theme Walk (Per Person) - 50' },
    { value: 'Audience Pass: 60', label: 'Audience Pass - 60' },
  ];
  const [rangasthalamTier, setRangasthalamTier] = useState(rangasthalamOptions[0].value);
  const [groupSize3to5, setGroupSize3to5] = useState('3');
  const [groupSizeOver5, setGroupSizeOver5] = useState('6');
  
  // --- Form State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>(event.pricingTiers[0]);

  // --- Determine number of members based on event and user selections ---
  useEffect(() => {
    let members = 1;
    switch (event.eventName) {
      case 'TECHQUIT':
      case 'HOWZAAT':
        members = 2;
        break;
      case 'DEBATE':
      case 'LOGICAL LEAGUE':
        members = 3;
        break;
      case 'TACTICAL SHOWDOWN':
        members = tacticalShowdownTeamSize;
        break;
      case 'RANGASTALAM': // FIX: Corrected case
        setSelectedPriceTier(rangasthalamTier); // Update price tier
        if (rangasthalamTier.includes('Pair')) {
          members = 2;
        } else if (rangasthalamTier.includes('Group 3-5')) {
          members = parseInt(groupSize3to5, 10);
        } else if (rangasthalamTier.includes('Group >5')) {
          const size = parseInt(groupSizeOver5, 10);
          members = isNaN(size) || size < 6 ? 6 : size; // Default to 6 if invalid
        } else {
          members = 1;
        }
        break;
      default:
        members = 1;
    }
    setNumberOfMembers(members);
  }, [event.eventName, tacticalShowdownTeamSize, rangasthalamTier, groupSize3to5, groupSizeOver5]);

  // --- Sync teamMembers array with numberOfMembers ---
  useEffect(() => {
    setTeamMembers(currentMembers => {
      const diff = numberOfMembers - currentMembers.length;
      if (diff > 0) {
        return [...currentMembers, ...Array.from({ length: diff }, () => ({ ...memberInitialState, phoneNumber: '' }))];
      }
      if (diff < 0) {
        return currentMembers.slice(0, numberOfMembers);
      }
      return currentMembers;
    });
  }, [numberOfMembers]);
  
  // --- Unified Change Handler ---
  const handleTeamMemberChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value: rawValue } = e.target;
    const value = name === 'rollNo' ? rawValue.toUpperCase() : rawValue;
    setTeamMembers(prev => {
        const updatedMembers = [...prev];
        updatedMembers[index] = { ...updatedMembers[index], [name]: value };
        return updatedMembers;
    });
  };

  const isDebate = event.eventName === 'DEBATE';
  const isTacticalShowdown = event.eventName === 'TACTICAL SHOWDOWN';
  const isLogicalLeague = event.eventName === 'LOGICAL LEAGUE';
  const isRangasthalam = event.eventName === 'RANGASTALAM';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const primaryParticipant = teamMembers[0];
    if (!primaryParticipant || !primaryParticipant.fullName || !primaryParticipant.rollNo) {
        setSubmitError('Primary participant Full Name and Roll No. are required.');
        setIsSubmitting(false);
        return;
    }
    
    // Additional validation for Rangasthalam >5 group
    if (event.eventName === 'RANGASTALAM' && rangasthalamTier.includes('Group >5')) {
      const size = parseInt(groupSizeOver5, 10);
      if (isNaN(size) || size < 6) {
        setSubmitError('For a group size greater than 5, you must enter a number of 6 or more.');
        setIsSubmitting(false);
        return;
      }
    }

    const googleFormActionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSejMRTIGWD_tpJOsOC1UWYs3W7-F3vINXZIljI14ZTxUHl3Cg/formResponse';
    const googleFormData = new FormData();

    googleFormData.append('entry.1721128365', event.eventName);
    
    // Add primary participant details
    googleFormData.append('entry.1994438372', primaryParticipant.fullName);
    googleFormData.append('entry.632548788', primaryParticipant.phoneNumber || '');
    googleFormData.append('entry.1235040660', primaryParticipant.rollNo);
    googleFormData.append('entry.1457360595', primaryParticipant.year || '');
    googleFormData.append('entry.1843043796', primaryParticipant.department || '');
    googleFormData.append('entry.475120707', primaryParticipant.section || '');

    // Add team name if applicable
    if (isDebate || isTacticalShowdown || isLogicalLeague) {
        googleFormData.append('entry.560605564', teamName);
    }
    
    // Add other team members (Google Form has a fixed number of fields, so we cap it)
    const otherMembers = teamMembers.slice(1);
    const memberEntries = [
        // Member 2
        { name: '1321823957', roll: '1454220941', year: '662259548', dept: '1160076544', sec: '729058130' },
        // Member 3
        { name: '315079404', roll: '1704218020', year: '1105480150', dept: '2114217522', sec: '837573074' },
        // Member 4
        { name: '795983694', roll: '1655263982', year: '1073877070', dept: '364121594', sec: '1447708165' },
    ];
    
    // For Rangasthalam with > 5 members, we can only submit the first few to the form.
    // The full list is still captured by our app state.
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
      setSubmitted(true);
      // Pass the complete team member list to the app state
      onSubmit({ selectedPriceTier, teamMembers });
    } catch (err: any) {
      console.error('Failed to submit to Google Form:', err);
      setSubmitError(`An unexpected error occurred: ${err?.message ?? String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMemberFields = (memberData: TeamMember, handler: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, memberNumber: number) => (
    <div className="mt-8">
        <h3 className="text-xl font-semibold mb-6 text-white border-b border-brand-primary/20 pb-2">
            {memberNumber === 1 ? 'Primary Participant' : `Member ${memberNumber}`}
        </h3>
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
              <FloatingSelect id={`m${memberNumber}_year`} name="year" value={memberData.year || ''} onChange={handler} label="Year" required options={[{ value: '', label: '' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }]} />
            </div>
            <div className="form-group">
              <FloatingSelect id={`m${memberNumber}_department`} name="department" value={memberData.department || ''} onChange={handler} label="Department" required options={[{ value: '', label: '' }, { value: 'aiml', label: 'AIML' }, { value: 'cse', label: 'CSE' }, { value: 'csg', label: 'CSG' }, { value: 'aids', label: 'AIDS' }, { value: 'ece', label: 'ECE' }, { value: 'eee', label: 'EEE' }, { value: 'it', label: 'IT' }, { value: 'csm', label: 'CSM' }]} />
            </div>
            <div className="form-group">
              <FloatingSelect id={`m${memberNumber}_section`} name="section" value={memberData.section || ''} onChange={handler} label="Section" required options={[{ value: '', label: '' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'C', label: 'C' }, { value: 'D', label: 'D' }]} />
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
            <h2 className="text-2xl font-bold mb-8 text-white border-b border-brand-primary/50 pb-4">1. Event Options</h2>
            
            {isRangasthalam && (
              <>
                <div className="form-group">
                    <FloatingSelect
                        label="Select your category"
                        id="rangasthalamTier"
                        name="rangasthalamTier"
                        required
                        value={rangasthalamTier}
                        onChange={(e) => setRangasthalamTier(e.target.value)}
                        options={rangasthalamOptions}
                    />
                </div>
                {rangasthalamTier.includes('Group 3-5') && (
                  <div className="form-group">
                    <FloatingSelect
                      label="Select Group Size"
                      id="groupSize3to5"
                      name="groupSize3to5"
                      required
                      value={groupSize3to5}
                      onChange={(e) => setGroupSize3to5(e.target.value)}
                      options={[
                        { value: '3', label: '3 Members' },
                        { value: '4', label: '4 Members' },
                        { value: '5', label: '5 Members' },
                      ]}
                    />
                  </div>
                )}
                {rangasthalamTier.includes('Group >5') && (
                  <div className="form-group">
                    <input
                      type="number"
                      id="groupSizeOver5"
                      name="groupSizeOver5"
                      value={groupSizeOver5}
                      onChange={(e) => setGroupSizeOver5(e.target.value)}
                      className="form-input"
                      placeholder=" "
                      required
                      min="6"
                    />
                    <label htmlFor="groupSizeOver5" className="form-label">Enter Number of Members (6+)</label>
                  </div>
                )}
              </>
            )}

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
        </div>

        <div className="bg-brand-secondary/30 p-8 rounded-xl shadow-lg border border-brand-secondary">
          <h2 className="text-2xl font-bold mb-8 text-white border-b border-brand-primary/50 pb-4">2. Participant Details</h2>
          {teamMembers.map((member, index) => (
            <div key={index}>
              {renderMemberFields(member, (e) => handleTeamMemberChange(index, e), index + 1)}
            </div>
          ))}
        </div>

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