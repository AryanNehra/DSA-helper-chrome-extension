
# 🧠 DSA Helper Chrome Extension

A Chrome Extension that assists users in solving DSA (Data Structures & Algorithms) problems on platforms like LeetCode, GeeksforGeeks, Codeforces, and HackerRank. It provides AI-generated step-by-step hints to guide your problem-solving process without giving away the full solution.

---

## ✨ Features

- 🧠 3-level progressive hints:
  1. **Direction** – Problem topic/area.
  2. **Approach** – General strategy or algorithm.
  3. **Key Implementation Tip** – Final nudge for implementation.
- 🟠 Floating draggable lightbulb button (toggles hint popup).
- 📋 Copy-to-clipboard support for hints.
- 🔁 Next / Prev buttons for hints.
- 💾 Local cache using `chrome.storage.local` to avoid repeat API calls.
- ✨ Sleek popup with outside-click and double-click dismiss.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JS + HTML + CSS (injected via `content.js`)
- **Backend**: Node.js + Express
- **AI Model**: Gemini 1.5 via Google Generative AI API
- **Storage**: Chrome Extension `local.storage`

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AryanNehra/DSA-helper-chrome-extension.git
cd DSA-helper-chrome-extension
```

### 2. Run the backend server

```bash
cd backend
npm install
node server.js
```

Ensure your `.env` file has:

```
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Load extension into Chrome

- Go to `chrome://extensions/`
- Enable **Developer Mode**
- Click **Load Unpacked**
- Select the `frontend/extensions` folder

---

## 🧪 Usage

1. Visit a supported problem site like LeetCode or Codeforces.
2. A 🧠 bulb icon appears in the bottom-right.
3. Click to toggle hints popup.
4. Use **Next/Prev** buttons to explore hints.
5. Click anywhere outside or click again to hide the popup.

---

## 📦 Project Structure

```
DSA-helper-chrome-extension/
│
├── backend/
│   ├── controllers/
│   ├── router/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   └── extensions/
│       ├── manifest.json
│       ├── content.js
│       ├── background.js
│
└── README.md
```

---

## 📃 License

MIT © [Aryan Nehra](https://github.com/AryanNehra)

---

## 🙌 Contributing

PRs and feedback are welcome! Feel free to open issues or add new DSA platforms.
