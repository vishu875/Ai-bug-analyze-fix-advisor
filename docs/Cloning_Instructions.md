### **1. Install Dependencies**  
Since `node_modules/` and virtual environments are ignored, they need to install the required dependencies.

#### **For the VS Code Extension (Node.js project)**
```sh
cd vscode_extension  # Navigate to the extension directory
npm install          # Install dependencies
```

#### **For the Next.js Website**
```sh
cd bug-fixer        # Navigate to the Next.js app
npm install         # Install dependencies
```

---

### **2. Set Up the Python Backend**
Since the `env/` (Python virtual environment) is ignored, they must recreate it.

```sh
cd backend
python -m venv env  # Create a virtual environment
source env/bin/activate  # Activate it (Mac/Linux)
env\Scripts\activate  # Activate it (Windows)
pip install -r requirements.txt  # Install Python dependencies
```
_(Make sure a `requirements.txt` file is included in the repo to specify necessary Python packages.)_

---

### **3. Set Up Environment Variables**
Since `.env` files are ignored, they must create their own.  
You can provide a sample `.env.example` file in the repo, and they should copy it:

```sh
cp .env.example .env  # Linux/Mac
copy .env.example .env  # Windows
```
Then, they should update `.env` with the required values.

---

### **4. Run the Projects**

#### **VS Code Extension**
```sh
cd vscode_extension
npm run compile  # If using TypeScript
npm run start  # To start the extension in VS Code
```

#### **Next.js Website**
```sh
cd bug-fixer
npm run dev  # Start the Next.js app
```

#### **Python Backend**
```sh
cd backend
python main.py  # Start the backend server
```

---

### **5. Additional Setup (If Using a Database)**
If your project uses a database (e.g., PostgreSQL, Firebase, MongoDB), they must set it up separately using credentials from the `.env` file.

---

### **Final Notes**
- Make sure **`package.json`** and **`requirements.txt`** are properly updated.
- Add a **README.md** explaining these steps for your teammates.

Let me know if you need a custom script for automating this! 🚀
