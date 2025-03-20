import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './subscribe-success.module.css';

function SubscriptionSuccessHeader() {
  return (
    <header className={clsx('hero', styles.successBanner)}>
      <div className="container">
        <div className={styles.successIcon}>
          <i className="fas fa-envelope-open-text"></i>
        </div>
        <Heading as="h1" className="hero__title">
          You're Almost There!
        </Heading>
        <p className="hero__subtitle">
          Please check your email to confirm your subscription
        </p>
      </div>
    </header>
  );
}

function EmailVerificationSection() {
  return (
    <section className={styles.verificationSection}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={styles.verificationCard}>
              <Heading as="h2">
                <i className="fas fa-inbox"></i> Check Your Inbox
              </Heading>
              <p>
                We've sent a confirmation email to the address you provided. To complete your
                subscription, please click the verification link in that email.
              </p>
              <div className={styles.verificationSteps}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <Heading as="h3">Check your email</Heading>
                    <p>Look for an email from Austin LangChain AIMUG</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <Heading as="h3">Click the confirmation link</Heading>
                    <p>Verify your email address to complete your subscription</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <Heading as="h3">Start receiving updates</Heading>
                    <p>Get the latest news, event announcements, and community updates</p>
                  </div>
                </div>
              </div>
              <div className={styles.emailTips}>
                <Heading as="h3">Can't find the email?</Heading>
                <ul>
                  <li>Check your spam or promotions folder</li>
                  <li>Make sure you entered your email address correctly</li>
                  <li>Allow a few minutes for the email to arrive</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityConnectionSection() {
  return (
    <section className={styles.connectSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          While You Wait, Connect With Us
        </Heading>
        <p className={styles.sectionDescription}>
          Join our vibrant community and start engaging with AI enthusiasts, developers, and innovators
        </p>
        
        <div className={styles.communityCards}>
          <div className="row">
            <div className="col col--4">
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <i className="fab fa-discord"></i>
                  <Heading as="h3">Join Discord</Heading>
                </div>
                <div className={styles.cardBody}>
                  <p>Chat with members, get help, and share your projects</p>
                  <div className={styles.buttonContainer}>
                    <a href="https://discord.gg/JzWgadPFQd" className="button button--primary">Join Discord</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col col--4">
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <i className="fab fa-twitter"></i>
                  <Heading as="h3">Follow on Twitter</Heading>
                </div>
                <div className={styles.cardBody}>
                  <p>Stay updated with the latest news and announcements</p>
                  <div className={styles.buttonContainer}>
                    <a href="https://twitter.com/AustinLangChain" className="button button--primary">Follow Us</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col col--4">
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <i className="fab fa-youtube"></i>
                  <Heading as="h3">Subscribe on YouTube</Heading>
                </div>
                <div className={styles.cardBody}>
                  <p>Watch tutorials, presentations, and event recordings</p>
                  <div className={styles.buttonContainer}>
                    <a href="https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig" className="button button--primary">Subscribe</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.eventsTeaser}>
          <Heading as="h3">
            <i className="fas fa-calendar-alt"></i> Upcoming Events
          </Heading>
          <p>
            Join us at our next monthly showcase, weekly office hours, or hacky hour. 
            Learn, connect, and build with the Austin LangChain community.
          </p>
          <div className={styles.eventsButtonContainer}>
            <Link to="/events" className="button button--secondary button--lg">
              View Events Calendar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReturnHomeSection() {
  return (
    <section className={styles.returnSection}>
      <div className="container">
        <div className={styles.returnContainer}>
          <Link to="/" className="button button--outline button--secondary">
            <i className="fas fa-arrow-left"></i> Return to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function SubscribeSuccess() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Subscription Confirmation"
      description="Thank you for subscribing to the Austin LangChain AIMUG newsletter">
      <SubscriptionSuccessHeader />
      <main>
        <EmailVerificationSection />
        <CommunityConnectionSection />
        <ReturnHomeSection />
      </main>
    </Layout>
  );
}
