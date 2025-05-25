const vscode = require('vscode');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = 'AIzaSyDMcPMqA70msaMFXDZLIVmeJcm64WnD6YI';

let panel = undefined;
let changeCounter = 0;
// Create a global array to store code history
let codeHistory = [];
const MAX_HISTORY_SIZE = 10; // Maximum number of history entries to keep

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.activateAnalyzer', () => {
      if (panel) {
        panel.reveal(vscode.ViewColumn.Beside);
      } else {
        panel = vscode.window.createWebviewPanel(
          'codeAnalyzer',
          'Code Analyzer',
          vscode.ViewColumn.Beside,
          { enableScripts: true }
        );

        let fixedCodeInPanel = ''; // ⬅️ Store the last "fixed code" from panel

        panel.webview.html = getInitialHtml();

        panel.webview.onDidReceiveMessage(async (msg) => {
          if (msg.command === 'acceptFixes') {
            console.log("Received message from webview:", msg);
            
            const editors = vscode.window.visibleTextEditors;
            if (editors.length === 0) {
              vscode.window.showErrorMessage("No editor is open.");
              return;
            }

            const editor = editors[0];
            await vscode.window.showTextDocument(editor.document, vscode.ViewColumn.One, false);
            if (!editor) {
              console.log("Editor is null");
              return;
            } 
          
            const fixedCode = msg.fixedText || '';
            fixedCodeInPanel = fixedCode; // ⬅️ Save the latest fixed code from webview
            console.log("Fixed Code:", fixedCode);

            if (editor.document.getText() === fixedCode) {
              vscode.window.showInformationMessage("No changes detected. Already up to date.");
              return;
            }
            
            const entireRange = new vscode.Range(
              editor.document.positionAt(0),
              editor.document.positionAt(editor.document.getText().length)
            );
            
            // Store the original code before making changes
            const originalCode = editor.document.getText();
          
            const success = await editor.edit(editBuilder => {
              editBuilder.replace(entireRange, fixedCode);
            });
          
            if (success) {
              // Add to history when changes are successfully applied - store the original code instead of fixes
              addToHistory("Before update", originalCode);
              panel.webview.postMessage({ command: 'updateHistory', history: codeHistory });
              vscode.window.showInformationMessage('Code updated with fixes!');
            } else {
              vscode.window.showErrorMessage('Edit operation failed.');
            }
          } else if (msg.command === 'declineFixes') {
            vscode.window.showInformationMessage('Fixes declined.');
          } else if (msg.command === 'undoHistoryEntry') {
            const historyIndex = msg.index;
            if (historyIndex >= 0 && historyIndex < codeHistory.length) {
              const historyCode = codeHistory[historyIndex].code;
              
              // Get all visible editors
              const editors = vscode.window.visibleTextEditors;
              if (editors.length === 0) {
                vscode.window.showErrorMessage("No editor is open.");
                return;
              }
              
              // Use the first visible editor
              const editor = editors[0];
              
              // Make sure to focus the editor before making changes
              try {
                await vscode.window.showTextDocument(editor.document, vscode.ViewColumn.One, false);
                
                const entireRange = new vscode.Range(
                  editor.document.positionAt(0),
                  editor.document.positionAt(editor.document.getText().length)
                );
                
                const success = await editor.edit(editBuilder => {
                  editBuilder.replace(entireRange, historyCode);
                });
                
                if (success) {
                  vscode.window.showInformationMessage(`Reverted to previous version`);
                } else {
                  vscode.window.showErrorMessage('Failed to undo changes.');
                }
              } catch (error) {
                console.error("Error during undo operation:", error);
                vscode.window.showErrorMessage(`Error reverting code: ${error.message}`);
              }
            }
          }
        });

        let previousLineCount = 0;

        vscode.workspace.onDidChangeTextDocument(event => {
          const editor = vscode.window.activeTextEditor;
          if (!editor || event.document !== editor.document) return;

          const currentLineCount = event.document.lineCount;

          if (currentLineCount !== previousLineCount) {
            previousLineCount = currentLineCount;
            triggerAnalysis();
          }

          // 💥 Extra Part: Check if document matches the panel's fixed code
          if (fixedCodeInPanel && editor.document.getText() === fixedCodeInPanel) {
            vscode.window.showInformationMessage("No changes detected. Already matches panel fixes.");
          }
        });
        
        panel.onDidDispose(() => {
          panel = undefined;
        });
      }
    })
  );

  vscode.commands.executeCommand('extension.activateAnalyzer');
}

