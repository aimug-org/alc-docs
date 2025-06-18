import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import NewsletterPopup from '@site/src/components/NewsletterPopup';
import IndependenceDayPopup from '@site/src/components/IndependenceDayPopup';
import { isIndependenceDayPeriod } from '@site/src/components/IndependenceDayPopup/utils';

export default function Layout(props) {
  // Show Independence Day popup until July 4th, 2025, then switch back to newsletter
  const showIndependencePopup = isIndependenceDayPeriod();

  return (
    <>
      <OriginalLayout {...props} />
      {showIndependencePopup ? <IndependenceDayPopup /> : <NewsletterPopup />}
    </>
  );
}
