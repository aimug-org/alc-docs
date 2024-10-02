// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'langchain-introduction',
    {
      type: 'category',
      label: 'Oct 2023',
      items: [
        'langchain-101/streamlit-streaming',
        'langchain-101/streamlit-document-search',
        'langchain-101/search-chat',
        'langchain-101/streamlit-introduction',
      ],
    },
    {
      type: 'category',
      label: 'Nov 2023',
      items: [
        'langchain-102/langserve-pirate-speak',
      ],
    },
    {
      type: 'category',
      label: 'Dec 2023',
      items: [
        'langchain-103/introduction-to-dec-2023',
        'langchain-103/docker-introduction',
        'langchain-103/langserve-on-docker',
        'langchain-103/pandas-df-agent',
        'langchain-103/rag-quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Oct 2024',
      items: [
        'langchain-110/introduction-to-110',
      ],
    },
    // You can add more categories or documents here as needed
  ],
};

export default sidebars;
