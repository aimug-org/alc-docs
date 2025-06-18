/**
 * Utility functions for the Independence Day popup component
 */

// Storage keys for Independence Day popup
const INDEPENDENCE_DISMISSED_KEY = 'alcIndependenceDayDismissed';
const INDEPENDENCE_LAST_SHOWN_KEY = 'alcIndependenceDayLastShown';
const INDEPENDENCE_INTERACTED_KEY = 'alcIndependenceDayInteracted';

// Independence Day 2025 target date
const JULY_4TH_2025 = new Date('2025-07-04T23:59:59');

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
 * Check if we're still in the Independence Day campaign period
 * @returns {boolean} True if before July 4th, 2025, false otherwise
 */
export const isIndependenceDayPeriod = () => {
  return new Date() < JULY_4TH_2025;
};

/**
 * Calculate days remaining until July 4th, 2025
 * @returns {number} Days remaining (0 if past deadline)
 */
export const getDaysUntilIndependenceDay = () => {
  const now = new Date();
  const timeDifference = JULY_4TH_2025.getTime() - now.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return Math.max(0, daysDifference);
};

/**
 * Check if the user has recently dismissed the Independence Day popup
 * @param {number} dismissPeriod Time in days before showing again after dismissal (default: 3)
 * @returns {boolean} True if recently dismissed, false otherwise
 */
export const recentlyDismissedIndependence = (dismissPeriod = 3) => {
  if (!isLocalStorageAvailable()) return false;
  
  const dismissed = localStorage.getItem(INDEPENDENCE_DISMISSED_KEY);
  if (!dismissed) return false;
  
  const dismissedTime = parseInt(dismissed, 10);
  const currentTime = new Date().getTime();
  const dismissDuration = dismissPeriod * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  
  return currentTime - dismissedTime < dismissDuration;
};

/**
 * Mark the Independence Day popup as dismissed
 */
export const markIndependenceAsDismissed = () => {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(INDEPENDENCE_DISMISSED_KEY, new Date().getTime().toString());
};

/**
 * Check if the Independence Day popup was recently shown
 * @param {number} showInterval Minimum time in hours between showings (default: 24)
 * @returns {boolean} True if recently shown, false otherwise
 */
export const recentlyShownIndependence = (showInterval = 24) => {
  if (!isLocalStorageAvailable()) return false;
  
  const lastShown = localStorage.getItem(INDEPENDENCE_LAST_SHOWN_KEY);
  if (!lastShown) return false;
  
  const lastShownTime = parseInt(lastShown, 10);
  const currentTime = new Date().getTime();
  const showDuration = showInterval * 60 * 60 * 1000; // Convert hours to milliseconds
  
  return currentTime - lastShownTime < showDuration;
};

/**
 * Mark the Independence Day popup as shown
 */
export const markIndependenceAsShown = () => {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(INDEPENDENCE_LAST_SHOWN_KEY, new Date().getTime().toString());
};

/**
 * Check if the user has already interacted with the Independence Day popup
 * (clicked founding member or donated)
 * @returns {boolean} True if interacted, false otherwise
 */
export const hasInteractedWithIndependence = () => {
  if (!isLocalStorageAvailable()) return false;
  return localStorage.getItem(INDEPENDENCE_INTERACTED_KEY) === 'true';
};

/**
 * Mark that the user has interacted with the Independence Day popup
 */
export const markIndependenceAsInteracted = () => {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(INDEPENDENCE_INTERACTED_KEY, 'true');
};

/**
 * Check if the current page is eligible for the Independence Day popup
 * @returns {boolean} True if on an eligible page, false otherwise
 */
export const isEligiblePage = () => {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname;
  
  // Home page
  const isHomePage = pathname === '/';
  
  // Blog posts (but not blog index or tag pages)
  const isBlogPost = pathname.startsWith('/blog/') &&
                    !pathname.endsWith('/blog/') &&
                    !pathname.includes('/tags/');
  
  // Documentation pages
  const isDocsPage = pathname.startsWith('/docs/');
  
  // Community page
  const isCommunityPage = pathname === '/community';
  
  // Events page
  const isEventsPage = pathname === '/events';
  
  // Don't show on support page (they're already there!)
  const isSupportPage = pathname === '/support';
  if (isSupportPage) return false;
  
  return isHomePage || isBlogPost || isDocsPage || isCommunityPage || isEventsPage;
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
 * Check if the Independence Day popup should be shown based on all conditions
 * @param {number} scrollThreshold Scroll percentage threshold to trigger popup
 * @param {number} dismissPeriod Days to wait after dismissal
 * @param {number} showInterval Hours between showings
 * @returns {boolean} True if popup should be shown, false otherwise
 */
export const shouldShowIndependencePopup = (scrollThreshold = 50, dismissPeriod = 3, showInterval = 24) => {
  // Don't show if not in Independence Day period
  if (!isIndependenceDayPeriod()) return false;
  
  // Don't show if not on an eligible page
  if (!isEligiblePage()) return false;
  
  // Don't show if user already interacted
  if (hasInteractedWithIndependence()) return false;
  
  // Don't show if recently dismissed
  if (recentlyDismissedIndependence(dismissPeriod)) return false;
  
  // Don't show if recently shown
  if (recentlyShownIndependence(showInterval)) return false;
  
  // Show if scrolled past threshold
  return getScrollPercentage() >= scrollThreshold;
};

/**
 * Track analytics event for Independence Day popup interactions
 * @param {string} action The action taken (view, dismiss, founding_member_click, donate_click)
 * @param {string} value Optional value (donation amount, etc.)
 */
export const trackIndependenceEvent = (action, value = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventData = {
      event_category: 'independence_day_popup',
      event_label: action
    };
    
    if (value) {
      eventData.value = value;
    }
    
    window.gtag('event', `independence_${action}`, eventData);
  }
};

/**
 * Debug function to clear all Independence Day popup localStorage flags
 * Useful for testing the popup behavior
 */
export const clearIndependenceFlags = () => {
  if (!isLocalStorageAvailable()) {
    console.log('localStorage is not available');
    return;
  }
  
  localStorage.removeItem(INDEPENDENCE_DISMISSED_KEY);
  localStorage.removeItem(INDEPENDENCE_LAST_SHOWN_KEY);
  localStorage.removeItem(INDEPENDENCE_INTERACTED_KEY);
  
  console.log('Independence Day popup flags cleared. Popup should appear on next eligible page scroll.');
};

// Make debug function available globally for console access
if (typeof window !== 'undefined') {
  window.clearIndependenceFlags = clearIndependenceFlags;
}