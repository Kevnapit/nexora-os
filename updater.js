// updater.js
// Fake update engine with changelog, progress bar, reboot simulation

(() => {
  const appId = 'updater';

  let container;
  let progress = 0;
  let updating = false;
  let interval;

  const changelog = [
    'Fixed bugs in file system',
    'Improved performance of desktop',
    'Added Bluetooth support',
    'Enhanced security features',
    'Updated compatibility mode',
  ];

  function startUpdate() {
    if (updating) return;
    updating = true;
    progress = 0;
    render();
    interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        updating = false;
        simulateReboot();
      }
      render();
    }, 500);
  }

  function simulateReboot() {
    container.innerHTML = `
      <h3>Update Complete</h3>
      <p>System will reboot now...</p>
    `;
    setTimeout(() => {
      alert('Nexora OS has been updated to version 1.0.1');
      location.reload();
    }, 3000);
  }

  function render() {
    if (!container) return;
    container.innerHTML = `
      <h3>System Update</h3>
      <ul>
        ${changelog.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <progress value="${progress}" max="100" style="width: 100%;"></progress>
      <button id="btn-update" ${updating ? 'disabled' : ''}>Start Update</button>
    `;

    container.querySelector('#btn-update').onclick = () => {
      startUpdate();
    };
  }

  function createUI(containerElement) {
    container = containerElement;
    render();
  }

  window.appInit = window.appInit || {};
  window.appInit[appId] = createUI;
})();
