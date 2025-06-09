// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI Middleware Users Group',
  tagline: 'Learn, Connect, and Build in the open',
  favicon: 'img/favicon.ico',

  url: 'https://aimug.org',
  baseUrl: '/',

  organizationName: 'aimug-org',
  projectName: 'alc-docs',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/aimug-org/alc-docs/tree/main/main-docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/aimug-org/alc-docs/tree/main/main-docs/',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All posts',
          // Hide future-dated posts
          include: ['**/*.{md,mdx}'],
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
          ],
          // Only show posts with dates <= current date
          onlyIncludeCurrentPosts: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/alc-docs-social-card.jpg',
      navbar: {
        title: 'AI Middleware Users Group',
        logo: {
          alt: 'AIMUG - AI Middleware Users Group Logo',
          src: 'img/austin_langchain-192x192.png',
        },
        items: [
          {to: '/events', label: 'Events', position: 'left'},
          {to: '/community', label: 'Community', position: 'left'},
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Learn',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/support', label: 'Support', position: 'left'},
          {
            href: 'https://github.com/aimug-org/austin_langchain',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/getting-started',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/JzWgadPFQd',
              },
              {
                label: 'Meetup',
                href: 'https://www.meetup.com/austin-langchain-ai-group/',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/AustinLangChain',
              },
              {
                label: 'Volunteer',
                to: '/volunteer',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/aimug-org/alc-docs',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} AI Middleware Users Group. Creative Commons Attribution 4.0.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
