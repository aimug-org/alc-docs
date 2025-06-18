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

  // Group folders by year
  const foldersByYear = groupFoldersByYear(folders);
  
  // Get current year and month
  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonth = now.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
  const currentFolderName = `${currentMonth}-${currentYear}`;
  
  // Build year-based sidebar structure
  const yearCategories = Object.keys(foldersByYear)
    .sort((a, b) => parseInt(b) - parseInt(a)) // Most recent year first
    .map(year => ({
      type: 'category',
      label: `📅 ${year}${year === currentYear ? ' (Current)' : ''}`,
      items: foldersByYear[year].map(folder => ({
        type: 'category',
        label: formatFolderName(folder, folder === currentFolderName),
        items: generateFolderItems(path.join(docsPath, folder), folder),
        collapsible: true,
        collapsed: true, // All months collapsed by default
      })),
      collapsible: true,
      collapsed: true, // All years collapsed by default
    }));

  const sidebar = [
    'Austin-LangChain-AIMUG-Introduction',
    ...yearCategories,
  ];

  return {
    tutorialSidebar: sidebar,
  };
}

function groupFoldersByYear(folders) {
  const foldersByYear = {};
  
  folders.forEach(folder => {
    const [month, year] = folder.split('-');
    if (!foldersByYear[year]) {
      foldersByYear[year] = [];
    }
    foldersByYear[year].push(folder);
  });
  
  // Sort months within each year chronologically
  Object.keys(foldersByYear).forEach(year => {
    foldersByYear[year].sort((a, b) => {
      const [aMonth] = a.split('-');
      const [bMonth] = b.split('-');
      return new Date(`${aMonth} 1, ${year}`) - new Date(`${bMonth} 1, ${year}`);
    });
  });
  
  return foldersByYear;
}

function generateFolderItems(folderPath, basePath) {
  const items = [];
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  
  // First, add all markdown files in the current directory
  const mdFiles = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => entry.name)
    .sort((a, b) => {
      // Put index.md first
      if (a === 'index.md') return -1;
      if (b === 'index.md') return 1;
      return a.localeCompare(b);
    });
  
  mdFiles.forEach(file => {
    const fileName = path.parse(file).name;
    items.push(`${basePath}/${fileName}`);
  });
  
  // Then, add subdirectories as categories
  const subdirs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
  
  subdirs.forEach(subdir => {
    const subdirPath = path.join(folderPath, subdir);
    const subdirItems = generateSubdirectoryItems(subdirPath, `${basePath}/${subdir}`);
    
    if (subdirItems.length > 0) {
      items.push({
        type: 'category',
        label: formatSubdirectoryName(subdir),
        items: subdirItems,
        collapsible: true,
        collapsed: true,
      });
    }
  });
  
  return items;
}

function generateSubdirectoryItems(folderPath, basePath) {
  const items = [];
  
  try {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    
    // Add markdown files
    const mdFiles = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => entry.name)
      .sort((a, b) => {
        // Put index.md first
        if (a === 'index.md') return -1;
        if (b === 'index.md') return 1;
        return a.localeCompare(b);
      });
    
    mdFiles.forEach(file => {
      const fileName = path.parse(file).name;
      items.push(`${basePath}/${fileName}`);
    });
    
    // Recursively add subdirectories
    const subdirs = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();
    
    subdirs.forEach(subdir => {
      const subdirPath = path.join(folderPath, subdir);
      const subdirItems = generateSubdirectoryItems(subdirPath, `${basePath}/${subdir}`);
      
      if (subdirItems.length > 0) {
        items.push({
          type: 'category',
          label: formatSubdirectoryName(subdir),
          items: subdirItems,
          collapsible: true,
          collapsed: true,
        });
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${folderPath}:`, error);
  }
  
  return items;
}

function formatFolderName(folder, isCurrentMonth = false) {
  const [month, year] = folder.split('-');
  const monthName = month.charAt(0).toUpperCase() + month.slice(1);
  
  // Add indicator for current month
  return isCurrentMonth ? `${monthName} (Current)` : monthName;
}

function formatSubdirectoryName(name) {
  // Special formatting for known subdirectory names
  const nameMap = {
    'news': '📰 News & Updates',
    'lightning-talks': '⚡ Lightning Talks',
    'full-sessions': '🎯 Full Sessions',
    'resources': '📚 Resources',
    'ai-ecosystem-2025': '🌐 AI Ecosystem 2025',
    'presentation-materials': '📊 Presentation Materials',
  };
  
  if (nameMap[name]) {
    return nameMap[name];
  }
  
  // Default formatting: capitalize words and replace hyphens with spaces
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

module.exports = generateSidebar();
