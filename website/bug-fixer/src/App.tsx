"use client";
import React, { useState } from 'react';
import { useEffect } from 'react';

import Editor from '@monaco-editor/react';
import { 
  Send, 
  Code2, 
  FileJson, 
  Brain, 
  Bug, 
  X, 
  Sun, 
  Moon, 
  FileCode, 
  Terminal, 
  Settings2, 
  BrainCircuit, 
  Play 
} from 'lucide-react';

const languageOptions = [
  { name: 'C', value: 50 },
  { name: 'C++', value: 54 },
  { name: 'Java', value: 62 },
  { name: 'Python', value: 71 },
];

function App() {
  const [code, setCode] = useState('// Write your code here...');
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [language, setLanguage] = useState(54);
  const [debugging, setDebugging] = useState(false);
  const [debugOutput, setDebugOutput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeDialog, setActiveDialog] = useState<"analysis" | "run" | "debug" | null>(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const closeDialog = () => setActiveDialog(null);
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Jersey+10&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) setCode(value);
  };

  const handleLanguageChange = (event: { target: { value: any } }) => {
    setLanguage(Number(event.target.value));
  };

  const handleDebug = async () => {
    setDebugging(true);
    setDebugOutput('');
    setActiveDialog("debug");
    try {
      const response = await fetch("/api/debugCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      let raw = data.output || data.error || 'No output received';
      let split = raw.split("### Output Code:");
      let out = (split.length > 1 ? split[1] : raw)
        .replace(/[*#`]/g, "")
        .replace(/\n\s*\n/g, "\n")
        .trim();

      setDebugOutput(out);
    } catch (error) {
      console.error("[ERROR] Fetch failed:", error);
      setDebugOutput("🚨 Error fetching from server.");
    } finally {
      setDebugging(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await fetch('/api/submitCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language_id: language, stdin }),
      });

      const result = await response.json();
      setOutput(result.stdout || result.stderr || 'No output');
      setActiveDialog("run");
    } catch (error) {
      console.error('Request Error:', error);
      setOutput('Error processing code');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysis('');
    try {
      const response = await fetch('/api/analyseCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      setAnalysis(result.analysis || 'No issues detected. Your code looks good!');
      setActiveDialog("analysis");
    } catch (error) {
      console.error('Request Error:', error);
      setAnalysis('Error analyzing code');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark-mode' : 'light-mode'} min-h-screen transition-colors duration-300 ease `}>
<style jsx global>{`
  :root {
    /* Light mode colors */
    --bg-light: #f8fafc;
    --bg-gradient-light: linear-gradient(135deg, #f8fafc, #e0f2fe);
    --text-light: #0f172a;
    --accent-light: #3b82f6;
    --accent-gradient-light: linear-gradient(135deg, #3b82f6, #2563eb);
    --secondary-light: #f1f5f9;
    --border-light: #e2e8f0;
    
    /* Dark mode colors */
    --bg-dark: #0f172a;
    --bg-gradient-dark: linear-gradient(135deg, #0f172a, #1e293b);
    --text-dark: #f1f5f9;
    --accent-dark: #60a5fa;
    --accent-gradient-dark: linear-gradient(135deg, #60a5fa, #3b82f6);
    --secondary-dark: #1e293b;
    --border-dark: #334155;
    
    /* Common variables */
    --transition-speed: 0.3s;
    --border-radius: 10px;
    --shadow-light: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-dark: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
    --card-hover-transform: translateY(-4px);
  }
  
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" rel="stylesheet">
  body {
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  
  /* Mode classes applied on container (e.g. outermost div) */
  .light-mode {
    --bg-color: var(--bg-light);
    --bg-gradient: var(--bg-gradient-light);
    --text-color: var(--text-light);
    --accent-color: var(--accent-light);
    --accent-gradient: var(--accent-gradient-light);
    --secondary-color: var(--secondary-light);
    --border-color: var(--border-light);
    --shadow: var(--shadow-light);
    --secondary-color-rgb: 241, 245, 249; /* RGB of #f1f5f9 */
    background: var(--bg-gradient);
    color: var(--text-color);
  }
  .dark-mode {
    --bg-color: var(--bg-dark);
    --bg-gradient: var(--bg-gradient-dark);
    --text-color: var(--text-dark);
    --accent-color: var(--accent-dark);
    --accent-gradient: var(--accent-gradient-dark);
    --secondary-color: var(--secondary-dark);
    --border-color: var(--border-dark);
    --shadow: var(--shadow-dark);
    --secondary-color-rgb: 30, 41, 59; /* RGB of #1e293b */
background: radial-gradient(circle at center, #0f1a27 50%, #1a2a3b 80%, #2a3547 100%);
 color: var(--text-color);
  }
  
  /* Enhanced Toggle Switch with animation */
  .toggle-container {
    position: relative;
    width: 60px;
    height: 30px;
  }
  .toggle-checkbox {
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;
  }
  .toggle-label {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--secondary-color);
    border-radius: 34px;
    border: 2px solid var(--border-color);
    cursor: pointer;
    transition: all 0.4s;
    overflow: hidden;
  }
  .toggle-label:before {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    left: 3px;
    bottom: 2px;
    background: var(--accent-gradient);
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(.17,.67,.83,.67);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  .toggle-checkbox:checked + .toggle-label:before {
    transform: translateX(30px);
  }
  .toggle-label .sun {
    position: absolute;
    left: 6px;
    top: 5px;
    opacity: ${isDarkMode ? 0 : 1};
    transition: opacity 0.3s;
    color: #fbbf24;
    filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.5));
  }
  .toggle-label .moon {
    position: absolute;
    right: 6px;
    top: 5px;
    opacity: ${isDarkMode ? 1 : 0};
    transition: opacity 0.3s;
    color: #94a3b8;
    filter: drop-shadow(0 0 2px rgba(148, 163, 184, 0.5));
  }
  
  /* Enhanced Buttons with gradients and animations */
  .app-button {
    padding: 0.625rem 1.25rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    color: white;
    cursor: pointer;
    box-shadow: var(--shadow);
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
  .app-button:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-out;
  }
  .app-button:hover {
    transform: var(--card-hover-transform);
    box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .app-button:hover:after {
    transform: scaleX(1);
    transform-origin: left;
  }
  .app-button:active {
    transform: translateY(0);
  }
  .app-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: translateY(0);
  }
  .app-button svg {
    transition: transform 0.2s ease;
  }
  .app-button:hover svg {
    transform: scale(1.2);
  }
  .analyze-btn {
    background: var(--accent-gradient);
  }
  .debug-btn {
    background: linear-gradient(135deg, #f43f5e, #e11d48);
  }
  .run-btn {
    background: linear-gradient(135deg, #10b981, #059669);
  }
  
  /* Enhanced Card styling with animations */
  .card {
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
    background-color: rgba(var(--secondary-color-rgb), 0.7);
    backdrop-filter: blur(10px);
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
  }
  .card:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transform: var(--card-hover-transform);
  }
  
  /* Enhanced Scrollbar */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--accent-color) var(--secondary-color);
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--secondary-color);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--accent-gradient);
    border-radius: 10px;
  }
  
  /* Enhanced Input Fields */
  .input-field {
    background-color: var(--secondary-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 0.875rem;
    width: 100%;
    transition: all 0.3s;
    resize: vertical;
    font-family: 'Montserrat', sans-serif;
  }
  .input-field:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    transform: translateY(-2px);
  }
  
  .select-field {
    background-color: var(--secondary-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 0.875rem;
    width: 100%;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    cursor: pointer;
    transition: all 0.3s;
  }
  .select-field:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    transform: translateY(-2px);
  }
  
  /* Dialog slide animation enhancement */
  .dialog-slide {
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
    animation: dialogFadeIn 0.3s ease-out;
  }
  @keyframes dialogFadeIn {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* App header with subtle animation */
  .app-header {
    position: relative;
    overflow: hidden;
  }
  .app-header:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--accent-gradient);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
  .app-header:hover:after {
    transform: scaleX(1);
  }
  
  /* App logo pulse animation */
  .app-logo {
    animation: subtle-pulse 3s infinite alternate;
  }
  @keyframes subtle-pulse {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.05);
    }
  }
  
  /* Code editor enhancements */
  .editor-container {
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .editor-container:focus-within {
    box-shadow: 0 0 0 2px var(--accent-color);
  }
    @import url('https://fonts.googleapis.com/css2?family=Jersey+10&display=swap');

`}</style>

  
    <div className="container mx-auto p-4 md:p-6 max-w-screen-xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-color)] app-header relative h-16">
  
  {/* Centered logo + text */}
  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
    <div className="bg-[var(--accent-color)] p-3 rounded-xl shadow-lg app-logo">
      <Code2 className="w-6 h-6 text-white" />
    </div>
    <h1 className="text-2xl font-bold tracking-tight">BugFixerAI</h1>
  </div>

  {/* Right side toggle */}
  <div className="ml-auto flex items-center gap-4">
    <div className="toggle-container">
      <input 
        type="checkbox" 
        checked={isDarkMode} 
        onChange={toggleTheme} 
        className="toggle-checkbox" 
        id="theme-toggle" 
      />
      <label className="toggle-label" htmlFor="theme-toggle">
        <span className="sun"><Sun className="w-3.5 h-3.5" /></span>
        <span className="moon"><Moon className="w-3.5 h-3.5" /></span>
      </label>
    </div>
    <span className="text-sm font-medium">{isDarkMode ? 'Dark' : 'Light'}</span>
  </div>
</div>

  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Editor and Input */}
        <div className="space-y-8">
          <div className="card editor-container">
            <div className="border-b border-[var(--border-color)] p-4 flex justify-between items-center bg-[var(--bg-color)]">
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-[var(--accent-color)]" />
                <span className="text-sm font-medium">Editor</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleAnalyze} 
                  disabled={analyzing} 
                  className="app-button analyze-btn"
                >
                  <BrainCircuit className="w-4 h-4" />
                  {analyzing ? 'Analyzing...' : 'AI Analyse'}
                </button>
                <button 
                  onClick={handleDebug} 
                  disabled={debugging} 
                  className="app-button debug-btn"
                >
                  <Bug className="w-4 h-4" />
                  {debugging ? 'Debugging...' : 'Debug Code'}
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="app-button run-btn"
                >
                  <Play className="w-4 h-4" />
                  {loading ? 'Running...' : 'Run'}
                </button>
              </div>
            </div>
            <div className="h-[500px]">
              <Editor
                height="100%"
                defaultLanguage="cpp"
                theme={isDarkMode ? "vs-dark" : "light"}
                value={code}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  // cursorSmoothCaretAnimation: true,
                  roundedSelection: true
                }}
              />
            </div>
          </div>
  
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[var(--accent-color)]" />
                Select Language:
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="select-field"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.name}</option>
                ))}
              </select>
            </div>
  
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[var(--accent-color)]" />
                Input (stdin):
              </label>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                className="input-field"
                rows={6}
                placeholder="Enter input for your program here..."
              />
            </div>
          </div>
        </div>
  
        {/* Right column - Output area */}
        <div className="card h-[500px] lg:block">
          <div className="border-b border-[var(--border-color)] p-4 flex justify-between items-center bg-[var(--bg-color)]">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-[var(--accent-color)]" />
              <span className="text-sm font-medium">
                {!activeDialog ? "Output" : activeDialog === "debug" ? "Debug Console" : "AI Analysis"}
              </span>
            </div>
            {activeDialog && (
              <X 
                className="w-5 h-5 cursor-pointer text-[var(--text-color)] hover:text-[var(--accent-color)] transition-colors"
                onClick={closeDialog} 
              />
            )}
          </div>
          <div className="p-5 overflow-y-auto h-[calc(100%-56px)] text-sm text-[var(--text-color)] leading-relaxed whitespace-pre-wrap custom-scrollbar">
            <code>
              {activeDialog === "debug"
                ? debugOutput || "Waiting for debug output..."
                : activeDialog === "analysis"
                ? analysis || "Waiting for analysis..."
                : output || "Waiting for output..."}
            </code>
          </div>
        </div>
      </div>
  
      {/* Mobile dialog overlay with improved backdrop blur */}
      <div 
        className={`fixed top-0 right-0 h-full w-full z-40 bg-black/40 backdrop-blur-md transition-opacity duration-300 lg:hidden ${activeDialog ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeDialog}
      />
  
      {/* Sliding Dialog Box with enhanced animation */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[28rem] z-50 bg-[var(--bg-color)] shadow-lg border-l border-[var(--border-color)] dialog-slide transition-transform duration-300 ease-in-out ${activeDialog ? "translate-x-0" : "translate-x-full"} lg:hidden`}>
        <div className="flex justify-between items-center border-b border-[var(--border-color)] p-4">
          <div className="flex items-center gap-2">
            {activeDialog === "debug" ? (
              <Bug className="w-5 h-5 text-red-500" />
            ) : activeDialog === "analysis" ? (
              <BrainCircuit className="w-5 h-5 text-[var(--accent-color)]" />
            ) : (
              <Terminal className="w-5 h-5 text-green-500" />
            )}
            <span className="text-sm font-medium">
              {activeDialog === "debug" ? "Debug Console" : activeDialog === "analysis" ? "AI Analysis" : "Output"}
            </span>
          </div>
          <X 
            className="w-5 h-5 cursor-pointer text-[var(--text-color)] hover:text-[var(--accent-color)] transition-colors" 
            onClick={closeDialog} 
          />
        </div>
        <div className="p-5 overflow-y-auto h-[calc(100%-56px)] text-sm text-[var(--text-color)] leading-relaxed whitespace-pre-wrap custom-scrollbar">
          <code>
            {activeDialog === "debug"
              ? debugOutput || "Waiting for debug output..."
              : activeDialog === "analysis"
              ? analysis || "Waiting for analysis..."
              : output || "Waiting for output..."}
          </code>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default App;
