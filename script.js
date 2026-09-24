const views = {
  home: document.getElementById("homeView"),
  askhat: document.getElementById("askhatView"),
  erasyl: document.getElementById("erasylView"),
  task1: document.getElementById("task1View"),
  task2: document.getElementById("task2View")
};

const navTabs = document.querySelectorAll(".nav-tab");
const memberRows = document.querySelectorAll(".member-row");

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
task1Element.textContent = "Сәлем, әлем!";

// Жаңа div жасау және body-ға қосу
const newDiv = document.createElement("div");
newDiv.className = "new-div task-box";
newDiv.textContent = "Мен жаңа элементпін";
document.getElementById("task1Result").append(newDiv);

// old-element класындағы элементті өшіру
const oldElement = document.querySelector(".old-element");
oldElement.remove();

// Жаңа p жасау
const newParagraph = document.createElement("p");
newParagraph.textContent = "Бұл ауыспалы абзац";
document.getElementById("task1Result").append(newParagraph);

// Абзацты басқанда түсі мен қаріп өлшемін өзгерту
newParagraph.addEventListener("click", function() {
  newParagraph.style.color = "red";
  newParagraph.style.fontSize = "25px";
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
