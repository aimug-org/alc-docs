import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title} AIMUG
        </Heading>
        <p className="hero__subtitle">AI Middleware Users Group</p>
        <p>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/community">
            Join Our Community
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({title, description, icon, link}) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link} className={styles.featureLink}>
        <div className="text--center">
          <i className={`featureIcon ${icon}`}></i>
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

function HomepageFeatures() {
  const FeatureList = [
    {
      title: 'Learn',
      icon: 'fas fa-book',
      description: 'Access recordings and documentation from our monthly meetings, showcases, and technical presentations.',
      link: '/docs/Austin-LangChain-AIMUG-Introduction',
    },
    {
      title: 'Connect',
      icon: 'fas fa-users',
      description: 'Join our vibrant AIMUG community of developers, researchers, and enthusiasts in Austin and abroad.',
      link: '/community',
    },
    {
      title: 'Build',
      icon: 'fas fa-code',
      description: 'Create innovative applications and contribute to open-source projects using LangChain ',
      link: 'https://github.com/aimug-org',
    },
    {
      title: 'Volunteer',
      icon: 'fas fa-hands-helping',
      description: 'Join our team of volunteers and help make our events successful while gaining valuable experience.',
      link: '/volunteer',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSignup() {
  return (
    <section className={styles.newsletter}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={styles.newsletterCard}>
              <Heading as="h2" className={styles.newsletterTitle}>
                Subscribe to Our Newsletter
              </Heading>
              <p className={styles.newsletterDescription}>
                Stay up-to-date with our latest events, technical content, and community news.
              </p>
              <form
                action="https://buttondown.com/api/emails/embed-subscribe/aimug.org"
                method="post"
                target="popupwindow"
                onSubmit={() => window.open('https://newsletter.aimug.org', 'popupwindow')}
                className={styles.newsletterForm}
              >
                <input 
                  type="email" 
                  name="email" 
                  id="home-bd-email" 
                  placeholder="Enter your email address" 
                  className={styles.newsletterInput}
                  required
                />
                <button type="submit" className="button button--primary">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to AIMUG - ${siteConfig.title}`}
      description="AIMUG - AI Middleware Users Group - Learn, Connect, and Build with LangChain">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <NewsletterSignup />
      </main>
    </Layout>
  );
}
