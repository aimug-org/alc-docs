// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Austin LangChain',
  tagline: 'Learn, Connect, and Build with LangChain',
  favicon: 'img/alc-favicon.ico',

  url: 'https://aimug-org.github.io/',
  baseUrl: '/',

  organizationName: 'aimug-org',
  projectName: 'alc-docs',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/aimug-org/austin_langchain/tree/main/main-docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/aimug-org/austin_langchain/tree/main/main-docs/',
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
        title: 'Austin LangChain',
        logo: {
          alt: 'Austin LangChain Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/events', label: 'Events', position: 'left'},
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
                label: 'Langchain Introduction',
                to: '/docs/langchain-introduction',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Meetup',
                href: 'https://www.meetup.com/austin-langchain-ai-group/',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/JzWgadPFQd',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/AustinLangChain',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig',
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
                href: 'https://github.com/aimug-org/austin_langchain',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Austin LangChain Community. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
