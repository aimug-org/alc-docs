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
          AI Middleware Users Group
        </Heading>
        <p className="hero__subtitle">Austin LangChain AIMUG</p>
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
      title: 'Support',
      icon: 'fas fa-heart',
      description: 'Help sustain our community through sponsorships, donations, or partnerships. Every contribution matters!',
      link: '/support',
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

function SupportCallout() {
  return (
    <section className={styles.supportCallout}>
      <div className="container">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <div className={styles.supportCard}>
              <div className="text--center">
                <div className={styles.supportIcon}>
                  <i className="fas fa-heart"></i>
                </div>
                <Heading as="h2" className={styles.supportTitle}>
                  Help Us Grow Austin's AI Community
                </Heading>
                
                {/* Impact Stats */}
                <div className={styles.impactStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>1200+</div>
                    <div className={styles.statLabel}>Active Members</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>50+</div>
                    <div className={styles.statLabel}>Events Hosted</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>100%</div>
                    <div className={styles.statLabel}>Free to Attend</div>
                  </div>
                </div>

                <p className={styles.supportDescription}>
                  AIMUG operates as a <strong>public good</strong>, bringing cutting-edge AI middleware skills to our community. 
                  Your donations enable us to provide <strong>free events</strong>, <strong>educational content</strong>, and 
                  <strong>networking opportunities</strong> that advance Austin's AI ecosystem.
                </p>

                {/* Value Proposition */}
                <div className={styles.valueProps}>
                  <div className={styles.valueProp}>
                    <i className="fas fa-graduation-cap"></i>
                    <span>Expert-led workshops & tutorials</span>
                  </div>
                  <div className={styles.valueProp}>
                    <i className="fas fa-network-wired"></i>
                    <span>Connect with AI professionals</span>
                  </div>
                  <div className={styles.valueProp}>
                    <i className="fas fa-code-branch"></i>
                    <span>Open-source project collaboration</span>
                  </div>
                </div>

                <div className={styles.donationCallout}>
                  <p className={styles.donationText}>
                    <strong>Every donation helps keep our events free for everyone</strong>
                  </p>
                </div>

                <div className={styles.supportButtons}>
                  <Link
                    className={`button button--primary button--lg ${styles.donateButton}`}
                    to="/support">
                    💰 Donate Now
                  </Link>
                  <Link
                    className="button button--secondary button--lg"
                    to="/volunteer">
                    🤝 Volunteer
                  </Link>
                </div>

                {/* Social Proof */}
                <div className={styles.socialProof}>
                  <p className={styles.broadcastNote}>
                    <i className="fas fa-tv"></i>
                    <strong>Reaching thousands:</strong> Broadcasting on YouTube, Austin Public Access (Ch 11 & 16), and Austin Community College TV
                  </p>
                  <div className={styles.testimonial}>
                    <p>"AIMUG has been instrumental in advancing Austin's AI community. The quality of content and networking opportunities is unmatched."</p>
                    <cite>— Community Member</cite>
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
      title="AI Middleware Users Group - Austin LangChain AIMUG"
      description="AI Middleware Users Group (AIMUG) - Austin's premier community for LangChain developers, AI researchers, and middleware enthusiasts. Learn, Connect, and Build with cutting-edge AI technologies.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <SupportCallout />
        <NewsletterSignup />
      </main>
    </Layout>
  );
}
