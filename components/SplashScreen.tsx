import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setShow(false);
    }, 2500); // Duration of the animation + pause

    const finishTimer = setTimeout(() => {
      onFinished();
    }, 3000); // Wait for the fade-out transition to complete

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 bg-brand-bg flex items-center justify-center z-[100] transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-1/3 h-1 bg-brand-accent animate-splash-loader"></div>
    </div>
  );
};

export default SplashScreen;
