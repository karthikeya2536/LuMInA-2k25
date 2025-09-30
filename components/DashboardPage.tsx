import React from 'react';
import type { User, Registration } from '../types';

interface DashboardPageProps {
  user: User;
  registrations: Registration[];
  onNavigateToEvents: () => void;
}

const PaymentStatusBadge: React.FC<{ status: 'Paid' | 'Pending' | 'Failed' }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-sm font-semibold rounded-full inline-block';
  const statusClasses = {
    Paid: 'bg-green-500/20 text-green-300',
    Pending: 'bg-yellow-500/20 text-yellow-300',
    Failed: 'bg-red-500/20 text-red-300',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const DashboardPage: React.FC<DashboardPageProps> = ({ user, registrations, onNavigateToEvents }) => {
  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
      <div className="bg-brand-secondary/50 p-8 rounded-lg shadow-lg mb-10 animate-item-enter flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">Welcome, {user.fullName}!</h1>
          <p className="text-brand-text-dark mt-2">{user.collegeName}</p>
        </div>
        <button onClick={onNavigateToEvents} className="self-start sm:self-center text-brand-accent hover:underline bg-brand-secondary px-4 py-2 rounded-lg transition-colors hover:bg-brand-primary/20">
            &larr; Back to Events
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 animate-item-enter" style={{ animationDelay: '100ms' }}>My Registrations</h2>
      
      {registrations.length > 0 ? (
        <div className="space-y-6">
          {registrations.map((reg, index) => {
            const teammates = reg.teamMembers.slice(1);
            return (
              <div 
                key={reg.id} 
                className="bg-brand-secondary/30 p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-item-enter"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div>
                  <h3 className="text-2xl font-bold text-white">{reg.event.eventName}</h3>
                  <p className="text-brand-text-dark mt-1">{reg.selectedPriceTier}</p>
                  {teammates.length > 0 && (
                    <p className="text-sm text-brand-text-dark mt-2">Team: {teammates.map(m => m.fullName).join(', ')}</p>
                  )}
                </div>
                <div className="mt-4 md:mt-0">
                  <PaymentStatusBadge status={reg.paymentStatus} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-secondary/30 rounded-lg animate-item-enter" style={{ animationDelay: '200ms' }}>
          <p className="text-xl text-brand-text-dark">You haven't registered for any events yet.</p>
          <p className="mt-2 text-brand-text">Explore the events and join the fest!</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;