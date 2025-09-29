import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import FloatingSelect from './FloatingSelect';
import type { Event, User, TeamMember } from '../types';

interface RegistrationPageProps {
  event: Event;
  user: User;
  onSubmit: (registrationData: { selectedPriceTier: string, teamMembers: TeamMember[] }) => void;
  onBack: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ event, user, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    department: '',
    section: '',
    rollNo: '',
    year: '',
 });
  
  const [member2Data, setMember2Data] = useState({
    fullName: '',
    department: '',
    section: '',
    rollNo: '',
    year: '',
  });

  // price tiers removed — single implicit tier
  const [otherTeamMembers, setOtherTeamMembers] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>(event.pricingTiers[0]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value: rawValue } = e.target as HTMLInputElement | HTMLSelectElement;
    // Auto-uppercase roll numbers while typing to keep UI consistent
    const value = name === 'rollNo' ? rawValue.toUpperCase() : rawValue;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMember2Change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value: rawValue } = e.target as HTMLInputElement | HTMLSelectElement;
    const value = name === 'rollNo' ? rawValue.toUpperCase() : rawValue;
    setMember2Data(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const team: TeamMember[] = [{
        fullName: formData.fullName,
        section: formData.section,
        rollNo: formData.rollNo,
        year: formData.year,
    }];

    if (event.eventName === 'TECHQUIT') {
        team.push(member2Data);
    } else if (event.requiresTeam) {
        otherTeamMembers.split(',')
            .map(name => name.trim())
            .filter(Boolean)
            .forEach(name => team.push({ fullName: name }));
    }

    const registrationData = {
      selectedPriceTier,
      teamMembers: team,
    };

    // Client-side validation
    // Phone: length 10, starts with 6/7/8/9
    const phone = formData.phoneNumber?.toString?.() ?? '';
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setSubmitError('Phone number must be 10 digits and start with 6,7,8 or 9');
      setIsSubmitting(false);
      return;
    }

    // Roll number allowed prefixes
    const roll = (formData.rollNo ?? '').toLowerCase();
    const allowedPrefixes = ['22k81a', '23k81a', '24k81a', '25k81a', '23k85a', '24k85a', '25k85a','22k85a'];
    // Expect format like 23k81a1234 (prefix + 4 digits). Adjust the suffix length to match your college's format.
    const rollOk = allowedPrefixes.some(pref => new RegExp(`^${pref}[0-9]{4}$`).test(roll));
    if (!rollOk) {
      setSubmitError(`Roll number must match one of: ${allowedPrefixes.map(p => `${p}####`).join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Attempt to persist to the database first. Expect environment variables:
    // VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
    try {
      const payload = {
        event_name: event.eventName,
        user_full_name: formData.fullName,
        user_phone: formData.phoneNumber,
        department: formData.department,
        section: formData.section,
        roll_no: formData.rollNo,
        year: formData.year,
        team_members: team,
      };

      console.debug('Attempting to insert registration payload:', payload);
      const { data, error } = await supabase
        .from('registrations')
        .insert(payload)
        .select();

      if (error) {
        console.error('Failed to save registration:', error);
        try {
          setSubmitError(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        } catch (e) {
          setSubmitError(error.message ?? String(error));
        }
        setIsSubmitting(false);
        return; // do not proceed to payment/navigation
      }

      console.log('Saved registration:', data?.[0]);
      setSubmitted(true);

      // Now call parent onSubmit so the app continues (payment simulation/navigation)
      onSubmit(registrationData);
    } catch (err: any) {
      console.error('Unexpected error saving registration:', err);
      setSubmitError(err?.message ?? String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTechquit = event.eventName === 'TECHQUIT';

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
        {/* Participant Details */}
        <div className="bg-brand-secondary/30 p-8 rounded-xl shadow-lg border border-brand-secondary animate-form-section" style={{animationDelay: '100ms'}}>
          <h2 className="text-2xl font-bold mb-8 text-white border-b border-brand-primary/50 pb-4">1. Primary Participant Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="form-group">
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-input" placeholder=" " required />
              <label htmlFor="fullName" className="form-label">Full Name</label>
            </div>
            <div className="form-group">
              <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="form-input" placeholder=" " required />
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            </div>
            <div className="form-group">
              <FloatingSelect
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                label="Department"
                required
                options={[
                  { value: '', label: '' },
                  { value: 'aiml', label: 'AIML' },
                  { value: 'cse', label: 'CSE' },
                  { value: 'csg', label: 'CSG' },
                  { value: 'aids', label: 'AIDS' },
                  { value: 'ece', label: 'ECE' },
                  { value: 'eee', label: 'EEE' },
                  { value: 'it', label: 'IT' },
                  { value: 'csm', label: 'CSM' },
                ]}
              />
            </div>
            <div className="form-group">
              <FloatingSelect
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                label="Section"
                required
                options={[
                  { value: '', label: '' },
                  { value: 'A', label: 'A' },
                  { value: 'B', label: 'B' },
                  { value: 'C', label: 'C' },
                  { value: 'D', label: 'D' },
                ]}
              />
            </div>
            <div className="form-group">
              <input type="text" id="rollNo" name="rollNo" value={formData.rollNo} onChange={handleInputChange} className="form-input" placeholder=" " data-empty={formData.rollNo ? 'false' : 'true'} required />
              <label htmlFor="rollNo" className="form-label">Roll No.</label>
            </div>
            <div className="form-group">
              <FloatingSelect
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                label="Year"
                required
                options={[
                  { value: '', label: '' },
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Registration Details */}
        <div className="bg-brand-secondary/30 p-8 rounded-xl shadow-lg border border-brand-secondary animate-form-section" style={{animationDelay: '300ms'}}>
          <h2 className="text-2xl font-bold mb-8 text-white border-b border-brand-primary/50 pb-4">2. Registration & Team Details</h2>
          <div className="mb-8">
            <label className="block text-lg font-medium text-brand-text mb-4">Select Price Tier</label>
            <div className="space-y-4">
              {event.pricingTiers.map((tier) => (
                <label key={tier} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPriceTier === tier ? 'border-brand-accent bg-brand-primary/20' : 'border-brand-secondary hover:border-brand-primary'}`}>
                  <input type="radio" name="priceTier" value={tier} checked={selectedPriceTier === tier} onChange={(e) => setSelectedPriceTier(e.target.value)} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mr-4 flex items-center justify-center ${selectedPriceTier === tier ? 'border-brand-accent' : 'border-gray-500'}`}>
                    {selectedPriceTier === tier && <div className="w-2 h-2 rounded-full bg-brand-accent"></div>}
                  </div>
                  <span className="text-brand-text text-lg">{tier}</span>
                </label>
              ))}
            </div>
          </div>
          {isTechquit && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Member 2 Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">

                <div className="form-group">
                  <input type="text" id="m2_fullName" name="fullName" value={member2Data.fullName} onChange={handleMember2Change} className="form-input" placeholder=" " data-empty={member2Data.fullName ? 'false' : 'true'} required />
                  <label htmlFor="m2_fullName" className="form-label">Full Name</label>
                </div>

                <div className="form-group">
                  <input type="text" id="m2_rollNo" name="rollNo" value={member2Data.rollNo} onChange={handleMember2Change} className="form-input" placeholder=" " data-empty={member2Data.rollNo ? 'false' : 'true'} required />
                  <label htmlFor="m2_rollNo" className="form-label">Roll No.</label>
                </div>

                <div className="form-group">
                  <FloatingSelect
                    id="m2_year"
                    name="year"
                    value={member2Data.year}
                    onChange={handleMember2Change}
                    label="Year"
                    required
                    options={[
                      { value: '', label: '' },
                      { value: '1', label: '1' },
                      { value: '2', label: '2' },
                      { value: '3', label: '3' },
                      { value: '4', label: '4' },
                    ]}
                  />
                </div>

                <div className="form-group">
                  <FloatingSelect
                    id="m2_department"
                    name="department"
                    value={member2Data.department}
                    onChange={handleMember2Change}
                    label="Department"
                    required
                    options={[
                      { value: '', label: '' },
                      { value: 'aiml', label: 'AIML' },
                      { value: 'cse', label: 'CSE' },
                      { value: 'csg', label: 'CSG' },
                      { value: 'aids', label: 'AIDS' },
                      { value: 'ece', label: 'ECE' },
                      { value: 'eee', label: 'EEE' },
                      { value: 'it', label: 'IT' },
                      { value: 'csm', label: 'CSM' },
                    ]}
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <FloatingSelect
                    id="m2_section"
                    name="section"
                    value={member2Data.section}
                    onChange={handleMember2Change}
                    label="Section"
                    required
                    options={[
                      { value: '', label: '' },
                      { value: 'A', label: 'A' },
                      { value: 'B', label: 'B' },
                      { value: 'C', label: 'C' },
                      { value: 'D', label: 'D' },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {event.requiresTeam && !isTechquit && (

            <div>
              <div className="form-group mb-6">
                <input type="text" id="teamMembers" value={otherTeamMembers} onChange={(e) => setOtherTeamMembers(e.target.value)} placeholder="Alice, Bob" className="form-input" data-empty={otherTeamMembers ? 'false' : 'true'} />
                <label htmlFor="teamMembers" className="form-label">Team Members (comma-separated names)</label>
              </div>
            </div>
          )}

          <div className="text-center animate-form-section" style={{animationDelay: '500ms'}}>
            <button type="submit" disabled={isSubmitting} className={`w-full max-w-md px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-brand-accent/50 hover:scale-105'} focus:outline-none focus:ring-4 focus:ring-brand-accent/50`}>
              {isSubmitting ? 'Saving...' : 'Proceed to Payment'}
            </button>
            {submitError && <p className="mt-4 text-sm text-red-400 whitespace-pre-wrap">{submitError}</p>}
            {submitted && <p className="mt-4 text-sm text-green-400">Registration saved.</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;