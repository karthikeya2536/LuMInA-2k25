
export interface Event {
  id: number;
  eventName: string;
  description: string;
  day: 1 | 2;
  startTime: Date;
  endTime: Date;
  venue: string;
  category: 'Technical' | 'Non-Technical' | 'Cultural';
  imageUrl: string;
  requiresTeam: boolean;
  pricingTiers: string[];
  scheduleOnly?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  collegeName: string;
}

export interface TeamMember {
  fullName: string;
  year?: string;
  department?: string;
  section?: string;
  rollNo?: string;
  phoneNumber?: string;
}

export interface Registration {
  id: string;
  event: Event;
  participant: User;
  teamMembers: TeamMember[];
  selectedPriceTier: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  registrationDate: Date;
  paymentId: string | null;
}

export type Page = 'home' | 'events' | 'event_details' | 'register' | 'dashboard' | 'gallery' | 'contact' | 'schedule';