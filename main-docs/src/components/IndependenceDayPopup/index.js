import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';
import clsx from 'clsx';
import {
  shouldShowIndependencePopup,
  markIndependenceAsShown,
  markIndependenceAsDismissed,
  markIndependenceAsInteracted,
  getDaysUntilIndependenceDay,
  trackIndependenceEvent
} from './utils';

/**
 * Independence Day popup component that appears when users scroll to 50% of eligible pages
 * Promotes founding member signups and donations before July 4th, 2025
 */
export default function IndependenceDayPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const popupRef = useRef(null);
  const location = useLocation();
  const scrollThreshold = 25; // Show popup at 25% scroll
  
  
  
  // Calculate days remaining on mount and update daily
  useEffect(() => {
    const updateDaysRemaining = () => {
      setDaysRemaining(getDaysUntilIndependenceDay());
    };
    
    updateDaysRemaining();
    
    // Update at midnight each day
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      updateDaysRemaining();
      // Set daily interval after first midnight
      const interval = setInterval(updateDaysRemaining, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msUntilMidnight);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Reset visibility when navigating to a new page
  useEffect(() => {
    setIsVisible(false);
  }, [location.pathname]);
  
  // Handle scroll events to show popup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      if (!isVisible && shouldShowIndependencePopup(scrollThreshold)) {
        setIsVisible(true);
        markIndependenceAsShown();
        trackIndependenceEvent('view');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check in case the page is already scrolled
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, scrollThreshold]);
  
  // Handle click outside to dismiss
  useEffect(() => {
    if (typeof window === 'undefined' || !isVisible) return;
    
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleDismiss();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);
  
  // Handle escape key to dismiss
  useEffect(() => {
    if (typeof window === 'undefined' || !isVisible) return;
    
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleDismiss();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isVisible]);
  
  const handleDismiss = () => {
    setIsVisible(false);
    markIndependenceAsDismissed();
    trackIndependenceEvent('dismiss');
  };
  
  const handleFoundingMemberClick = () => {
    markIndependenceAsInteracted();
    trackIndependenceEvent('founding_member_click');
    // Redirect to support page
    window.location.href = '/support';
  };
  
  const handleQuickDonate = (amount) => {
    markIndependenceAsInteracted();
    trackIndependenceEvent('donate_click', amount);
    
    // Direct to Stripe monthly membership links for quick conversion
    const stripeLinks = {
      5: 'https://buy.stripe.com/4gMbJ12fbdsJcjF9Cn57W07',  // Coffee Supporter
      15: 'https://donate.stripe.com/bJe5kD7zv4WderN5m757W08', // Community Sustainer
      25: 'https://donate.stripe.com/3cI8wP1b73S983p4i357W09'  // Event Champion
    };
    
    const stripeUrl = stripeLinks[amount];
    if (stripeUrl) {
      window.open(stripeUrl, '_blank');
    } else {
      // Fallback to support page for any other amounts
      window.location.href = '/support';
    }
  };
  
  // Don't render anything on server-side
  if (typeof window === 'undefined') {
    return null;
  }
  
  const getCountdownText = () => {
    if (daysRemaining === 0) {
      return "🎆 Independence Day is TODAY!";
    } else if (daysRemaining === 1) {
      return "⏰ Only 1 day left!";
    } else {
      return `⏰ ${daysRemaining} days left!`;
    }
  };
  
  const getUrgencyMessage = () => {
    if (daysRemaining <= 3) {
      return "Final chance to help AIMUG achieve independence!";
    } else if (daysRemaining <= 7) {
      return "Time is running out! Help us reach our goal.";
    } else {
      return "Help AIMUG become an independent, sustainable organization.";
    }
  };

  // Only render the popup content if it should be visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={popupRef}
      className={clsx(styles.popupContainer, styles.popupVisible)}
      role="dialog"
      aria-labelledby="independence-popup-title"
    >
      <div className={styles.popupHeader}>
        <div className={styles.headerContent}>
          <h3 id="independence-popup-title" className={styles.popupTitle}>
            🇺🇸 Help AIMUG Achieve Independence!
          </h3>
          <div className={styles.countdown}>
            {getCountdownText()}
          </div>
        </div>
        <button 
          className={styles.closeButton} 
          onClick={handleDismiss}
          aria-label="Close popup"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className={styles.popupContent}>
        <p className={styles.popupMessage}>
          {getUrgencyMessage()}
        </p>
        
        <div className={styles.goalProgress}>
          <div className={styles.progressText}>
            🎯 Goal: 25 Founding Members by July 4th
          </div>
          <div className={styles.progressNote}>
            Join the community building AIMUG's future!
          </div>
        </div>
        
        <div className={styles.actionButtons}>
          <button 
            className={styles.primaryButton}
            onClick={handleFoundingMemberClick}
          >
            ⭐ Become a Founding Member
          </button>
          
          <div className={styles.quickDonateSection}>
            <div className={styles.quickDonateLabel}>Quick Donate:</div>
            <div className={styles.donateButtons}>
              <button 
                className={styles.donateButton}
                onClick={() => handleQuickDonate(5)}
              >
                $5
              </button>
              <button 
                className={styles.donateButton}
                onClick={() => handleQuickDonate(15)}
              >
                $15
              </button>
              <button 
                className={styles.donateButton}
                onClick={() => handleQuickDonate(25)}
              >
                $25
              </button>
            </div>
          </div>
          
          <div className={styles.dismissContainer}>
            <button 
              className={styles.dismissText}
              onClick={handleDismiss}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}