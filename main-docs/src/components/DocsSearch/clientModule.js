import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  let searchWidgetLoaded = false;
  let searchWidgetInstance = null;

  // Install global error handler to suppress widget errors
  window.addEventListener('error', function(event) {
    const errorStr = event.message || '';
    if (errorStr.includes('nlweb') ||
        errorStr.includes('plain-frost-e011') ||
        event.filename?.includes('plain-frost-e011')) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
  }, true);

  // Override console.error to suppress widget errors
  const originalError = console.error;
  console.error = function(...args) {
    const errorStr = String(args[0] || '');
    if (errorStr.includes('nlweb') || errorStr.includes('plain-frost-e011')) {
      return;
    }
    originalError.apply(console, args);
  };

  // Add search button to navbar
  function addSearchButton() {
    const navbar = document.querySelector('.navbar__items.navbar__items--right');
    if (navbar && !document.getElementById('docs-search-button') && !document.getElementById('docs-search-container')) {
      const button = document.createElement('button');
      button.id = 'docs-search-button';
      button.className = 'docs-search-button';
      button.innerHTML = '<svg width="20" height="20" class="DocSearch-Search-Icon" viewBox="0 0 20 20"><path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      button.setAttribute('aria-label', 'Search documentation');
      button.onclick = loadSearchWidget;

      navbar.insertBefore(button, navbar.firstChild);
    } else if (!navbar) {
      setTimeout(addSearchButton, 100);
    }
  }

  // Re-add search button on route changes
  function handleRouteChange() {
    // Wait a bit for React to finish rendering
    setTimeout(addSearchButton, 100);
  }

  // Load search widget on demand
  function loadSearchWidget() {
    if (searchWidgetLoaded) return;
    searchWidgetLoaded = true;

    const button = document.getElementById('docs-search-button');
    if (button) {
      button.style.display = 'none'; // Hide button, show widget
    }

    const navbar = document.querySelector('.navbar__items.navbar__items--right');
    if (!navbar) return;

    const container = document.createElement('div');
    container.id = 'docs-search-container';
    container.style.marginLeft = '1rem';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    navbar.insertBefore(container, navbar.firstChild);

    // Load and initialize widget (construct URL dynamically to avoid webpack bundling)
    const widgetUrl = 'https:' + '//' + 'plain-frost-e011-nlweb.colin-eb5.workers.dev/nlweb-dropdown-chat.js';

    // Use Function constructor to create import at runtime
    const loadModule = new Function('url', 'return import(url)');

    loadModule(widgetUrl)
      .then((module) => {
        try {
          const { NLWebDropdownChat } = module;
          searchWidgetInstance = new NLWebDropdownChat({
            containerId: 'docs-search-container',
            site: 'https://plain-frost-e011-nlweb.colin-eb5.workers.dev',
            placeholder: 'Search for docs...',
            endpoint: 'https://plain-frost-e011-nlweb.colin-eb5.workers.dev'
          });
        } catch (error) {
          // Silently handle errors
        }
      })
      .catch(error => {
        // Silently handle errors
      });
  }

  // Initialize search button when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSearchButton);
  } else {
    addSearchButton();
  }

  // Continuously check and re-add button if missing (handles client-side routing)
  setInterval(() => {
    const button = document.getElementById('docs-search-button');
    const container = document.getElementById('docs-search-container');

    // Only add button if neither button nor container exists
    if (!button && !container) {
      addSearchButton();
    }
  }, 500); // Check every 500ms
}
