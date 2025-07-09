// desktop.js
// Handles desktop UI: icons, wallpaper, context menu, and app launching

(() => {
  // DOM elements
  const desktop = document.getElementById('desktop');
  const iconsContainer = document.getElementById('desktop-icons');
  const wallpaperContainer = document.getElementById('wallpaper-container');
  const contextMenu = document.getElementById('context-menu');

  // Predefined desktop icons
  const ICONS = [
    { id: 'notepad', name: 'Notepad', icon: 'assets/icons/notepad.svg' },
    { id: 'filemanager', name: 'File Manager', icon: 'assets/icons/filemanager.svg' },
    { id: 'terminal', name: 'Terminal', icon: 'assets/icons/terminal.svg' },
    { id: 'settings', name: 'Settings', icon: 'assets/icons/settings.svg' },
    { id: 'security', name: 'Security', icon: 'assets/icons/security.svg' },
    { id: 'bluetooth', name: 'Bluetooth', icon: 'assets/icons/bluetooth.svg' },
    { id: 'compatibility', name: 'Compatibility', icon: 'assets/icons/compatibility.svg' },
    { id: 'updater', name: 'Updater', icon: 'assets/icons/updater.svg' },
  ];

  // Current wallpaper path
  let wallpaper = 'assets/wallpaper/default.jpg';

  function setWallpaper(path) {
    wallpaper = path;
    desktop.style.backgroundImage = `url(${wallpaper})`;
  }

  // Renders all desktop icons from ICONS array
  function renderIcons() {
    iconsContainer.innerHTML = '';
    ICONS.forEach(icon => {
      const div = document.createElement('div');
      div.classList.add('desktop-icon');
      div.dataset.app = icon.id;
      div.title = icon.name;

      const img = document.createElement('img');
      img.src = icon.icon;
      img.alt = icon.name;

      const label = document.createElement('div');
      label.textContent = icon.name;

      div.appendChild(img);
      div.appendChild(label);
      iconsContainer.appendChild(div);
    });
  }

  // Delegates app launching to window.openAppWindow if available
  function openApp(appId) {
    window.openAppWindow?.(appId);
  }

  // Handles both single and double clicks on icons
  function onIconClick(e) {
    const target = e.target.closest('.desktop-icon');
    if (target) openApp(target.dataset.app);
  }

  // Context menu implementation
  function showContextMenu(x, y) {
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.display = 'flex';

    contextMenu.innerHTML = `
      <div class="context-menu-item" id="cm-refresh">Refresh</div>
      <div class="context-menu-item" id="cm-change-wallpaper">Change Wallpaper</div>
    `;

    document.getElementById('cm-refresh').onclick = () => {
      renderIcons();
      hideContextMenu();
    };

    document.getElementById('cm-change-wallpaper').onclick = () => {
      const newWallpaper = prompt('Enter wallpaper image URL:', wallpaper);
      if (newWallpaper) setWallpaper(newWallpaper);
      hideContextMenu();
    };
  }

  function hideContextMenu() {
    contextMenu.style.display = 'none';
  }

  function onDesktopRightClick(e) {
    e.preventDefault();
    showContextMenu(e.pageX, e.pageY);
  }

  // Initialize desktop functionality
  window.desktopInit = () => {
    setWallpaper(wallpaper);
    renderIcons();

    iconsContainer.addEventListener('dblclick', onIconClick);
    iconsContainer.addEventListener('click', onIconClick);
    desktop.addEventListener('contextmenu', onDesktopRightClick);
    document.addEventListener('click', hideContextMenu);
  };
})();