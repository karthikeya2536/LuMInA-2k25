import React, { useState, useEffect } from 'react';

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

const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-brand-secondary/30 backdrop-blur-sm p-4 rounded-lg w-24 h-24 border border-brand-secondary/50">
        <span className="text-4xl font-bold text-white font-mono tracking-wider">{String(value).padStart(2, '0')}</span>
        <span className="text-sm text-brand-text-dark uppercase tracking-widest">{label}</span>
    </div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);
    
    const hasTimeLeft = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;

    return (
        <div className="my-8 animate-item-enter" style={{ animationDelay: '400ms' }}>
            {hasTimeLeft ? (
                <div className="flex justify-center gap-4 md:gap-8">
                    <TimeBlock value={timeLeft.days} label="Days" />
                    <TimeBlock value={timeLeft.hours} label="Hours" />
                    <TimeBlock value={timeLeft.minutes} label="Minutes" />
                    <TimeBlock value={timeLeft.seconds} label="Seconds" />
                </div>
            ) : (
                <span className="text-2xl text-brand-accent font-bold">The Fest is Live!</span>
            )}
        </div>
    );
};

export default CountdownTimer;
