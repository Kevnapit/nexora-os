// terminal.js
// Simulated shell environment with simple commands

(() => {
  const appId = 'terminal';

  let container, output, input, promptStr = 'user@nexora:~$ ';
  let commandHistory = [];
  let historyIndex = -1;
  let currentPath = '/home/user';

  function appendLine(text, isCommand = false) {
    const line = document.createElement('div');
    line.className = isCommand ? 'term-command' : 'term-output';
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function clearOutput() {
    output.innerHTML = '';
  }

  function runCommand(cmd) {
    appendLine(promptStr + cmd, true);

    const parts = cmd.trim().split(/\s+/);
    const baseCmd = parts[0];
    const args = parts.slice(1);

    switch (baseCmd) {
      case 'help':
        appendLine('Available commands: ls, cd, clear, echo, open, nx-about');
        break;
      case 'ls':
        {
          const files = window.fs.listDir(currentPath);
          appendLine(files.join('  '));
        }
        break;
      case 'cd':
        {
          if (args.length === 0) {
            currentPath = '/home/user';
          } else {
            let newPath = args[0];
            if (!newPath.startsWith('/')) {
              newPath = currentPath + '/' + newPath;
            }
            // Simplify path
            newPath = simplifyPath(newPath);
            // Check if directory exists by listing parent dir
            const parent = newPath.split('/').slice(0, -1).join('/') || '/';
            const base = newPath.split('/').pop();
            const contents = window.fs.listDir(parent);
            if (contents.includes(base)) {
              currentPath = newPath;
            } else {
              appendLine('cd: no such directory: ' + args[0]);
            }
          }
        }
        break;
      case 'clear':
        clearOutput();
        break;
      case 'echo':
        appendLine(args.join(' '));
        break;
      case 'open':
        if (args[0] === 'notepad') {
          window.openAppWindow('notepad');
        } else {
          appendLine('open: unknown app ' + args[0]);
        }
        break;
      case 'nx-about':
        showAboutPanel();
        break;
      default:
        appendLine(baseCmd + ': command not found');
        break;
    }
  }

  function simplifyPath(path) {
    const parts = path.split('/').filter(p => p && p !== '.');
    const stack = [];
    for (const part of parts) {
      if (part === '..') {
        stack.pop();
      } else {
        stack.push(part);
      }
    }
    return '/' + stack.join('/');
  }

  function showAboutPanel() {
    appendLine('Nexora OS - A modular in-browser OS simulation.');
    appendLine('Thank you for exploring Nexora OS. You are part of something bigger.');
  }

  function createUI(containerElement) {
    container = containerElement;
    container.innerHTML = `
      <div class="terminal-output" tabindex="0" style="overflow-y:auto; height: calc(100% - 30px); background: #111; color: #eee; padding: 8px; font-family: monospace; font-size: 14px; border-radius: 12px;"></div>
      <input class="terminal-input" type="text" style="width: 100%; box-sizing: border-box; padding: 6px; font-family: monospace; font-size: 14px; border-radius: 12px; margin-top: 4px; background: #222; color: #eee; border: none;" autofocus />
    `;

    output = container.querySelector('.terminal-output');
    input = container.querySelector('.terminal-input');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (cmd.length > 0) {
          commandHistory.push(cmd);
          historyIndex = commandHistory.length;
          runCommand(cmd);
          input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex];
          e.preventDefault();
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[historyIndex];
          e.preventDefault();
        } else {
          historyIndex = commandHistory.length;
          input.value = '';
          e.preventDefault();
        }
      }
    });

    input.focus();
  }

  window.appInit = window.appInit || {};
  window.appInit[appId] = createUI;
})();
