// boot.js - Controls the operating system startup process
// This script handles:
// 1. The boot screen animation
// 2. Checking if first-time setup is complete
// 3. Routing to either setup wizard or desktop

(() => {
  // Get references to all major OS components
  const bootScreen = document.getElementById('boot-screen');
  const setupScreen = document.getElementById('setup-screen');
  const desktop = document.getElementById('desktop');
  const taskbar = document.getElementById('taskbar');
  const windowsContainer = document.getElementById('windows-container');
  const bootProgress = document.getElementById('boot-progress');
  const bootText = document.getElementById('boot-text');

  // Check if user has completed initial setup
  // Looks for a flag in localStorage
  function checkIfSetupDone() {
    return localStorage.getItem('nexora-setup-done') === 'true';
  }

  // Simulates a boot process with progress bar
  // This is purely visual - no actual loading happens here
  async function fakeBootSequence() {
    let progress = 0;
    bootText.textContent = 'Booting Nexora OS...';
    
    // Animate progress bar from 0-100% in random increments
    while (progress < 100) {
      // Random progress increment (5-15%)
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress > 100) progress = 100;
      
      // Update progress bar width
      bootProgress.style.width = progress + '%';
      
      // Wait 250ms between updates
      await new Promise(r => setTimeout(r, 250));
    }
    
    // Final boot complete message
    bootText.textContent = 'Boot Complete.';
    await new Promise(r => setTimeout(r, 400));
  }

  // Shows the setup wizard screen
  function showSetup() {
    // Hide/show appropriate screens
    bootScreen.classList.remove('active');
    setupScreen.classList.add('active');
    desktop.classList.remove('active');
    taskbar.classList.remove('active');
    windowsContainer.style.display = 'none';

    // Initialize setup wizard if available
    if (window.setupInit) {
      window.setupInit();
    }
  }

  // Shows the main desktop environment
  function showDesktop() {
    // Hide/show appropriate screens
    bootScreen.classList.remove('active');
    setupScreen.classList.remove('active');
    desktop.classList.add('active');
    taskbar.classList.add('active');
    windowsContainer.style.display = 'block';

    // Initialize all desktop components
    if (window.desktopInit) window.desktopInit();        // Desktop background, icons
    if (window.launcherInit) window.launcherInit();      // App launcher
    if (window.windowManagerInit) window.windowManagerInit(); // Window management
  }

  // Main boot sequence
  async function startBoot() {
    // Run the boot animation
    await fakeBootSequence();
    
    // Check if setup is needed
    if (checkIfSetupDone()) {
      showDesktop();  // Skip to desktop if setup is complete
    } else {
      showSetup();    // Show setup wizard if first run
    }
  }

  // Start the boot process when page loads
  window.addEventListener('DOMContentLoaded', () => {
    startBoot();
  });
})();