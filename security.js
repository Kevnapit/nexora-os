// security.js
// Just an antivirus, and threat protecetor, all fake tho its just a prototype

(() => {
  const appId = 'security';

  let container;
  let scanning = false;
  let scanInterval;
  let progress = 0;
  let threatsFound = [];

  function startScan() {
    if (scanning) return;
    scanning = true;
    progress = 0;
    threatsFound = [];
    render();
    scanInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(scanInterval);
        scanning = false;
        generateThreats();
        render();
      } else {
        render();
      }
    }, 500);
  }

  function generateThreats() {
    const threatSamples = [
      'Suspicious file in /home/user/Desktop/malware.exe',
      'Potentially unwanted program detected',
      'Unauthorized network activity',
      'Fake trojan in /system/tmp/fake_trojan.dll',
      'Phishing attempt blocked',
    ];
    const count = Math.floor(Math.random() * 3);
    threatsFound = [];
    for (let i = 0; i < count; i++) {
      const t = threatSamples[Math.floor(Math.random() * threatSamples.length)];
      threatsFound.push(t);
    }
  }

  function render() {
    if (!container) return;
    container.innerHTML = `
      <h3>Antivirus Scan</h3>
      <progress value="${progress}" max="100" style="width: 100%;"></progress>
      <p>${scanning ? 'Scanning in progress...' : 'Scan complete.'}</p>
      ${threatsFound.length > 0 ? '<h4>Threats Found:</h4><ul>' + threatsFound.map(t => `<li>${t}</li>`).join('') + '</ul>' : '<p>No threats found.</p>'}
      <button id="btn-start-scan" ${scanning ? 'disabled' : ''}>Start Scan</button>
    `;

    const btnStart = container.querySelector('#btn-start-scan');
    btnStart.onclick = () => startScan();
  }

  function createUI(containerElement) {
    container = containerElement;
    render();
  }

  window.appInit = window.appInit || {};
  window.appInit[appId] = createUI;
})();
