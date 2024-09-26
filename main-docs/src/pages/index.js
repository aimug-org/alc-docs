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
            to="/docs/langchain-introduction">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({title, description, icon}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <i className={`featureIcon ${icon}`}></i>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  const FeatureList = [
    {
      title: 'Learn',
      icon: 'fas fa-book',
      description: 'Explore our comprehensive documentation and tutorials on LangChain and associated ecosystem technologies.',
    },
    {
      title: 'Connect',
      icon: 'fas fa-users',
      description: 'Join our vibrant AIMUG community of developers, researchers, and enthusiasts in Austin and abroad.',
    },
    {
      title: 'Build',
      icon: 'fas fa-code',
      description: 'Create innovative applications and contribute to open-source projects using LangChain ',
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

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to AIMUG - ${siteConfig.title}`}
      description="AIMUG - AI Middleware Users Group - Learn, Connect, and Build with LangChain">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
