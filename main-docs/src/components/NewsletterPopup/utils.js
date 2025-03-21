/**
 * Utility functions for the newsletter popup component
 */

// Storage keys
const SUBSCRIBED_KEY = 'alcNewsletterSubscribed';
const DISMISSED_KEY = 'alcNewsletterDismissed';
const LAST_SHOWN_KEY = 'alcNewsletterLastShown';

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if the user has already subscribed
 * @returns {boolean} True if subscribed, false otherwise
 */
export const hasSubscribed = () => {
  if (!isLocalStorageAvailable()) return false;
  return localStorage.getItem(SUBSCRIBED_KEY) === 'true';
};

/**
 * Mark the user as subscribed
 */
export const markAsSubscribed = () => {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(SUBSCRIBED_KEY, 'true');
};

/**
 * Check if the user has recently dismissed the popup
 * @param {number} dismissPeriod Time in days before showing again after dismissal
 * @returns {boolean} True if recently dismissed, false otherwise
 */
export const recentlyDismissed = (dismissPeriod = 7) => {
  if (!isLocalStorageAvailable()) return false;
  
  const dismissed = localStorage.getItem(DISMISSED_KEY);
  if (!dismissed) return false;
  
  const dismissedTime = parseInt(dismissed, 10);
  const currentTime = new Date().getTime();
  const dismissDuration = dismissPeriod * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  
  return currentTime - dismissedTime < dismissDuration;
};

/**
 * Mark the popup as dismissed
 */
export const markAsDismissed = () => {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(DISMISSED_KEY, new Date().getTime().toString());
};

/**
 * Check if the popup was recently shown
 * @param {number} showInterval Minimum time in hours between showings
 * @returns {boolean} True if recently shown, false otherwise
 */
export const recentlyShown = (showInterval = 24) => {
  if (!isLocalStorageAvailable()) return false;
  
  const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
  if (!lastShown) return false;
  
  const lastShownTime = parseInt(lastShown, 10);
  const currentTime = new Date().getTime();
  const showDuration = showInterval * 60 * 60 * 1000; // Convert hours to milliseconds
  
  return currentTime - lastShownTime < showDuration;
};

/**
 * Mark the popup as shown
 */
export const markAsShown = () => {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(LAST_SHOWN_KEY, new Date().getTime().toString());
};

/**
 * Check if the current page is a blog post
 * @returns {boolean} True if on a blog post page, false otherwise
 */
export const isBlogPostPage = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith('/blog/') && 
         !window.location.pathname.endsWith('/blog/') &&
         !window.location.pathname.includes('/tags/');
};

/**
 * Calculate the scroll percentage
 * @returns {number} Scroll percentage (0-100)
 */
export const getScrollPercentage = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 0;
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  const clientHeight = document.documentElement.clientHeight || window.innerHeight;
  
  if (scrollHeight <= clientHeight) return 100;
  
  return Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
};

/**
 * Check if the popup should be shown based on all conditions
 * @param {number} scrollThreshold Scroll percentage threshold to trigger popup
 * @param {number} dismissPeriod Days to wait after dismissal
 * @param {number} showInterval Hours between showings
 * @returns {boolean} True if popup should be shown, false otherwise
 */
export const shouldShowPopup = (scrollThreshold = 50, dismissPeriod = 7, showInterval = 24) => {
  // Don't show if not on a blog post page
  if (!isBlogPostPage()) return false;
  
  // Don't show if already subscribed
  if (hasSubscribed()) return false;
  
  // Don't show if recently dismissed
  if (recentlyDismissed(dismissPeriod)) return false;
  
  // Don't show if recently shown
  if (recentlyShown(showInterval)) return false;
  
  // Show if scrolled past threshold
  return getScrollPercentage() >= scrollThreshold;
};
