// bluetooth.js
// Simulates Bluetooth scanning, starts with no devices, shows dummy devices on user click, cos prototype

(() => {
  const appId = 'bluetooth';

  let container;
  let devices = [];
  let scanning = false;

  function render() {
    if (!container) return;
    container.innerHTML = `
      <h3>Bluetooth Devices</h3>
      <p>${scanning ? 'Scanning for devices...' : 'No devices found nearby.'}</p>
      <ul id="device-list"></ul>
      <button id="btn-scan">${scanning ? 'Scanning...' : 'Scan for Devices'}</button>
    `;

    const btnScan = container.querySelector('#btn-scan');
    btnScan.onclick = () => {
      if (scanning) return;
      scanning = true;
      render();
      setTimeout(() => {
        devices = [
          { name: 'Nexora Headphones', id: 'nx-001' },
          { name: 'NX Keyboard', id: 'nx-002' },
          { name: 'NX Mouse', id: 'nx-003' },
        ];
        scanning = false;
        render();
      }, 3000);
    };

    const listEl = container.querySelector('#device-list');
    listEl.innerHTML = devices.map(d => `<li>${d.name}</li>`).join('');
  }

  function createUI(containerElement) {
    container = containerElement;
    render();
  }

  window.appInit = window.appInit || {};
  window.appInit[appId] = createUI;
})();