// Function to add entry to code history
function addToHistory(action, code) {
  const timestamp = new Date().toLocaleString();
  codeHistory.unshift({ 
    timestamp: timestamp, 
    action: action, 
    code: code 
  });
  
  // Keep history size under the maximum limit
  if (codeHistory.length > MAX_HISTORY_SIZE) {
    codeHistory.pop();
  }
}

function triggerAnalysis() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    panel?.webview.postMessage({ command: 'display', content: 'No active file open.' });
    return;
  }

  panel?.webview.postMessage({ command: 'display', content: 'Analyzing...' });

  const content = editor.document.getText();
  const uri = editor.document.uri;
  analyzeCodeWithPathCheck(content, uri).then(analysis => {
    panel?.webview.postMessage({ command: 'display', content: analysis });
    
    // Store current code in history rather than analysis
    
  });
}

async function analyzeCodeWithPathCheck(code, uri) {
  // Check if the code contains any import or require statements matching the pathRegex
  const pathRegex = /import\s+(?:{[^}]*}|(\w+))\s+from\s+(['"])([^'"]+)\2|require\((['"])([^'"]+)\4\)|import\((['"])([^'"]+)\6\)|fs\.(?:readFileSync|readFile|existsSync|openSync|writeFileSync)\((['"])([^'"]+)\8/g;
  
  // Test if the code contains any matches for the pathRegex
  if (pathRegex.test(code)) {
    // Reset the regex lastIndex property since we used test() which advances it
    pathRegex.lastIndex = 0;
    // If matches exist, run the path analysis
    const fixedCode = await analyzeFilePaths(code, uri);
    return fixedCode;
  } else {
    // If no matches, skip path analysis and run analyzeCode directly
    return await analyzeCode(code);
  }
}

async function analyzeCode(code) {
  const prompt = `Analyze the following code line by line.  Analyze the code for the following issues:

1. Syntax errors  
2. Logical issues  
3. Performance problems  
4. Violations of coding best practices (readability, efficiency, maintainability)

Don't check for the path errors. Leave the import and export lines as it is.

Use that analysis to fix the given code and provide the fixed and correct code line by line. Don't provide:
1. Analysis
2. Comments
3. Fixes
4. Language of the code

Provide just the fixed code. 

In case of no issue, provide the same given code. 

Here is the code to fix:\n\n${code}`;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    let extractedText = response.data.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") || "";

    let lines = extractedText.split('\n');
    
    extractedText = lines.join('\n');

    extractedText = extractedText
      .replace(/```[a-z]*\s*/g, '') // Remove the opening code block marker
      .replace(/\s*```/g, '') // Remove the closing code block marker
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return extractedText;


  } catch (err) {
    console.error("Gemini API Error:", err);
    return "Error analyzing code.";
  }
}

async function analyzeFilePaths(code, openedFileUri) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return { fixedCode: code, pathError: 'no' };
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const currentFilePath = openedFileUri.fsPath;
  const currentFileDir = path.dirname(currentFilePath);
  
  const pathRegex = /import\s+(?:{[^}]*}|(\w+))\s+from\s+(['"])([^'"]+)\2|require\((['"])([^'"]+)\4\)|import\((['"])([^'"]+)\6\)|fs\.(?:readFileSync|readFile|existsSync|openSync|writeFileSync)\((['"])([^'"]+)\8/g;

  let fixedCode = '';
  let lastIndex = 0;
  let result;

  while ((result = pathRegex.exec(code)) !== null) {
      let variableName = result[1] || null;
      let relativePath = result[3] || result[5] || result[7] || result[9];
      let quote = result[2] || result[4] || result[6] || result[8];
      let fullMatch = result[0];
      const matchStart = result.index;
      const matchEnd = matchStart + fullMatch.length;

      fixedCode += code.substring(lastIndex, matchStart);

      if (!relativePath || (!relativePath.startsWith('.') && !relativePath.startsWith('/'))) {
          fixedCode += fullMatch;
          lastIndex = matchEnd;
          continue;
      }

      let correctPath = await findCorrectPath(currentFileDir, relativePath);

      if (!correctPath && variableName) {
          correctPath = await searchForComponent(rootPath, currentFileDir, variableName);
      }

      if (correctPath && correctPath !== relativePath) {
          const newImport = fullMatch.replace(
              new RegExp(`(['"])${escapeRegExp(relativePath)}\\1`), 
              `${quote}${correctPath}${quote}`
          );
          fixedCode += newImport;
          console.log(`🔵 Fixed: ${relativePath} → ${correctPath}`);
      } else {
          fixedCode += fullMatch;
      }

      lastIndex = matchEnd;
  }

  fixedCode += code.substring(lastIndex);

  return fixedCode;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findCorrectPath(currentFileDir, relativePath) {
  try {
    const absolutePath = path.resolve(currentFileDir, relativePath);
    if (await fileExists(absolutePath)) {
      return relativePath;
    }

    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.json'];
    for (const ext of extensions) {
      if (await fileExists(absolutePath + ext)) {
        return relativePath + ext;
      }
    }

    for (const ext of extensions) {
      if (await fileExists(path.join(absolutePath, `index${ext}`))) {
        return path.join(relativePath, `index${ext}`).replace(/\\/g, '/');
      }
    }

    return null;
  } catch (err) {
    console.error('findCorrectPath error:', err);
    return null;
  }
}

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function searchForComponent(rootPath, currentFileDir, componentName) {
  const allFiles = await findAllFiles(rootPath);

  const folderMatch = allFiles.find(filePath => {
    const base = path.basename(filePath);
    return base.toLowerCase() === componentName.toLowerCase() && fs.lstatSync(filePath).isDirectory();
  });

  if (folderMatch) {
    const relative = path.relative(currentFileDir, folderMatch);
    return fixRelativeSlashes(relative);
  }

  const fileMatch = allFiles.find(filePath => {
    const base = path.basename(filePath, path.extname(filePath));
    return base.toLowerCase() === componentName.toLowerCase();
  });

  if (fileMatch) {
    const relative = path.relative(currentFileDir, fileMatch);
    return fixRelativeSlashes(relative);
  }

  return null;
}

function fixRelativeSlashes(p) {
  let fixed = p.replace(/\\/g, '/');
  if (!fixed.startsWith('.')) {
    fixed = './' + fixed;
  }
  return fixed;
}

async function findAllFiles(dir) {
  let results = [];
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(fullPath);
      const nested = await findAllFiles(fullPath);
      results = results.concat(nested);
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function getInitialHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --bg-light: #ffffff;
      --text-light: #333333;
      --button-bg-light: #0078d4;
      --button-hover-light: #106ebe;
      --pre-bg-light: #f3f3f3;
      --pre-border-light: #e0e0e0;
      --secondary-bg-light: #f9f9f9;
      --history-hover-light: #eaeaea;

      --bg-dark: #1e1e1e;
      --text-dark: #e0e0e0;
      --button-bg-dark: #0e639c;
      --button-hover-dark: #1177bb;
      --pre-bg-dark: #252526;
      --pre-border-dark: #3c3c3c;
      --secondary-bg-dark: #252526;
      --history-hover-dark: #333333;
    }

    body {
      font-family: sans-serif;
      padding: 1.5rem;
      margin: 0;
    }

    body.light-mode {
      background-color: var(--bg-light);
      color: var(--text-light);
    }

    body.dark-mode {
      background-color: var(--bg-dark);
      color: var(--text-dark);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .title {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .buttons {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .action-button {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .accept {
      background-color: var(--button-bg-light);
      color: white;
    }

    .accept:hover {
      background-color: var(--button-hover-light);
    }

    .decline {
      background-color: #e81123;
      color: white;
    }

    .decline:hover {
      background-color: #c50f1f;
    }

    .output-container {
      position: relative;
      margin-bottom: 2rem;
    }

    pre {
      padding: 1rem;
      border-radius: 6px;
      background-color: var(--pre-bg-light);
      border: 1px solid var(--pre-border-light);
      white-space: pre-wrap;
      max-height: 400px;
      overflow: auto;
    }

    .dark-mode pre {
      background-color: var(--pre-bg-dark);
      border-color: var(--pre-border-dark);
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .slider {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 28px;
      background-color: #ccc;
      border-radius: 34px;
    }

    .slider:before {
      content: "";
      position: absolute;
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + .slider:before {
      transform: translateX(32px);
    }

    input {
      display: none;
    }

    /* History panel styles */
    .history-panel {
      margin-top: 2rem;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--pre-border-light);
    }

    .dark-mode .history-panel {
      border-color: var(--pre-border-dark);
    }

    .history-header {
      background-color: var(--button-bg-light);
      color: white;
      padding: 0.75rem 1rem;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dark-mode .history-header {
      background-color: var(--button-bg-dark);
    }

    .history-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .history-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--pre-border-light);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .history-item:hover {
      background-color: var(--history-hover-light);
    }

    .dark-mode .history-item {
      border-color: var(--pre-border-dark);
    }

    .dark-mode .history-item:hover {
      background-color: var(--history-hover-dark);
    }

    .history-details {
      display: flex;
      flex-direction: column;
    }

    .history-timestamp {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .dark-mode .history-timestamp {
      color: #aaa;
    }

    .history-action {
      font-weight: 500;
    }

    .history-undo {
      background-color: #e81123;
      color: white;
      padding: 0.3rem 0.6rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .history-undo:hover {
      background-color: #c50f1f;
    }

    .section-tabs {
      display: flex;
      margin-bottom: 1rem;
    }

    .tab {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border: 1px solid var(--pre-border-light);
      border-bottom: none;
      border-radius: 4px 4px 0 0;
      background-color: var(--secondary-bg-light);
    }

    .dark-mode .tab {
      border-color: var(--pre-border-dark);
      background-color: var(--secondary-bg-dark);
    }

    .tab.active {
      background-color: var(--button-bg-light);
      color: white;
    }

    .dark-mode .tab.active {
      background-color: var(--button-bg-dark);
    }

    .panel {
      display: none;
    }

    .panel.active {
      display: block;
    }

    .no-history {
      padding: 1rem;
      font-style: italic;
      color: #666;
      text-align: center;
    }

    .dark-mode .no-history {
      color: #aaa;
    }
  </style>
</head>
<body class="light-mode">
  <div class="container">
    <div class="header">
      <h1 class="title">Code Analysis Tool</h1>
      <div class="theme-toggle">
        <input type="checkbox" id="themeToggle" onchange="toggleTheme()">
        <span class="slider"></span>
      </div>
    </div>

    <div class="section-tabs">
      <div class="tab active" onclick="activateTab('analysis-panel')">Analysis</div>
      <div class="tab" onclick="activateTab('history-panel')">History</div>
    </div>

    <div id="analysis-panel" class="panel active">
      <div class="buttons">
        <button class="action-button accept" onclick="acceptFixes()">Accept Fixes</button>
        <button class="action-button decline" onclick="declineFixes()">Decline Fixes</button>
      </div>

      <div class="output-container">
        <pre id="output">Bugs will be fixed here</pre>
      </div>
    </div>

    <div id="history-panel" class="panel">
      <div class="history-panel">
        <div class="history-header">
          <span>Previous Code Versions</span>
        </div>
        <div id="history-list" class="history-list">
          <div class="no-history">No history available yet</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    let codeHistory = [];

    window.addEventListener('message', event => {
      const message = event.data;
      if (message.command === 'display') {
        document.getElementById('output').innerText = message.content;
      } else if (message.command === 'updateHistory') {
        codeHistory = message.history;
        updateHistoryDisplay();
      }
    });

    function toggleTheme() {
      const body = document.body;
      body.classList.toggle('dark-mode');
      body.classList.toggle('light-mode');
    }

    function acceptFixes() {
      const fixedText = document.getElementById('output').innerText;
      console.log("Sending fixed code to extension:", fixedText);
      vscode.postMessage({ command: 'acceptFixes', fixedText });
    }

    function declineFixes() {
      vscode.postMessage({ command: 'declineFixes' });
    }

    function activateTab(tabId) {
      // Deactivate all tabs and panels
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
      
      // Activate selected tab and panel
      document.querySelector('.tab[onclick="activateTab(\\''+tabId+'\\')"]').classList.add('active');
      document.getElementById(tabId).classList.add('active');
    }

    function updateHistoryDisplay() {
      const historyList = document.getElementById('history-list');
      
      if (codeHistory.length === 0) {
        historyList.innerHTML = '<div class="no-history">No history available yet</div>';
        return;
      }
      
      historyList.innerHTML = '';
      
      codeHistory.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const details = document.createElement('div');
        details.className = 'history-details';
        
        const timestamp = document.createElement('div');
        timestamp.className = 'history-timestamp';
        timestamp.textContent = entry.timestamp;
        
        const action = document.createElement('div');
        action.className = 'history-action';
        action.textContent = entry.action;
        
        details.appendChild(timestamp);
        details.appendChild(action);
        
        const undoButton = document.createElement('button');
        undoButton.className = 'history-undo';
        undoButton.textContent = 'Undo';
        undoButton.onclick = function(e) {
          e.stopPropagation();
          undoHistoryEntry(index);
        };
        
        item.appendChild(details);
        item.appendChild(undoButton);
        
        item.addEventListener('click', () => {
          document.getElementById('output').innerText = entry.code;
          activateTab('analysis-panel');
        });
        
        historyList.appendChild(item);
      });
    }

    function undoHistoryEntry(index) {
      // Activate the analysis panel first to ensure the editor is accessible
      activateTab('analysis-panel');
      
      // Add a slight delay to ensure UI updates before sending the message
      setTimeout(() => {
        vscode.postMessage({ command: 'undoHistoryEntry', index: index });
      }, 100);
    }
  </script>
</body>
</html>`;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};