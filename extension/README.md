# BugFixerAI

BugFixerAI is an innovative tool that leverages Large Language Models (LLMs) to identify and fix bugs in code across multiple programming languages. The project consists of two main components:

- **Web-based Interface:**  
  Provides an interactive environment to compile, analyze, and debug code.  
- **VSCode Extension:**  
  Automatically detects and repairs runtime bugs (e.g., path errors, segmentation faults, logical flaws) using LLM-based insights.

The primary goal of BugFixerAI is to offer a seamless debugging experience, enabling both manual and automatic code repair with high precision.

---

## Features 

### Website

- **Multilingual Online Compiler:**  
  Write, execute, and test code in multiple languages directly from the browser with fast, reliable output—ideal for hands-on learning and prototyping.

- **Intelligent Code Analyser:**  
  Interprets code logic to detect potential issues such as logical errors, bad practices, or edge cases before they become bugs, while explaining the reasons behind these issues.

- **Interactive Debugger (LLM-Powered):**  
  Connects to a local LLM-based API, acting as an intelligent code companion that helps users fix bugs and explore alternative implementations.


### VSCode Extension

- **On-the-Fly Static Code Analysis:**  
  Integrates directly into VSCode to automatically analyze the active file, highlighting inefficiencies, bad practices, and hidden bugs without switching contexts.

- **Context-Aware File Detection:**  
  Automatically recognizes and analyses the open file based on its language and structure, providing dynamic insights and intelligent suggestions.

---

## File Structure

```
📂 docs/                # Documentation and instructions
📂 extension/           # Extension files
    📂 test/            # Extension Test Suite
📂 website/             # Website files
    📂 backend/         # Website Backend files
        📂 src/         # Source code files
        📂 env/         # Environment files
    📂 bug-fixer/       # Website Frontend files
        📂 src/         # Source code files
```

---

## How to run BugFixerAI

- Clone the repository
```
git clone https://github.com/VasantatiChitraksh/BugFixerAI.git
```
- To run

  - Website

    ```
    cd .\website\bug-fixer
    npm install
    npm run dev
    ```
  - Extension

    ```
    cd .\extension\
    npm install
    ```
    Press F5 to run extension
---

## Contributors

- Chitraksh Vasantati
- Sri Nithish Goud Suragouni
- Sai Akhil Vangimalla
- Anirudh Reddy Jakka
- Sri Saya Sandeep Karri
- Sathvik Pilyanam 
