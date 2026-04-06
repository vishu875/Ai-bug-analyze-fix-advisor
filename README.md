<div align="center">
  <h1>🐛 BugFixerAI</h1>
  <h3><i>Automated Program Repair Powered by LLMs</i></h3>
  <br />
  <p>
    <b>BugFixerAI</b> is an advanced platform designed to detect and fix common backend bugs with minimal manual intervention. By combining rigorous static code analysis with Large Language Models (LLMs), it acts as your intelligent development sidekick—enhancing software reliability by identifying and correcting syntax, configuration, API, and database-related errors on the fly.
  </p>
  <br />
  <p>
    <a href="#-web-based-interface-nextjs--python-backend"><strong>Explore Web Platform</strong></a> ·
    <a href="#-vs-code-extension-nodejs-workspace"><strong>Explore VS Code Extension</strong></a> ·
    <a href="#-getting-started-replication-manual"><strong>Getting Started</strong></a>
  </p>
</div>

---

## ✨ Key Features

### 🌐 Web-based Interface (Next.js + Python Backend)
- **Multilingual Online Compiler:** Write, execute, and test your code securely from any browser.
- **Intelligent Code Analyzer:** Detects logical flaws, anti-patterns, and unhandled edge cases preemptively.
- **Interactive LLM Debugger:** Guides you through fixes, offering step-by-step logic corrections and alternative implementations.

### 🧩 VS Code Extension (Node.js Workspace)
- **Real-Time Static Analysis:** Highlights inefficiencies and hidden bugs directly within the editor.
- **Automated Fix Generation:** Integrates directly with LLM APIs (Gemini 2.0 Flash) to instantly suggest line-by-line code patches.
- **Path Resolution:** Specifically analyzes imports/requires and cross-references workspace files to resolve complex pathing issues dynamically.
- **One-Click Patching:** Review changes through an interactive panel and instantly apply or discard modifications.

---

## 🏗️ Architecture & Core Technologies

BugFixerAI relies on a hybrid pipeline to parse code, detect issues, and generate accurate patches.

### Detection & Analysis
- **Pylint & Flake8:** Used to perform static analysis, flagging style violations, syntax errors, and missing variables.
- **AST (Abstract Syntax Tree):** Parses Python logic directly, allowing BugFixerAI to programmatically analyze code logic (e.g., finding unused variables or missing return statements).
- **Requests & Psycopg2:** Checks for reachable API endpoints and authenticates active database connection strings.

### Repair & Generation
- **LLM APIs (Gemini / OpenAI / LLaMA):** Based on the identified bug context, the codebase communicates directly with LLMs to generate corrected, drop-in replacement code securely without exposing sensitive comments.

---

## ⚙️ How It Works

