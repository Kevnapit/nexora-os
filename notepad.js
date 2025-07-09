// notepad.js
// A simple text editor with file operations

(() => {
  const appId = 'notepad';
  const DEFAULT_DIR = '/documents';
  let editor;
  let currentFile = null;
  let fileStatusEl;

  // Initialize the application UI
  function initUI(container) {
    container.innerHTML = `
      <div class="notepad-container">
        <div class="toolbar">
          <button id="new-btn" class="tool-btn" title="New (Ctrl+N)">New</button>
          <button id="open-btn" class="tool-btn" title="Open (Ctrl+O)">Open</button>
          <button id="save-btn" class="tool-btn" title="Save (Ctrl+S)" disabled>Save</button>
          <button id="save-as-btn" class="tool-btn" title="Save As">Save As</button>
          <span id="file-status" class="file-status">Untitled</span>
        </div>
        <textarea id="editor" spellcheck="false"></textarea>
      </div>
    `;

    // Cache DOM elements
    editor = container.querySelector('#editor');
    fileStatusEl = container.querySelector('#file-status');
    
    // Setup event handlers
    setupEventHandlers(container);
    setupKeyboardShortcuts();
  }

  // Set up UI event handlers
  function setupEventHandlers(container) {
    container.querySelector('#new-btn').addEventListener('click', newFile);
    container.querySelector('#open-btn').addEventListener('click', openFileDialog);
    container.querySelector('#save-btn').addEventListener('click', saveFile);
    container.querySelector('#save-as-btn').addEventListener('click', saveAsFile);
    
    editor.addEventListener('input', () => {
      container.querySelector('#save-btn').disabled = !editor.value.trim();
    });
  }

  // Set up keyboard shortcuts
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'n': e.preventDefault(); newFile(); break;
          case 'o': e.preventDefault(); openFileDialog(); break;
          case 's': e.preventDefault(); saveFile(); break;
        }
      }
    });
  }

  // Create a new empty document
  function newFile() {
    if (editor.value && !confirm('Discard current changes?')) return;
    
    editor.value = '';
    currentFile = null;
    fileStatusEl.textContent = 'Untitled';
    document.querySelector('#save-btn').disabled = true;
  }

  // Open file dialog and load selected file
  async function openFileDialog() {
    try {
      const files = window.fs.listDir(DEFAULT_DIR) || [];
      const fileList = files.map(f => `<option value="${f}">`).join('');
      
      const fileToOpen = await showModalDialog(`
        <div class="file-dialog">
          <h3>Open File</h3>
          <input list="files" id="file-input" placeholder="Filename">
          <datalist id="files">${fileList}</datalist>
          <div class="dialog-buttons">
            <button id="cancel-btn">Cancel</button>
            <button id="open-btn">Open</button>
          </div>
        </div>
      `);

      if (fileToOpen) {
        loadFile(`${DEFAULT_DIR}/${fileToOpen}`);
      }
    } catch (error) {
      showAlert(`Error opening file: ${error.message}`);
    }
  }

  // Load file content into editor
  function loadFile(filePath) {
    const content = window.fs.readFile(filePath);
    if (content === null) {
      throw new Error('File not found');
    }

    editor.value = content;
    currentFile = filePath;
    fileStatusEl.textContent = filePath.split('/').pop();
    document.querySelector('#save-btn').disabled = true;
  }

  // Save current file
  function saveFile() {
    if (!currentFile) {
      saveAsFile();
      return;
    }

    window.fs.createFile(currentFile, editor.value);
    document.querySelector('#save-btn').disabled = true;
    showAlert('File saved successfully');
  }

  // Save file with new name
  async function saveAsFile() {
    try {
      const fileName = await showModalDialog(`
        <div class="file-dialog">
          <h3>Save As</h3>
          <input id="file-input" placeholder="Filename" value="${currentFile ? currentFile.split('/').pop() : 'note.txt'}">
          <div class="dialog-buttons">
            <button id="cancel-btn">Cancel</button>
            <button id="save-btn">Save</button>
          </div>
        </div>
      `);

      if (fileName) {
        currentFile = `${DEFAULT_DIR}/${fileName}`;
        saveFile();
      }
    } catch (error) {
      showAlert(`Error saving file: ${error.message}`);
    }
  }

  // Helper function to show modal dialogs
  function showModalDialog(html) {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.className = 'modal-overlay';
      dialog.innerHTML = html;

      const cancelBtn = dialog.querySelector('#cancel-btn');
      const actionBtn = dialog.querySelector('#open-btn, #save-btn');

      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(dialog);
        resolve(null);
      });

      actionBtn.addEventListener('click', () => {
        const input = dialog.querySelector('#file-input');
        if (input.value.trim()) {
          document.body.removeChild(dialog);
          resolve(input.value.trim());
        }
      });

      document.body.appendChild(dialog);
      dialog.querySelector('#file-input').focus();
    });
  }

  // Helper function to show alerts
  function showAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
  }

  // Register the app initialization function
  window.appInit = window.appInit || {};
  window.appInit[appId] = initUI;
})();