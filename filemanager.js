// filemanager.js
// Simple file explorer showing files in /home/user/Desktop, supports delete and rename

(() => {
  const appId = 'filemanager';
  let container, fileListEl;

  function refreshFileList() {
    const files = window.fs.listDir('/home/user/Desktop');
    fileListEl.innerHTML = '';

    if (files.length === 0) {
      fileListEl.textContent = 'No files in Desktop folder.';
      return;
    }

    for (const file of files) {
      const fileRow = document.createElement('div');
      fileRow.classList.add('file-row');
      fileRow.style.display = 'flex';
      fileRow.style.justifyContent = 'space-between';
      fileRow.style.alignItems = 'center';
      fileRow.style.padding = '6px 12px';
      fileRow.style.borderBottom = '1px solid #333';

      const fileName = document.createElement('div');
      fileName.textContent = file;
      fileName.style.flex = '1';
      fileName.style.cursor = 'default';

      const btnDelete = document.createElement('button');
      btnDelete.textContent = 'Delete';
      btnDelete.style.marginLeft = '8px';

      const btnRename = document.createElement('button');
      btnRename.textContent = 'Rename';
      btnRename.style.marginLeft = '8px';

      btnDelete.onclick = () => {
        if (confirm(`Delete file "${file}"?`)) {
          window.fs.deleteFile(`/home/user/Desktop/${file}`);
          refreshFileList();
        }
      };

      btnRename.onclick = () => {
        const newName = prompt('Enter new filename:', file);
        if (newName && newName !== file) {
          const content = window.fs.readFile(`/home/user/Desktop/${file}`);
          window.fs.deleteFile(`/home/user/Desktop/${file}`);
          window.fs.createFile(`/home/user/Desktop/${newName}`, content);
          refreshFileList();
        }
      };

      fileRow.appendChild(fileName);
      fileRow.appendChild(btnDelete);
      fileRow.appendChild(btnRename);

      fileListEl.appendChild(fileRow);
    }
  }

  function createUI(containerElement) {
    container = containerElement;
    container.innerHTML = `
      <h3>Desktop Files</h3>
      <div id="file-list" style="max-height: 300px; overflow-y: auto; background: rgba(255 255 255 / 0.05); border-radius: 12px; padding: 8px;"></div>
    `;
    fileListEl = container.querySelector('#file-list');
    refreshFileList();
  }

  window.appInit = window.appInit || {};
  window.appInit[appId] = createUI;
})();
