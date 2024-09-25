// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'langchain-introduction',
    {
      type: 'category',
      label: 'Langchain 101',
      items: [
        'langchain-101/streamlit-streaming',
        'langchain-101/streamlit-document-search',
        'langchain-101/search-chat',
        'langchain-101/streamlit-introduction',
      ],
    },
    {
      type: 'category',
      label: 'Langchain 102',
      items: [
        'langchain-102/langserve-pirate-speak',
      ],
    },
    // You can add more categories or documents here as needed
  ],
};

export default sidebars;
