import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './unsubscribe-success.module.css';

function UnsubscribeHeader() {
  return (
    <header className={clsx('hero', styles.unsubscribeBanner)}>
      <div className="container">
        <div className={styles.unsubscribeIcon}>
          <i className="fas fa-envelope"></i>
        </div>
        <Heading as="h1" className="hero__title">
          You've Been Unsubscribed
        </Heading>
        <p className="hero__subtitle">
          We're sorry to see you go, but we respect your decision
        </p>
      </div>
    </header>
  );
}

function FeedbackSection() {
  return (
    <section className={styles.feedbackSection}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={styles.feedbackCard}>
              <Heading as="h2">
                <i className="fas fa-comment-alt"></i> We Value Your Feedback
              </Heading>
              <p>
                We strive to make our newsletter valuable and relevant. If you have a moment,
                we'd appreciate knowing why you decided to unsubscribe:
              </p>
              <div className={styles.feedbackOptions}>
                <Link to="https://docs.google.com/forms/d/e/1FAIpQLSc6He6SQ0sqsrAKpRFkOy1ib479xyWjeAIiuisqKyYc9ZAhcQ/viewform?usp=header" className="button button--outline button--primary">
                  Share Your Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResubscribeSection() {
  return (
    <section className={styles.resubscribeSection}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={styles.resubscribeCard}>
              <Heading as="h2">
                <i className="fas fa-undo"></i> Changed Your Mind?
              </Heading>
              <p>
                If you unsubscribed by accident or change your mind in the future, 
                you can always resubscribe to stay updated with our latest events and content.
              </p>
              <div className={styles.resubscribeButton}>
                <Link to="/community" className="button button--primary">
                  Resubscribe
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AlternativeConnectionSection() {
  return (
    <section className={styles.alternativeSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Stay Connected in Other Ways
        </Heading>
        <p className={styles.sectionDescription}>
          Even without the newsletter, there are many ways to stay connected with our community
        </p>
        
        <div className={styles.alternativeCards}>
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
            <i className="fas fa-calendar-alt"></i> Attend Our Events
          </Heading>
          <p>
            You're always welcome to join our monthly meetups, weekly office hours, or hacky hours. 
            No subscription required!
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

export default function UnsubscribeSuccess() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Unsubscribe Confirmation"
      description="You have been successfully unsubscribed from the Austin LangChain AIMUG newsletter">
      <UnsubscribeHeader />
      <main>
        <FeedbackSection />
        <ResubscribeSection />
        <AlternativeConnectionSection />
        <ReturnHomeSection />
      </main>
    </Layout>
  );
}
