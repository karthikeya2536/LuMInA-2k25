import React, { useState, useEffect, useRef } from 'react';

// A helper hook to get the previous value of a prop or state.
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


// Renders a single flipping digit unit using a split-flap animation.
const FlipUnit: React.FC<{ digit: string }> = ({ digit }) => {
  const previousDigit = usePrevious(digit) ?? digit;
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (previousDigit !== digit) {
      setIsFlipping(true);
    }
  }, [digit, previousDigit]);

  const handleTransitionEnd = () => {
    setIsFlipping(false);
  };
  
  // To prevent flicker, we need to manage which digit is displayed based on the animation state.
  // When flipping, the bottom static part should hold the old digit until the flap covers it.
  const bottomDisplayDigit = isFlipping ? previousDigit : digit;
  // The top of the flipper always shows the old digit as it falls.
  const flipperTopDigit = previousDigit;
  // The new digit is revealed on the static top and on the back of the flipper.
  const topDisplayDigit = digit;


  return (
    <div className="flip-unit" onTransitionEnd={handleTransitionEnd}>
      {/* Static top half, shows the new digit */}
      <div className="digit-card static-card top-card">{topDisplayDigit}</div>
      {/* Static bottom half, shows the old digit until the flip ends */}
      <div className="digit-card static-card bottom-card">{bottomDisplayDigit}</div>
      
      {/* The animated flap */}
      <div className={`flipper ${isFlipping ? 'flipping' : ''}`}>
        {/* Front of the flap (what you see initially) */}
        <div className="digit-card flipper-card flipper-front">{flipperTopDigit}</div>
        {/* Back of the flap (what you see as it lands) */}
        <div className="digit-card flipper-card flipper-back">{topDisplayDigit}</div>
      </div>
    </div>
  );
};


// Renders a full time unit (e.g., "Days") with two flipping digits
const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const paddedValue = String(value).padStart(2, '0');
  const digit1 = paddedValue[0];
  const digit2 = paddedValue[1];

  return (
    <div className="flex flex-col items-center mx-1 md:mx-2">
      <div className="flex gap-1">
        <FlipUnit digit={digit1} />
        <FlipUnit digit={digit2} />
      </div>
      <p className="flip-unit-label">{label}</p>
    </div>
  );
};


// --- Main Countdown Timer Component ---

interface CountdownTimerProps {
  targetDate: string;
}

const calculateTimeLeft = (targetDate: string) => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    return timeLeft;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

    useEffect(() => {
        let animationFrameId: number;
        let lastUpdateTime = 0;

        const tick = (timestamp: number) => {
            // Schedule the next frame first.
            animationFrameId = requestAnimationFrame(tick);

            // Initialize lastUpdateTime on the first tick.
            if (lastUpdateTime === 0) {
                lastUpdateTime = timestamp;
            }

            // Check if at least a second has passed since the last update.
            // This prevents rapid-fire updates when a background tab is re-activated.
            if (timestamp - lastUpdateTime >= 1000) {
                setTimeLeft(calculateTimeLeft(targetDate));
                // Adjust lastUpdateTime by multiples of 1000 to prevent drift and stay on the second boundary.
                lastUpdateTime += 1000 * Math.floor((timestamp - lastUpdateTime) / 1000);
            }
        };

        // Start the animation loop.
        animationFrameId = requestAnimationFrame(tick);

        // Cleanup on unmount.
        return () => cancelAnimationFrame(animationFrameId);
    }, [targetDate]);
    
    const hasTimeLeft = Object.values(timeLeft).some(value => value > 0);

    return (
        <div className="my-12 animate-item-enter" style={{ animationDelay: '400ms' }}>
            {hasTimeLeft ? (
                <div>
                  <h2 className="text-xl text-brand-text-dark tracking-widest font-mono text-center mb-6">THE COUNTDOWN BEGINS</h2>
                  <div className="flex justify-center">
                      <TimeUnit value={timeLeft.days} label="Days" />
                      <TimeUnit value={timeLeft.hours} label="Hours" />
                      <TimeUnit value={timeLeft.minutes} label="Minutes" />
                      <TimeUnit value={timeLeft.seconds} label="Seconds" />
                  </div>
                </div>
            ) : (
                <span className="text-2xl text-brand-accent font-bold">The Fest is Live!</span>
            )}
        </div>
    );
};

export default CountdownTimer;