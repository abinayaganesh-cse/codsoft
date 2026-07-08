/* =========================================
   Smart Calculator - Core Logic
   Handles input, calculation, display updates
   ========================================= */

// DOM Elements
const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const historyList = document.getElementById("history-list");
const themeToggle = document.getElementById("theme-toggle");
const copyBtn = document.getElementById("copy-result");
const clearBtn = document.getElementById("clear");
const clockEl = document.getElementById("clock");

// State
let expression = "";
let memory = 0;

// Update Display
function updateDisplay() {
  expressionEl.textContent = expression;
  try {
    const evalResult = eval(expression || "0");
    resultEl.textContent = evalResult;
  } catch {
    resultEl.textContent = "Error";
  }
}

// Handle Button Clicks
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (value) {
      expression += value;
      updateDisplay();
    } else if (action) {
      handleAction(action);
    }
  });
});

// Handle Actions
function handleAction(action) {
  switch (action) {
    case "calculate":
      try {
        const evalResult = eval(expression);
        resultEl.textContent = evalResult;
        addToHistory(expression + " = " + evalResult);
        expression = evalResult.toString();
      } catch {
        resultEl.textContent = "Error";
      }
      break;

    case "backspace":
      expression = expression.slice(0, -1);
      updateDisplay();
      break;

    case "percent":
      try {
        expression = (eval(expression) / 100).toString();
        updateDisplay();
      } catch {
        resultEl.textContent = "Error";
      }
      break;

    case "sign":
      try {
        expression = (-eval(expression)).toString();
        updateDisplay();
      } catch {
        resultEl.textContent = "Error";
      }
      break;

    // Memory Functions
    case "MC":
      memory = 0;
      break;
    case "MR":
      expression += memory;
      updateDisplay();
      break;
    case "M+":
      memory += eval(expression || "0");
      break;
    case "M-":
      memory -= eval(expression || "0");
      break;
    case "MS":
      memory = eval(expression || "0");
      break;

    // Scientific Functions
    case "sqrt":
      expression = Math.sqrt(eval(expression || "0")).toString();
      updateDisplay();
      break;
    case "square":
      expression = Math.pow(eval(expression || "0"), 2).toString();
      updateDisplay();
      break;
    case "inverse":
      expression = (1 / eval(expression || "0")).toString();
      updateDisplay();
      break;
  }
}

// Add to History
function addToHistory(entry) {
  const li = document.createElement("li");
  li.textContent = entry;
  historyList.prepend(li);
}

// Clear
clearBtn.addEventListener("click", () => {
  expression = "";
  updateDisplay();
});

// Copy Result
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(resultEl.textContent);
  alert("Result copied!");
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Load Theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Live Clock
function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();
/* ================================
   Keyboard Support
   ================================ */

document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Numbers and operators
  if (!isNaN(key) || ["+", "-", "*", "/", "."].includes(key)) {
    expression += key;
    updateDisplay();
  }

  // Enter = Calculate
  else if (key === "Enter") {
    handleAction("calculate");
  }

  // Backspace = Delete last character
  else if (key === "Backspace") {
    handleAction("backspace");
  }

  // Escape = Clear all
  else if (key === "Escape") {
    expression = "";
    updateDisplay();
  }

  // Percentage shortcut
  else if (key === "%") {
    handleAction("percent");
  }
});

