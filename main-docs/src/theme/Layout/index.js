import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import NewsletterPopup from '@site/src/components/NewsletterPopup';

export default function Layout(props) {
  return (
    <>
      <OriginalLayout {...props} />
      <NewsletterPopup />
    </>
  );
}
