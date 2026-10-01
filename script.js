const views = {
  home: document.getElementById("homeView"),
  askhat: document.getElementById("askhatView"),
  erasyl: document.getElementById("erasylView"),
  task1: document.getElementById("task1View"),
  task2: document.getElementById("task2View"),
  task3: document.getElementById("task3View")
};

const navTabs = document.querySelectorAll(".nav-tab");
const memberRows = document.querySelectorAll(".member-row");
const themeToggle = document.getElementById("themeToggle");

function setTheme(isDark) {
  document.body.classList.toggle("dark-theme", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Ашық тақырыпты қосу" : "Қараңғы тақырыпты қосу"
  );
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
}

setTheme(localStorage.getItem("dark-theme") === "true");

themeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-theme");
  setTheme(isDark);
  localStorage.setItem("dark-theme", String(isDark));
});

function openView(name) {
  Object.values(views).forEach(view => view.classList.remove("active-view"));
  views[name].classList.add("active-view");

  navTabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.view === name);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navTabs.forEach(tab => {
  tab.addEventListener("click", () => openView(tab.dataset.view));
});

memberRows.forEach(row => {
  row.addEventListener("click", () => openView(row.dataset.open));
});

/* =========================
   1-ТАПСЫРМА
   ========================= */

// ID бойынша табу және мәтінді өзгерту
const task1Element = document.getElementById("task1Element");
task1Element.textContent = "Салем алем";
task1Element.addEventListener("click", function() {
  task1Element.textContent =
    task1Element.textContent === "Салем алем" ? "Ескі мәтін" : "Салем алем";
});

// old-element класындағы элементті өшіру
const oldElement = document.querySelector(".old-element");
oldElement.remove();

// Жаңа элементті қосу және өшіру
const toggleTask1Element = document.getElementById("toggleTask1Element");
const task1Result = document.getElementById("task1Result");
let addedElement = null;

toggleTask1Element.addEventListener("click", function() {
  if (addedElement) {
    addedElement.remove();
    addedElement = null;
    toggleTask1Element.textContent = "Жаңа элемент қосу";
    return;
  }

  addedElement = document.createElement("div");
  addedElement.className = "task-box";
  addedElement.textContent = "Мен жаңа элементпін";
  task1Result.append(addedElement);
  toggleTask1Element.textContent = "Элемент өшіру";
});

// Жаңа p жасау
const newParagraph = document.createElement("p");
newParagraph.textContent = "Бұл ауыспалы абзац";
task1Result.append(newParagraph);

// Абзацты басқанда түсі мен қаріп өлшемін өзгерту
newParagraph.addEventListener("click", function() {
  newParagraph.classList.toggle("highlighted-paragraph");
});

/* =========================
   2-ТАПСЫРМА
   ========================= */

const classElement = document.getElementById("classElement");
const toggleActive = document.getElementById("toggleActive");
const classListText = document.getElementById("classListText");

function showClasses() {
  console.log(classElement.classList);
  classListText.textContent =
    "Элементтің кластары: " + classElement.classList.value;
}

// active класын қосу/өшіру
toggleActive.addEventListener("click", function() {
  classElement.classList.toggle("active");
  showClasses();
});

showClasses();

/* =========================
   3-ТАПСЫРМА
   ========================= */

const tableForm = document.getElementById("tableForm");
const tableContainer = document.getElementById("tableContainer");
const cellColor = document.getElementById("cellColor");
const cellCountResult = document.getElementById("cellCountResult");

function getContrastingTextColor(hexColor) {
  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
  return brightness >= 150 ? "#1e293b" : "#ffffff";
}

function renderCellCounts() {
  const counts = new Map([[cellColor.value, 0]]);

  tableContainer.querySelectorAll("td[data-color]").forEach(cell => {
    const color = cell.dataset.color;
    if (color) counts.set(color, (counts.get(color) || 0) + 1);
  });

  cellCountResult.replaceChildren();
  counts.forEach((count, color) => {
    const item = document.createElement("div");
    item.className = "cell-count";

    const swatch = document.createElement("span");
    swatch.className = "cell-count-swatch";
    swatch.style.backgroundColor = color;
    swatch.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = `${color.toUpperCase()}: ${count} ұяшық`;

    item.append(swatch, label);
    cellCountResult.append(item);
  });
}

function createTable(rowCount, columnCount) {
  const table = document.createElement("table");
  table.className = "color-table";
  const tableBody = table.createTBody();

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const row = tableBody.insertRow();

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const cell = row.insertCell();
      cell.textContent = `${rowIndex + 1}:${columnIndex + 1}`;
      cell.addEventListener("click", function() {
        const isSelectedColor = cell.dataset.color === cellColor.value;
        cell.dataset.color = isSelectedColor ? "" : cellColor.value;
        cell.style.backgroundColor = isSelectedColor ? "" : cellColor.value;
        cell.style.color = isSelectedColor ? "" : getContrastingTextColor(cellColor.value);
        renderCellCounts();
      });
    }
  }

  tableContainer.replaceChildren(table);
  renderCellCounts();
}

tableForm.addEventListener("submit", function(event) {
  event.preventDefault();
  createTable(Number(document.getElementById("rowCount").value), Number(document.getElementById("columnCount").value));
});

cellColor.addEventListener("input", renderCellCounts);

createTable(4, 5);


/* =========================
   АВТО-СКРЫТИЕ НИЖНЕГО МЕНЮ
   ========================= */

const bottomNav = document.querySelector(".bottom-nav");
let hideMenuTimer;

function resetBottomNavTimer() {
  bottomNav.classList.remove("nav-hidden");
  clearTimeout(hideMenuTimer);

  hideMenuTimer = setTimeout(() => {
    // Не прячем меню, если пользователь прямо сейчас навёл мышь на него
    if (!bottomNav.matches(":hover") && !bottomNav.matches(":focus-within")) {
      bottomNav.classList.add("nav-hidden");
    }
  }, 3000);
}

["mousemove", "pointermove", "touchstart", "focusin"].forEach(eventName => {
  bottomNav.addEventListener(eventName, resetBottomNavTimer, { passive: true });
});

navTabs.forEach(tab => {
  tab.addEventListener("click", resetBottomNavTimer);
});

resetBottomNavTimer();
