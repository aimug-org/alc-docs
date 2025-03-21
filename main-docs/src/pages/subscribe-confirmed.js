import React, { useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './subscribe-confirmed.module.css';

function ConfirmedHeader() {
  return (
    <header className={clsx('hero', styles.confirmedBanner)}>
      <div className="container">
        <div className={styles.confirmedIcon}>
          <i className="fas fa-check-circle"></i>
        </div>
        <Heading as="h1" className="hero__title">
          Subscription Confirmed!
        </Heading>
        <p className="hero__subtitle">
          You're now officially subscribed to the Austin LangChain newsletter
        </p>
      </div>
    </header>
  );
}

function WelcomeSection() {
  return (
    <section className={styles.welcomeSection}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={styles.welcomeCard}>
              <Heading as="h2">
                <i className="fas fa-paper-plane"></i> Welcome to Our Community!
              </Heading>
              <p className={styles.leadText}>
                Thank you for subscribing to our newsletter. You'll now receive regular updates on:
              </p>
              <div className={styles.benefitsList}>
                <div className={styles.benefit}>
                  <div className={styles.benefitIcon}>
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className={styles.benefitContent}>
                    <Heading as="h3">Upcoming Events</Heading>
                    <p>Monthly meetups, office hours, and special community gatherings</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <div className={styles.benefitIcon}>
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <div className={styles.benefitContent}>
                    <Heading as="h3">Technical Content</Heading>
                    <p>Tutorials, code examples, and the latest AI middleware innovations</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <div className={styles.benefitIcon}>
                    <i className="fas fa-users"></i>
                  </div>
                  <div className={styles.benefitContent}>
                    <Heading as="h3">Community News</Heading>
                    <p>Project spotlights, member achievements, and collaboration opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NextStepsSection() {
  return (
    <section className={styles.nextStepsSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Next Steps to Get Involved
        </Heading>
        <p className={styles.sectionDescription}>
          Here are some ways to connect with the community right now
        </p>
        
        <div className={styles.nextStepsCards}>
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
                  <i className="fas fa-calendar-check"></i>
                  <Heading as="h3">RSVP for Events</Heading>
                </div>
                <div className={styles.cardBody}>
                  <p>Check out our calendar and join our next meetup</p>
                  <div className={styles.buttonContainer}>
                    <Link to="/events" className="button button--primary">View Events</Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col col--4">
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <i className="fas fa-book"></i>
                  <Heading as="h3">Explore Resources</Heading>
                </div>
                <div className={styles.cardBody}>
                  <p>Browse our documentation and technical guides</p>
                  <div className={styles.buttonContainer}>
                    <Link to="/docs/Austin-LangChain-AIMUG-Introduction" className="button button--primary">Read Docs</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialSection() {
  return (
    <section className={styles.socialSection}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={styles.socialCard}>
              <Heading as="h2">
                <i className="fas fa-share-alt"></i> Connect With Us
              </Heading>
              <p>
                Follow us on social media to stay updated with the latest news, events, and community highlights.
              </p>
              <div className={styles.socialLinks}>
                <a href="https://twitter.com/AustinLangChain" className={styles.socialLink} aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig" className={styles.socialLink} aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://github.com/aimug-org" className={styles.socialLink} aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
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

export default function SubscribeConfirmed() {
  const {siteConfig} = useDocusaurusContext();
  
  // Mark user as subscribed in localStorage when they reach this page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('alcNewsletterSubscribed', 'true');
    }
  }, []);
  return (
    <Layout
      title="Subscription Confirmed"
      description="Your subscription to the Austin LangChain AIMUG newsletter has been confirmed">
      <ConfirmedHeader />
      <main>
        <WelcomeSection />
        <NextStepsSection />
        <SocialSection />
        <ReturnHomeSection />
      </main>
    </Layout>
  );
}
