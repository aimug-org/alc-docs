import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const IndependenceDayCountdown = () => {
  const [daysRemaining, setDaysRemaining] = useState(null);

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const today = new Date();
      const july4th2025 = new Date('2025-07-04');
      
      // Calculate the difference in time
      const timeDifference = july4th2025.getTime() - today.getTime();
      
      // Calculate the difference in days
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      
      return Math.max(0, daysDifference); // Don't show negative days
    };

    setDaysRemaining(calculateDaysRemaining());

    // Update every day at midnight
    const interval = setInterval(() => {
      setDaysRemaining(calculateDaysRemaining());
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (daysRemaining === null) {
    return <span>⏰ Counting down to Independence Day...</span>;
  }

  if (daysRemaining === 0) {
    return <span className={styles.today}>🇺🇸 Today is Independence Day! 🇺🇸</span>;
  }

  if (daysRemaining < 0) {
    return <span>🇺🇸 Independence Day has passed - thank you for your support!</span>;
  }

  return (
    <span className={styles.countdown}>
      ⏰ <strong>{daysRemaining} days</strong> until Independence Day
    </span>
  );
};

export default IndependenceDayCountdown;