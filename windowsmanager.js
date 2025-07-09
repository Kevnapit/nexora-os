// windowmanager.js
// Manages application window lifecycle and interactions

(() => {
  const container = document.getElementById('windows-container');
  let zIndexCounter = 100; // Base z-index for windows
  let windows = {}; // Active windows registry {appId: windowElement}

  // Creates new application window DOM element
  function createWindow(appId, title) {
    if (windows[appId]) {
      focusWindow(appId);
      return windows[appId];
    }

    const win = document.createElement('div');
    win.classList.add('window');
    win.dataset.app = appId;
    win.style.zIndex = ++zIndexCounter;

    // Position new window with slight random offset
    win.style.top = `${50 + Math.random() * 100}px`;
    win.style.left = `${50 + Math.random() * 100}px`;

    // Build window chrome
    const titleBar = document.createElement('div');
    titleBar.classList.add('title-bar');

    const titleSpan = document.createElement('div');
    titleSpan.classList.add('title');
    titleSpan.textContent = title;

    const controls = document.createElement('div');
    controls.classList.add('controls');

    // Window control buttons
    ['Minimize', 'Close'].forEach((action, i) => {
      const btn = document.createElement('button');
      btn.classList.add('control-btn');
      btn.title = action;
      btn.innerHTML = action === 'Minimize' ? '–' : '×';
      btn.addEventListener('click', () => {
        action === 'Minimize' 
          ? win.classList.add('minimized') 
          : closeWindow(appId);
        updateTaskbar();
      });
      controls.appendChild(btn);
    });

    titleBar.appendChild(titleSpan);
    titleBar.appendChild(controls);

    // Content area
    const appContent = document.createElement('div');
    appContent.classList.add('app-content');
    appContent.textContent = 'Loading...';

    win.appendChild(titleBar);
    win.appendChild(appContent);
    container.appendChild(win);
    windows[appId] = win;

    // Window dragging implementation
    let offsetX, offsetY, dragging = false;

    titleBar.addEventListener('mousedown', e => {
      dragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      focusWindow(appId);
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mouseup', () => {
      dragging = false;
      document.body.style.userSelect = '';
    });

    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      const x = Math.max(0, Math.min(
        window.innerWidth - win.offsetWidth, 
        e.clientX - offsetX
      ));
      const y = Math.max(0, Math.min(
        window.innerHeight - win.offsetHeight, 
        e.clientY - offsetY
      ));
      win.style.left = `${x}px`;
      win.style.top = `${y}px`;
    });

    updateTaskbar();
    return win;
  }

  // Brings window to front and un-minimizes
  function focusWindow(appId) {
    if (!windows[appId]) return;
    windows[appId].style.zIndex = ++zIndexCounter;
    windows[appId].classList.remove('minimized');
    updateTaskbar();
  }

  // Removes window from DOM and registry
  function closeWindow(appId) {
    if (!windows[appId]) return;
    windows[appId].remove();
    delete windows[appId];
    updateTaskbar();
  }

  // Checks if window exists
  function isOpen(appId) {
    return !!windows[appId];
  }

  // Notifies taskbar of window state changes
  function updateTaskbar() {
    window.updateTaskbarIcons?.(Object.keys(windows), windows);
  }

  // Public API for opening applications
  window.openAppWindow = (appId, title = '') => {
    title = title || `${appId[0].toUpperCase()}${appId.slice(1)}`;
    const win = createWindow(appId, title);
    loadAppContent(appId, win.querySelector('.app-content'));
    focusWindow(appId);
  };

  // Dynamically loads application content
  async function loadAppContent(appId, container) {
    container.textContent = 'Loading app...';

    try {
      if (!window.loadedApps) window.loadedApps = {};
      if (!window.loadedApps[appId]) {
        await import(`./apps/${appId}.js`);
        window.loadedApps[appId] = true;
      }
      if (window.appInit?.[appId]) {
        container.innerHTML = '';
        window.appInit[appId](container);
      } else {
        container.textContent = `App "${appId}" not found.`;
      }
    } catch (err) {
      container.textContent = `Failed to load app: ${err.message}`;
    }
  }

  // Initialization hook
  window.windowManagerInit = () => {};
})();