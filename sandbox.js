// sandbox.js
// Provides a secure execution environment for third-party applications
// Implements basic sandboxing to prevent system access while allowing UI rendering

(() => {
  /**
   * Executes application code in a sandboxed environment
   * @param {string} appCode - The application code to execute
   * @param {HTMLElement} container - DOM element to render the app into
   */
  window.sandboxRunApp = (appCode, container) => {
    // Create isolated sandbox container
    const sandbox = document.createElement('div');
    sandbox.className = 'sandbox-container';
    
    // Apply security restrictions
    sandbox.style.all = 'initial'; // Reset all styles
    sandbox.style.display = 'block';
    sandbox.style.overflow = 'hidden';
    
    // Parse and sanitize the app code
    try {
      const sanitized = sanitizeAppCode(appCode);
      
      // Create secure iframe sandbox
      const iframe = document.createElement('iframe');
      iframe.sandbox = 'allow-same-origin allow-scripts';
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      
      // Write content to iframe
      iframe.onload = () => {
        iframe.contentDocument.open();
        iframe.contentDocument.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <base target="_blank">
            <style>
              body { 
                margin: 0; 
                padding: 0;
                font-family: inherit;
              }
            </style>
          </head>
          <body>${sanitized}</body>
          </html>
        `);
        iframe.contentDocument.close();
      };
      
      sandbox.appendChild(iframe);
      container.innerHTML = '';
      container.appendChild(sandbox);
      
    } catch (error) {
      // Fallback display for invalid code
      container.innerHTML = `
        <div class="sandbox-error">
          <h3>Application Error</h3>
          <p>${error.message}</p>
          <pre>${appCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </div>
      `;
    }
  };

  /**
   * Sanitizes application code to prevent XSS and other attacks
   * @param {string} code - Raw application code
   * @returns {string} Sanitized HTML content
   */
  function sanitizeAppCode(code) {
    // Basic HTML tag whitelist
    const allowedTags = {
      'div': true,
      'span': true,
      'p': true,
      'h1': true, 'h2': true, 'h3': true,
      'ul': true, 'ol': true, 'li': true,
      'a': ['href', 'title'],
      'img': ['src', 'alt', 'title'],
      'button': true,
      'input': ['type', 'placeholder'],
      'textarea': true,
      'style': true
    };

    // TODO: Implement actual HTML sanitizer library
    // For now, just escape everything (temporary implementation)
    return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Public API
  window.sandboxAPI = {
    runApp: window.sandboxRunApp,
    version: '1.0'
  };
})();