### 1. VS Code Extension Pipeline
The VS Code extension operates directly within your editor to provide real-time, context-aware bug fixing:
- **Event Listening:** It actively monitors changes in your active text document. Whenever the file is modified or changes size, a new analysis cycle is triggered.
- **Path Resolution Check:** Before relying on the LLM, the extension uses advanced Regular Expressions to scan for `import` and `require` statements. If a relative path is broken, it traverses the workspace directory tree and programmatically corrects the path string by locating the proper nested component.
- **LLM Code Analysis:** Once paths are validated, the extension securely sends the raw code to the **Gemini 2.0 Flash API**, explicitly prompting it to fix syntax errors, logical issues, and performance problems while returning pure line-by-line functional code.
- **Interactive Application:** The suggested fixes are displayed in a side-by-side Webview Panel. Users can instantly "Accept Fixes" (overwriting the editor's text) or undo changes using the built-in version history logger.

### 2. Web Platform & Backend Analytics
The website offers a standalone environment designed for intensive, multi-phase code diagnostics:
- **User Interface (Next.js):** Users write and manage code in an embedded multilingual compiler interface integrated via Monaco Editor.
- **Static Analysis (Python Backend):** The backend receives the raw source code and passes it through intensive inspection modules like **AST** (Abstract Syntax Tree, to extract logic structures programmatically) and **Pylint** (to capture formatting and deep syntax errors).
- **Environment Checks:** Specialized modules like `requests` and `psycopg2` are used dynamically to check if external APIs are reachable and if database connection strings actually evaluate correctly.
- **AI Feedback Loop:** The accumulated diagnostic error logs, combined with the buggy code snippets, are packaged and sent to the LLM (LLaMA/OpenAI). The LLM processes the exact execution failure contexts to generate holistic, highly accurate bug fixes which are then returned to the Next.js frontend.

---

## 📂 Project Structure

```text
BugFixerAI/
├── extension/          # VS Code Extension Source (Node.js)
│   ├── extension.js    # Core logic combining AST/Regex pathing and Gemini code fixing
│   ├── package.json    # Extension manifest and dependencies
│   └── test/           # Test suites
├── website/            # Web platform components
│   ├── backend/        # Python-based backend service
│   └── bug-fixer/      # Next.js React frontend
├── docs/               # Detailed project specifications and reports
└── README.md           # Project documentation
```

---

## 🚀 Getting Started: Replication Manual

Follow these comprehensive steps to replicate the BugFixerAI environment on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- [Python](https://www.python.org/downloads/) (3.10+)
- [VS Code](https://code.visualstudio.com/)

---

### Phase 1: Running the VS Code Extension

1. **Navigate to the extension directory:**
   ```bash
   cd extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Keys:**
   *Open `extension.js` and verify the `GEMINI_API_KEY` configuration. Ensure your local key is configured either in the code or through environment secrets as per your security needs.*

4. **Compile and Execute:**
   ```bash
   # If using TypeScript scripts, run:
   npm run compile
   
   # Start the extension in a new VS Code development window:
   npm run start
   ```

5. **Using the Extension:**
   - In the new VS Code window, open any JavaScript or TypeScript project.
   - Run the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for **`Activate Analyzer`**.
   - The Code Analyzer panel will appear over to the side. Any changes to your code will automatically trigger an analysis, resolving paths and fixing bugs.

---

### Phase 2: Running the Web Platform

#### A. Starting the Next.js Frontend
1. **Navigate to the web app:**
   ```bash
   cd website/bug-fixer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Create a `.env` file from the example (if provided) and fill in necessary keys.
   ```bash
   # Linux/Mac
   cp .env.example .env
   
   # Windows
   copy .env.example .env
   ```
4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   *The platform is now accessible at `http://localhost:3000`.*

#### B. Starting the Python Backend
1. **Navigate to the backend:**
   ```bash
   cd website/backend
   ```
2. **Setup virtual environment:**
   ```bash
   python -m venv env
   
   # Activate (Windows)
   env\\Scripts\\activate
   
   # Activate (Mac/Linux)
   source env/bin/activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the backend:**
   ```bash
   python main.py
   ```

*(Note: Provide custom `.env` keys for API databases like PostgreSQL if utilized by the Node/Python bridging apps)*

---

## 🚧 Limitations & Future Scope

### Current Limitations
1. **Model Generalization Bias:** The LLM performs exceptionally well on backend patterns (node paths, basic syntax) but may struggle with highly proprietary framework abstractions.
2. **Performance Latency:** Real-time generation can take 2-3 seconds per file analysis, which may disrupt rapid coding sessions.
3. **Dataset Coverage:** Very complex, dynamic runtime concurrency issues (like race conditions or deep memory leaks) are currently outside the analysis scope.
4. **Security Considerations:** While sandboxing mitigates many risks, executing untrusted code still carries inherent vulnerabilities.
5. **User Acceptance Bias:** Developers may over-trust LLM suggestions, accepting patches without thorough review.

### Future Work
1. **Expanded Bug Coverage:** Incorporate support for security vulnerabilities, concurrency bugs, and memory management issues.
2. **Automated Test Generation:** Leverage LLMs to synthesize unit tests that validate proposed fixes before applying them.
3. **Fine-Grained Performance Optimization:** Explore model quantization (e.g., QLoRA) to reduce inference latency and enable on-premise deployments securely and efficiently.
4. **Enhanced Security:** Integrate virtualization (e.g., gVisor, Firecracker) for stronger isolation and safe static verification methods.
5. **Broader IDE Support:** Develop plugins for IntelliJ, PyCharm, and other popular editors to broaden adoption.

---

**BugFixerAI** represents a massive leap forward into the pragmatic integration of LLM tools into day-to-day software engineering cycles. Ready to banish the bugs!
