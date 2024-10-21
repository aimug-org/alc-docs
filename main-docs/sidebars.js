const fs = require('fs');
const path = require('path');

function generateSidebar() {
  const docsPath = path.join(__dirname, 'docs');
  const folders = fs.readdirSync(docsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => /^\w+-\d{4}$/.test(name))
    .sort((a, b) => {
      const [aMonth, aYear] = a.split('-');
      const [bMonth, bYear] = b.split('-');
      return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
    });

  const sidebar = [
    'langchain-introduction',
    ...folders.map(folder => ({
      type: 'category',
      label: formatFolderName(folder),
      items: fs.readdirSync(path.join(docsPath, folder))
        .filter(file => file.endsWith('.md'))
        .map(file => `${folder}/${path.parse(file).name}`),
    })),
  ];

  return {
    tutorialSidebar: sidebar,
  };
}

function formatFolderName(folder) {
  const [month, year] = folder.split('-');
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

module.exports = generateSidebar();
