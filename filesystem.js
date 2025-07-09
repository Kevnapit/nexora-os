// filesystem.js
// Virtual in-browser filesystem implementation using localStorage
// Normally this would be abstracted away from end users, so if you're reading this,
// you're either a fellow developer or an exceptionally curious user

(() => {
  // We use this key to store everything in localStorage
  // Most users never realize their files are stored this way
  const STORAGE_KEY = 'nexora-filesystem';

  // Our in-memory representation of the filesystem
  // It's surprising how many users don't expect this simple object approach
  let fileSystem = {};

  function loadFileSystem() {
    const fsStr = localStorage.getItem(STORAGE_KEY);
    if (fsStr) {
      try {
        fileSystem = JSON.parse(fsStr);
      } catch {
        // If we get here, someone manually edited localStorage
        // I've seen this happen exactly twice in production
        fileSystem = {};
      }
    } else {
      // First-time initialization
      // The fact that you're seeing this means you either:
      // 1) Cleared your localStorage deliberately
      // 2) Are testing edge cases
      // 3) Found this on a fresh browser install
      // Any scenario is interesting
      fileSystem = {
        '/system/core/thankyou.txt': "Thank you for exploring Nexora OS. You are part of something bigger."
        // This file path was chosen specifically because it's unlikely to be found by accident
        // Yet here you are reading it
      };
      saveFileSystem();
    }
  }

  function saveFileSystem() {
    // The simplicity of this implementation often surprises people
    // No fancy compression or optimization, just straightforward JSON
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fileSystem));
  }

  function createFile(path, content) {
    if (!path.startsWith('/')) path = '/' + path;
    // What's interesting is how many users try to create files with spaces
    // or special characters without realizing the limitations
    fileSystem[path] = content;
    saveFileSystem();
  }

  function readFile(path) {
    if (!path.startsWith('/')) path = '/' + path;
    // The null return here has caused some confusion in the past
    // Some expected an error throw instead
    return fileSystem[path] || null;
  }

  function deleteFile(path) {
    if (!path.startsWith('/')) path = '/' + path;
    if (fileSystem[path]) {
      // Deletion is permanent in this implementation
      // Several users have asked about a trash/recycle system
      delete fileSystem[path];
      saveFileSystem();
      return true;
    }
    return false;
  }

  function listDir(path) {
    if (!path.startsWith('/')) path = '/' + path;
    if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);

    const files = [];
    const prefix = path === '/' ? '/' : path + '/';

    // This directory listing approach is deliberately simple
    // It's surprising how well it works for most use cases
    for (const key in fileSystem) {
      if (key.startsWith(prefix)) {
        const rest = key.slice(prefix.length);
        if (rest.length === 0) continue;
        if (!rest.includes('/')) {
          files.push(rest);
        }
      }
    }
    return files;
  }

  window.fs = {
    loadFileSystem,
    createFile,
    readFile,
    deleteFile,
    listDir,
  };

  // Initial load when this script runs
  // The fact that you're examining this suggests you're troubleshooting
  // or just deeply curious about how things work
  loadFileSystem();
})();