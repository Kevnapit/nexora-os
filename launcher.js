// launcher.js
// Manages taskbar, start menu, and running applications

(() => {
  // DOM elements
  const startButton = document.getElementById('start-button');
  const taskbarApps = document.getElementById('taskbar-apps');
  let startMenuVisible = false;

  // Available applications
  const apps = [
    { id: 'notepad', name: 'Notepad', icon: 'assets/icons/notepad.svg' },
    { id: 'filemanager', name: 'File Manager', icon: 'assets/icons/filemanager.svg' },
    { id: 'terminal', name: 'Terminal', icon: 'assets/icons/terminal.svg' },
    { id: 'settings', name: 'Settings', icon: 'assets/icons/settings.svg' },
    { id: 'security', name: 'Security', icon: 'assets/icons/security.svg' },
    { id: 'bluetooth', name: 'Bluetooth', icon: 'assets/icons/bluetooth.svg' },
    { id: 'compatibility', name: 'Compatibility', icon: 'assets/icons/compatibility.svg' },
    { id: 'updater', name: 'Updater', icon: 'assets/icons/updater.svg' },
  ];

  // Creates and returns start menu element
  function createStartMenu() {
    const menu = document.createElement('div');
    menu.id = 'start-menu';
    Object.assign(menu.style, {
      position: 'fixed',
      bottom: '48px',
      left: '0',
      width: '280px',
      maxHeight: '50vh',
      overflowY: 'auto',
      background: 'rgba(20,20,30,0.9)',
      backdropFilter: 'blur(10px)',
      borderTopRightRadius: '16px',
      borderBottomRightRadius: '16px',
      boxShadow: '0 0 20px rgb(0 0 0 / 0.8)',
      zIndex: '11000',
      display: 'flex',
      flexDirection: 'column'
    });

    apps.forEach(app => {
      const item = document.createElement('div');
      item.classList.add('context-menu-item');
      Object.assign(item.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        cursor: 'pointer'
      });

      const img = document.createElement('img');
      img.src = app.icon;
      img.alt = app.name;
      img.style.width = img.style.height = '28px';

      const span = document.createElement('span');
      span.textContent = app.name;

      item.append(img, span);
      item.onclick = () => {
        openApp(app.id);
        toggleStartMenu(false);
      };

      menu.appendChild(item);
    });

    document.body.appendChild(menu);
    return menu;
  }

  let startMenu;

  // Toggles start menu visibility
  function toggleStartMenu(force) {
    startMenuVisible = force ?? !startMenuVisible;
    
    if (!startMenu) startMenu = createStartMenu();
    startMenu.style.display = startMenuVisible ? 'flex' : 'none';
  }

  // Opens application by ID
  function openApp(appId) {
    window.openAppWindow?.(appId);
  }

  // Updates taskbar with running applications
  function updateTaskbarIcons(openApps, windowsMap) {
    taskbarApps.innerHTML = '';
    
    openApps.forEach(appId => {
      const appMeta = apps.find(a => a.id === appId) || { 
        name: appId, 
        icon: '' 
      };
      
      const iconDiv = document.createElement('div');
      iconDiv.classList.add('taskbar-app-icon');
      
      if (windowsMap[appId] && !windowsMap[appId].classList.contains('minimized')) {
        iconDiv.classList.add('active');
      }
      
      iconDiv.title = appMeta.name;
      
      if (appMeta.icon) {
        const img = document.createElement('img');
        img.src = appMeta.icon;
        img.alt = appMeta.name;
        iconDiv.appendChild(img);
      } else {
        iconDiv.textContent = appMeta.name[0].toUpperCase();
      }

      iconDiv.onclick = () => {
        if (!windowsMap[appId]) {
          openApp(appId);
        } else {
          const win = windowsMap[appId];
          win.classList.toggle('minimized');
          if (!win.classList.contains('minimized')) {
            win.style.zIndex = ++window.zIndexCounter;
          }
        }
      };

      taskbarApps.appendChild(iconDiv);
    });
  }

  // Updates clock display every minute
  function updateClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;
    
    const now = new Date();
    clock.textContent = 
      `${now.getHours().toString().padStart(2,'0')}:` +
      `${now.getMinutes().toString().padStart(2,'0')}`;
  }

  // Initialize launcher components
  window.launcherInit = () => {
    startButton.addEventListener('click', () => toggleStartMenu());
    document.addEventListener('click', e => {
      if (!startButton.contains(e.target) && 
          !startMenu?.contains(e.target)) {
        toggleStartMenu(false);
      }
    });
    
    setInterval(updateClock, 60000);
    updateClock();
  };

  window.updateTaskbarIcons = updateTaskbarIcons;
})();