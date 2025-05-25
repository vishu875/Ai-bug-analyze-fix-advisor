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

- To use BugFixerAI's 

  - Website : Open this [link](https://bugfixerai-t96w.onrender.com)
    
  - Extension : Search for BugFixerAI in VS Code Extension Store or [Click here](https://marketplace.visualstudio.com/items/?itemName=BugFixer.BugFixerAI)

---
## Limitations & Future Scope

### 🚧 Current Limitations

While BugFixerAI represents a significant step forward in Automated Program Repair (APR), several limitations remain:

1. **Model Generalization**  
   Our fine-tuned LLM excels on backend patterns included in training data (path errors, DB connections), but may underperform on domain-specific logic or highly specialized APIs.

2. **Performance Overhead**  
   Dynamic analysis and GPU-based LLM inference introduce latency. In scenarios requiring rapid iterations, users may experience delays of 2–3 seconds per repair suggestion.

3. **Dataset Coverage**  
   The custom buggy dataset, though varied, does not encompass every possible bug category. Dynamic runtime issues—such as race conditions or memory leaks—fall outside the current scope.

4. **Security Considerations**  
   While sandboxing mitigates many risks, executing untrusted code still carries inherent vulnerabilities. We rely on Docker isolation, but kernel exploits or container escapes remain a theoretical threat.

5. **User Acceptance Bias**  
   Developers may over-trust LLM suggestions, accepting patches without thorough review. Integrating stricter validation criteria or automated test generation could alleviate this risk.

6. **Integration Complexity**  
   Although we support popular development environments, introducing a new microservice pipeline may pose onboarding challenges for teams lacking DevOps expertise.

### 🔮 Future Work

We envision several exciting directions for future development:

1. **Expanded Bug Coverage**  
   Incorporate support for security vulnerabilities (e.g., SQL injection), concurrency bugs, and memory management issues.

2. **Automated Test Generation**  
   Leverage LLMs to synthesize unit tests that validate proposed fixes, reducing manual test writing.

3. **Fine-Grained Performance Optimization**  
   Explore model quantization (e.g., QLoRA) to reduce inference latency and enable on-premise deployments.

4. **Enhanced Security**  
   Integrate virtualization (e.g., gVisor, Firecracker) for stronger isolation and explore static verification methods.

5. **Broader IDE Support**  
   Develop plugins for IntelliJ, PyCharm, and other popular editors to broaden adoption.

6. **User Feedback Loop**  
   Collect feedback on repair quality to continually refine the LLM through active learning.

By addressing these areas, BugFixerAI aims to evolve into a comprehensive APR platform capable of handling diverse software ecosystems and fostering greater trust in automated repair technologies.

### Key Achievements

BugFixerAI has already demonstrated the feasibility and advantages of combining static path validation, LLM-driven repair, and sandboxed validation into a unified APR framework. Our hybrid approach addresses common backend bug categories while offering a seamless user experience.

- **Path Correction Module**: Preemptively resolves file reference issues
- **Dynamic Runtime Repair**: Invokes a custom LLM on every code change to generate contextually relevant fixes
- **Interactive User Control**: Enables developers to accept, reject, or modify suggested patches
- **Modular Architecture**: Containerized design supporting multiple programming languages


## Contributors

- Chitraksh Vasantati
- Sri Nithish Goud Suragouni
- Sai Akhil Vangimalla
- Anirudh Reddy Jakka
- Sri Saya Sandeep Karri
- Sathvik Pilyanam 
