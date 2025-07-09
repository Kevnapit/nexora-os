// compatibility.js
// Shows fake compatibility for Windows (.exe), macOS (.dmg), Linux (.AppImage)
// Pretend launcher with sandbox mode notice

(() => {
  const appId = 'compatibility';

  let container;

  function createUI(containerElement) {
    container = containerElement;
    container.innerHTML = `
      <h3>App Compatibility</h3>
      <p>This system supports running fake Windows (.exe), macOS (.dmg), and Linux (.AppImage) apps in sandbox mode.</p>
      <p>Note: These are simulated and do not run real executables.</p>
      <div style="margin-top: 12px;">
        <button id="btn-windows">Run Windows (.exe)</button>
        <button id="btn-macos" style="margin-left: 8px;">Run macOS (.dmg)</button>
        <button id="btn-linux" style="margin-left: 8px;">Run Linux (.AppImage)</button>
      </div>
      <div id="sandbox-output" style="margin-top: 16px; background: rgba(255 255 255 / 0.1); padding: 12px; border-radius: 12px; height: 150px; overflow-y: auto;"></div>
    `;

    container.querySelector('#btn-windows').onclick = () => {
      runSandboxApp('Windows App running (.exe)...');
    };
    container.querySelector('#btn-macos').onclick = () => {
      runSandboxApp('macOS App running (.dmg)...');
    };
    container.querySelector('#btn-linux').onclick = () => {
      runSandboxApp('Linux App running (.AppImage)...');
    };
  }

  function runSandboxApp(msg) {
    const output = container.querySelector('#sandbox-output');
    output.textContent = '';
    output.textContent = msg + '\n\nSandbox mode active. No real system access.';
  }

  window.appInit = window.appInit || {};
  window.appInit[appId] = createUI;
})();
