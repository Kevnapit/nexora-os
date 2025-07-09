# Nexora OS

***THIS IS JUST A PROTOTYPE TO SHOW HOW NEXORA OS IS GOING TO LOOK LIKE ***
Nexora OS is a fully in-browser simulated operating system built with only HTML, CSS, and JavaScript.  
It is designed to provide a modular, scalable, and visually polished OS-like experience without any backend.

## Features

- Bootloader with animated splash screen
- First-time setup wizard for language, Wi-Fi, and mode selection
- Desktop environment with icons, drag & drop, right-click menu
- Window manager for movable, resizable, and closable app windows
- Virtual file system stored in localStorage
- Taskbar with app launcher and running apps list
- Core apps: Notepad, Terminal, File Manager, Settings, Security, Bluetooth, Compatibility, Updater
- Simulated antivirus scan and quarantine
- Simulated Bluetooth scanning
- Fake compatibility mode for Windows, macOS, and Linux apps
- Fake system update with reboot simulation
- Easter egg hidden in system files and terminal commands

## File Structure

/nexora-os/
├── index.html
├── style.css
├── /js/
│ ├── boot.js
│ ├── setup.js
│ ├── desktop.js
│ ├── windowmanager.js
│ ├── filesystem.js
│ ├── launcher.js
│ ├── sandbox.js
│ ├── apps/
│ │ ├── terminal.js
│ │ ├── notepad.js
│ │ ├── filemanager.js
│ │ ├── settings.js
│ │ ├── security.js
│ │ ├── bluetooth.js
│ │ ├── compatibility.js
│ │ └── updater.js
├── /assets/
│ ├── icons/
│ ├── wallpaper/
│ └── logo/
└── README.md

## How to Run

Open `index.html` in any modern web browser.  
The OS will boot, and if first time, show setup wizard.

## License

Open source, free to use and modify.

DM on Discord if any bugs or requests (@viztini)
