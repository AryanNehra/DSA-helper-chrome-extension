function waitForProblemAndInjectButton() {
  const hostname = location.hostname;
  let targetSelector = "";

  if (hostname.includes("leetcode")) {
    targetSelector = 'div[data-track-load="description_content"], div[data-key="description-content"]';
  } else if (hostname.includes("geeksforgeeks")) {
    targetSelector = ".problem-content";
  } else if (hostname.includes("hackerrank") || hostname.includes("codeforces")) {
    targetSelector = ".problem-statement";
  }

  const checkExist = setInterval(() => {
    const el = document.querySelector(targetSelector);
    if (el) {
      clearInterval(checkExist);
      if (!document.getElementById("dsa-glow-bulb")) {
        injectToggleBulb(() => el.innerText.trim());
      }
    }
  }, 1000);
}

function injectToggleBulb(getProblemText) {
  const bulb = document.createElement("div");
  bulb.id = "dsa-glow-bulb";
  Object.assign(bulb.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#f97316",
    color: "white",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0 12px #f97316",
    zIndex: "9999",
    cursor: "pointer",
    fontSize: "24px",
    userSelect: "none",
  });
  bulb.innerText = "💡";
  document.body.appendChild(bulb);

  bulb.addEventListener("click", () => {
    const popup = document.getElementById("dsa-hint-popup");
    if (popup) {
      popup.remove();
    } else {
      const problemText = getProblemText();
      if (problemText) fetchHint(problemText);
    }
  });

  bulb.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    bulb.remove();

    const popup = document.getElementById("dsa-hint-popup");
    if (popup) popup.remove();

    showRestoreDot(getProblemText);
  });
}

function showRestoreDot(getProblemText) {
  const dot = document.createElement("div");
  dot.id = "dsa-restore-dot";
  Object.assign(dot.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "16px",
    height: "16px",
    background: "#f97316",
    borderRadius: "50%",
    boxShadow: "0 0 8px #f97316",
    zIndex: "9999",
    cursor: "pointer",
  });
  document.body.appendChild(dot);

  dot.addEventListener("click", () => {
    dot.remove();
    injectToggleBulb(getProblemText);
  });
}

async function fetchHint(problemText) {
  try {
    if (!chrome?.storage?.local) {
      return fetchFromServer(problemText);
    }

    chrome.storage.local.get([problemText], async (result) => {
      const cached = result[problemText];
      if (cached) {
        showHintPopup(cached, problemText);
      } else {
        showHintPopup("⏳ Generating hint...", problemText, true);
        await fetchFromServer(problemText);
      }
    });
  } catch (err) {
    showHintPopup("❌ Extension context invalid. Try reloading.");
  }
}

async function fetchFromServer(problemText) {
  try {
    const res = await fetch("https://dsa-helper-chrome-extension-backend.onrender.com/api/hints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemStatement: problemText }),
    });

    const data = await res.json();
    if (data.hints) {
      chrome?.storage?.local?.set({ [problemText]: data.hints });
      showHintPopup(data.hints, problemText);
    } else {
      showHintPopup("❌ Failed to fetch hint.", problemText);
    }
  } catch (err) {
    showHintPopup("❌ Error fetching hint. Is backend running?", problemText);
  }
}

function showHintPopup(hintsText, problemText, isLoading = false) {
  const existing = document.getElementById("dsa-hint-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "dsa-hint-popup";
  Object.assign(popup.style, {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "320px",
    background: "white",
    color: "#111",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    zIndex: "9999",
    fontSize: "14px",
    maxHeight: "400px",
    overflowY: "auto",
  });

  let hints = hintsText
    .split(/\n(?=\*\*Hint \d+:)/)
    .map(s => s.trim())
    .filter(Boolean);

  if (hints.length > 1 && !hints[0].startsWith("**Hint")) {
    hints[1] = hints[0] + "\n\n" + hints[1];
    hints.shift();
  }

  let currentIndex = 0;

  popup.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <strong>💡 DSA Hint</strong>
      <button id="close-hint" style="background:none;border:none;font-size:16px;cursor:pointer;">✖️</button>
    </div>
    <div id="hint-body" style="white-space:pre-wrap; margin-bottom:12px;"></div>
    <div style="display:flex; justify-content:space-between;">
      <button id="prev-hint" style="background:#9ca3af;color:white;padding:5px 10px;border:none;border-radius:4px;">⬅️ Prev</button>
      <button id="copy-hint" style="background:#f97316;color:white;padding:5px 10px;border:none;border-radius:4px;">📋 Copy</button>
      <button id="next-hint" style="background:#6b7280;color:white;padding:5px 10px;border:none;border-radius:4px;">➡️ Next</button>
    </div>
  `;

  document.body.appendChild(popup);

  const hintBody = document.getElementById("hint-body");
  const prevBtn = document.getElementById("prev-hint");
  const nextBtn = document.getElementById("next-hint");

  const renderHint = () => {
    hintBody.innerHTML = hints[currentIndex] || hintsText;
    prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
    nextBtn.style.display = currentIndex === hints.length - 1 ? "none" : "inline-block";
  };

  renderHint();

  setTimeout(() => {
    const handleOutsideClick = (event) => {
      if (!popup.contains(event.target) && event.target.id !== "dsa-glow-bulb") {
        popup.remove();
        document.removeEventListener("click", handleOutsideClick);
      }
    };
    document.addEventListener("click", handleOutsideClick);
  }, 0);

  document.getElementById("copy-hint").onclick = () => {
    navigator.clipboard.writeText(hints[currentIndex]);
    alert("📋 Hint copied!");
  };

  nextBtn.onclick = () => {
    currentIndex++;
    renderHint();
  };

  prevBtn.onclick = () => {
    currentIndex--;
    renderHint();
  };

  document.getElementById("close-hint").onclick = () => popup.remove();
}

window.addEventListener("load", waitForProblemAndInjectButton);
