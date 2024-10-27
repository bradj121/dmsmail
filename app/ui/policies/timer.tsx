import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
    
  const calculateTimeRemaining = (targetDate: Date): number => {
    const now = new Date().getTime();
    const difference = targetDate.getTime() - now;

    return Math.max(difference, 0);
  };
  
  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining(targetDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  const formatTime = (time: number): string => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      {timeRemaining > 0 ? (
        <p>{formatTime(timeRemaining)}</p>
      ) : (
        <p>Time's up!</p>
      )}
    </div>
  );
};

export default Countdown;