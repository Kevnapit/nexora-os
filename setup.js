// setup.js - The "please don't make me fill this out" wizard
// Handles all the first-time setup nonsense that users just want to skip

(() => {
  const setupScreen = document.getElementById('setup-screen');

  // Our setup state - where we store all the answers users will probably regret later
  const state = {
    lang: 'en', // Default to English because we're lazy developers
    wifi: { ssid: '', password: '', secure: true }, // Blank because who remembers their WiFi password?
    mode: 'standard', // Because most users aren't cool enough to pick developer mode
  };

  // List of languages we Google Translated at 3AM
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish / Español' }, // The one you took in high school
    { code: 'fr', name: 'French / Français' }, // Oui oui
    { code: 'de', name: 'German / Deutsch' }, // For when you want to sound angry
    { code: 'jp', name: 'Japanese / 日本語' }, // こんにちは weebs
  ];

  // Where the magic happens (by magic I mean form rendering)
  function renderSetup() {
    setupScreen.innerHTML = `
      <h1>Welcome to Nexora OS Setup</h1>
      <p>Please complete these steps we legally have to make you do</p>
      <form id="setup-form">
        <div class="setup-step">
          <h2>Language Selection</h2>
          <p>Pick the one you'll regret not changing later</p>
          <select id="lang-select" name="lang" required>
            ${languages.map(l => `<option value="${l.code}">${l.name}</option>`).join('')}
          </select>
        </div>

        <div class="setup-step">
          <h2>Wi-Fi Setup</h2>
          <p>Because offline operating systems are so 1995</p>
          <input type="text" id="wifi-ssid" name="ssid" placeholder="Wi-Fi SSID" required />
          <input type="password" id="wifi-password" name="password" placeholder="Wi-Fi Password" required />
          <label><input type="checkbox" id="wifi-secure" name="secure" checked /> Use WPA3 Security (check this unless you want neighbors stealing your bandwidth)</label>
        </div>

        <div class="setup-step">
          <h2>Mode Selection</h2>
          <p>Choose your destiny</p>
          <select id="mode-select" name="mode" required>
            <option value="standard">Standard Mode (for normal people)</option>
            <option value="dev">Developer Mode (for people who like broken things)</option>
            <option value="game">Game Mode (because RGB improves performance)</option>
          </select>
        </div>

        <button type="submit">Finish Setup (finally!)</button>
      </form>
    `;

    // Set default values because we know users won't read anything
    document.getElementById('lang-select').value = state.lang;
    document.getElementById('wifi-secure').checked = state.wifi.secure;
    document.getElementById('mode-select').value = state.mode;

    // When the user finally submits this form after 10 minutes of hesitation
    const form = document.getElementById('setup-form');
    form.addEventListener('submit', e => {
      e.preventDefault(); // Stop the form from actually submitting (we're fancy like that)

      // Get all the values the user probably didn't think about
      const lang = form.lang.value;
      const ssid = form.ssid.value.trim(); // Trim because spaces are evil
      const password = form.password.value;
      const secure = form.secure.checked;
      const mode = form.mode.value;

      // Basic validation because users will try to submit empty forms
      if (!ssid || !password) {
        alert('Please enter Wi-Fi SSID and Password. (Yes, we actually need these)');
        return;
      }

      // Update our state object with all the choices they'll want to change tomorrow
      state.lang = lang;
      state.wifi.ssid = ssid;
      state.wifi.password = password;
      state.wifi.secure = secure;
      state.mode = mode;

      // Save to localStorage where it will live forever (or until they clear their cache)
      localStorage.setItem('nexora-setup-data', JSON.stringify(state));
      localStorage.setItem('nexora-setup-done', 'true');

      // Reload the whole thing because we're not fancy enough for smooth transitions
      location.reload();
    });
  }

  // Make this available to the boot process because modularity is good
  window.setupInit = () => {
    renderSetup(); // Let the suffering begin
  };
})();