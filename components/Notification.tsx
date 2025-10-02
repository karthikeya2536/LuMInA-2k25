import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

const icons = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  info: <FaInfoCircle />,
};

const colors = {
  success: 'bg-green-600/80 border-green-500',
  error: 'bg-red-600/80 border-red-500',
  info: 'bg-sky-600/80 border-sky-500',
};

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    const timer = setTimeout(() => {
        // Start animating out
        setIsVisible(false);
        // Call onClose after the animation duration
        setTimeout(onClose, 300); 
    }, 5000); // Display for 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);
  
  const handleClose = () => {
      setIsVisible(false);
      setTimeout(onClose, 300);
  }

  return (
    <div 
      className={`fixed top-24 right-6 z-[10001] w-full max-w-sm p-4 border-l-4 rounded-md shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${colors[type]} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 text-2xl text-white">
          {icons[type]}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-white">
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button onClick={handleClose} className="inline-flex text-white rounded-md hover:text-brand-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span className="sr-only">Close</span>
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
