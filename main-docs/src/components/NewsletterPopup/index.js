import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';
import clsx from 'clsx';
import {
  shouldShowPopup,
  markAsShown,
  markAsDismissed,
  getScrollPercentage,
  isBlogPostPage
} from './utils';

/**
 * Newsletter popup component that appears when users scroll to 50% of a blog post
 */
export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const popupRef = useRef(null);
  const location = useLocation();
  const scrollThreshold = 50; // Show popup at 50% scroll
  
  // Reset visibility when navigating to a new page
  useEffect(() => {
    setIsVisible(false);
  }, [location.pathname]);
  
  // Handle scroll events to show popup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Only set up scroll listener on blog post pages
    if (!isBlogPostPage()) return;
    
    const handleScroll = () => {
      if (!isVisible && shouldShowPopup(scrollThreshold)) {
        setIsVisible(true);
        markAsShown();
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
    markAsDismissed();
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Redirect to the subscription page with the email pre-filled
    if (email.trim()) {
      window.location.href = `/subscribe-success?email=${encodeURIComponent(email)}`;
    }
  };
  
  // Don't render anything on server-side
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Don't render on non-blog pages
  if (!isBlogPostPage()) {
    return null;
  }
  
  return (
    <div 
      ref={popupRef}
      className={clsx(styles.popupContainer, isVisible && styles.popupVisible)}
      role="dialog"
      aria-labelledby="newsletter-popup-title"
    >
      <div className={styles.popupHeader}>
        <h3 id="newsletter-popup-title" className={styles.popupTitle}>
          Join the Austin LangChain Community
        </h3>
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
          Get the latest on AI innovation, upcoming events, and technical resources delivered to your inbox.
        </p>
        
        <form className={styles.subscribeForm} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.emailInput}
            placeholder="Your email address"
            value={email}
            onChange={handleEmailChange}
            required
            aria-label="Email address"
          />
          
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.subscribeButton}>
              Subscribe
            </button>
            <button 
              type="button" 
              className={styles.dismissText}
              onClick={handleDismiss}
            >
              Maybe later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
