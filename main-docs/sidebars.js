// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'langchain-introduction',
    {
      type: 'category',
      label: 'Oct 2023',
      items: [
        'oct-2023/streamlit-streaming',
        'oct-2023/streamlit-document-search',
        'oct-2023/search-chat',
        'oct-2023/streamlit-introduction',
      ],
    },
    {
      type: 'category',
      label: 'Nov 2023',
      items: [
        'nov-2023/langserve-pirate-speak',
      ],
    },
    {
      type: 'category',
      label: 'Dec 2023',
      items: [
        'dec-2023/introduction-to-dec-2023',
        'dec-2023/docker-introduction',
        'dec-2023/langserve-on-docker',
        'dec-2023/pandas-df-agent',
        'dec-2023/rag-quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Oct 2024',
      items: [
        'oct-2024/introduction-to-110',
        'oct-2024/session',
        'oct-2024/email-rag-showcase',
        'oct-2024/perplexity-clone-showcase',
        'oct-2024/ai-accelerated-software-development-panel',
      ],
    },
    // You can add more categories or documents here as needed
  ],
};

export default sidebars;
