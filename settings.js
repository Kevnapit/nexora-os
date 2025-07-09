// settings.js
// Settings app to change language, theme, wallpaper, reset OS

(() => {
  const appId = 'settings';

  let container;

  function loadSettings() {
    const setupDataStr = localStorage.getItem('nexora-setup-data');
    if (!setupDataStr) return {};
    try {
      return JSON.parse(setupDataStr);
    } catch {
      return {};
    }
  }

  function saveSettings(data) {
    localStorage.setItem('nexora-setup-data', JSON.stringify(data));
  }

  function createUI(containerElement) {
    container = containerElement;
    const data = loadSettings();

    container.innerHTML = `
      <h3>Settings</h3>
      <label>
        Language:
        <select id="lang-select">
          <option value="en" ${data.lang === 'en' ? 'selected' : ''}>English</option>
          <option value="es" ${data.lang === 'es' ? 'selected' : ''}>Spanish</option>
          <option value="fr" ${data.lang === 'fr' ? 'selected' : ''}>French</option>
          <option value="de" ${data.lang === 'de' ? 'selected' : ''}>German</option>
          <option value="jp" ${data.lang === 'jp' ? 'selected' : ''}>Japanese</option>
        </select>
      </label>
      <br><br>
      <label>
        Theme:
        <select id="theme-select">
          <option value="light">Light</option>
          <option value="dark" selected>Dark</option>
        </select>
      </label>
      <br><br>
      <label>
        Wallpaper URL:
        <input type="text" id="wallpaper-input" value="assets/wallpaper/default.jpg" />
      </label>
      <br><br>
      <button id="btn-save-settings">Save Settings</button>
      <button id="btn-reset-os" style="margin-left: 16px; color: red;">Reset OS</button>
    `;

    const langSelect = container.querySelector('#lang-select');
    const themeSelect = container.querySelector('#theme-select');
    const wallpaperInput = container.querySelector('#wallpaper-input');
    const btnSave = container.querySelector('#btn-save-settings');
    const btnReset = container.querySelector('#btn-reset-os');

    btnSave.onclick = () => {
      const newLang = langSelect.value;
      const newTheme = themeSelect.value;
      const newWallpaper = wallpaperInput.value;

      const newSettings = {
        ...data,
        lang: newLang,
        theme: newTheme,
        wallpaper: newWallpaper,
      };
      saveSettings(newSettings);
      alert('Settings saved. Please refresh the page.');
    };

    btnReset.onclick = () => {
      if (confirm('Are you sure you want to reset Nexora OS? This will clear all data.')) {
        localStorage.clear();
        location.reload();
      }
    };
  }

  window.appInit = window.appInit || {};
  window.appInit[appId] = createUI;
})();
