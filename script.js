const views = {
  home: document.getElementById("homeView"),
  askhat: document.getElementById("askhatView"),
  erasyl: document.getElementById("erasylView"),
  task1: document.getElementById("task1View"),
  task2: document.getElementById("task2View"),
  task3: document.getElementById("task3View"),
  api: document.getElementById("apiView")
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

  if (name === "api" && !todosLoaded) loadTodos();

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
   API ТАПСЫРМАСЫ
   ========================= */

const todosStatus = document.getElementById("todosStatus");
const todosList = document.getElementById("todosList");
const reloadTodosButton = document.getElementById("reloadTodosButton");
const toggleAddTodoButton = document.getElementById("toggleAddTodoButton");
const addTodoForm = document.getElementById("addTodoForm");
const newTodoInput = document.getElementById("newTodoInput");
const addTodoSubmit = document.getElementById("addTodoSubmit");
const todoFilterButtons = document.querySelectorAll(".todo-filter");
let todos = [];
let activeTodoFilter = "all";
let editingTodo = null;
let todosLoaded = false;
let todosBusy = false;

function updateTodoControls() {
  reloadTodosButton.disabled = todosBusy;
  toggleAddTodoButton.disabled = todosBusy;
  addTodoSubmit.disabled = todosBusy;
  newTodoInput.disabled = todosBusy;
  todosList.querySelectorAll("button, input").forEach(control => {
    control.disabled = todosBusy;
  });
}

function updateTodoFilters() {
  todoFilterButtons.forEach(button => {
    const isActive = button.dataset.filter === activeTodoFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderTodos() {
  todosList.replaceChildren();

  const visibleTodos = todos.filter(todo => {
    if (activeTodoFilter === "completed") return todo.completed;
    if (activeTodoFilter === "incomplete") return !todo.completed;
    return true;
  });

  if (visibleTodos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "todo-empty";
    emptyMessage.textContent = "В этой категории пока нет задач.";
    todosList.append(emptyMessage);
  }

  visibleTodos.forEach(todo => {
    const item = document.createElement("li");
    item.className = "todo-item";

    const checkbox = document.createElement("input");
    checkbox.className = "todo-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.disabled = todosBusy;
    checkbox.setAttribute(
      "aria-label",
      `${todo.completed ? "Снять отметку" : "Отметить выполненной"}: ${todo.todo}`
    );
    checkbox.addEventListener("change", () => updateTodo(todo, checkbox.checked));

    const number = document.createElement("span");
    number.className = "todo-number";
    number.textContent = todo.id;

    let taskContent;
    if (editingTodo === todo) {
      taskContent = document.createElement("form");
      taskContent.className = "todo-edit-form";

      const textInput = document.createElement("input");
      textInput.className = "todo-edit-input";
      textInput.type = "text";
      textInput.value = todo.todo;
      textInput.setAttribute("aria-label", "Текст задачи");

      const saveButton = document.createElement("button");
      saveButton.className = "todo-edit-save";
      saveButton.type = "submit";
      saveButton.textContent = "Сохранить";

      const cancelButton = document.createElement("button");
      cancelButton.className = "todo-edit-cancel";
      cancelButton.type = "button";
      cancelButton.textContent = "Отмена";
      cancelButton.addEventListener("click", () => {
        editingTodo = null;
        renderTodos();
      });

      taskContent.addEventListener("submit", event => {
        event.preventDefault();
        saveTodoText(todo, textInput);
      });
      taskContent.append(textInput, saveButton, cancelButton);
    } else {
      taskContent = document.createElement("span");
      taskContent.className = "todo-title";
      taskContent.textContent = todo.todo;
      taskContent.classList.toggle("is-complete", todo.completed);
    }

    const actions = document.createElement("div");
    actions.className = "todo-item-actions";

    const editButton = document.createElement("button");
    editButton.className = "todo-edit-button";
    editButton.type = "button";
    editButton.textContent = "✏️";
    editButton.title = "Редактировать задачу";
    editButton.setAttribute("aria-label", `Редактировать задачу: ${todo.todo}`);
    editButton.disabled = todosBusy || editingTodo === todo;
    editButton.addEventListener("click", () => {
      editingTodo = todo;
      renderTodos();
      const input = todosList.querySelector(".todo-edit-input");
      input.focus();
      input.select();
    });
    actions.append(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-delete";
    deleteButton.type = "button";
    deleteButton.textContent = "Удалить";
    deleteButton.setAttribute("aria-label", `Удалить задачу: ${todo.todo}`);
    deleteButton.disabled = todosBusy;
    deleteButton.addEventListener("click", () => deleteTodo(todo));
    actions.append(deleteButton);

    item.append(checkbox, number, taskContent, actions);
    todosList.append(item);
  });
}

async function loadTodos() {
  if (todosBusy) return;

  todosBusy = true;
  todosStatus.textContent = "Загрузка...";
  updateTodoControls();
  renderTodos();

  try {
    const response = await fetch("https://dummyjson.com/todos");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.todos)) {
      throw new Error("Некорректный формат данных");
    }

    todos = data.todos;
    todosStatus.textContent = `Получено задач: ${todos.length}`;
    todosLoaded = true;
  } catch (error) {
    console.error("Не удалось загрузить задачи DummyJSON:", error);
    todosStatus.textContent = "Не удалось загрузить задачи. Попробуйте обновить список.";
  } finally {
    todosBusy = false;
    updateTodoControls();
    renderTodos();
  }
}

async function createTodo(event) {
  event.preventDefault();
  const todoText = newTodoInput.value.trim();

  if (!todoText) {
    todosStatus.textContent = "Введите текст новой задачи.";
    newTodoInput.focus();
    return;
  }
  if (todosBusy) return;

  todosBusy = true;
  todosStatus.textContent = "Добавление задачи...";
  updateTodoControls();

  try {
    const response = await fetch("https://dummyjson.com/todos/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: todoText, completed: false, userId: 1 })
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // DummyJSON returns a simulated item; it does not persist this change.
    const createdTodo = await response.json();
    if (!Number.isInteger(createdTodo.id)) {
      throw new Error("DummyJSON did not return a valid task ID");
    }

    todos.push({
      id: createdTodo.id,
      todo: createdTodo.todo || todoText,
      completed: createdTodo.completed === true,
      userId: createdTodo.userId ?? 1,
      isLocal: true
    });
    activeTodoFilter = "all";
    updateTodoFilters();
    todosLoaded = true;
    addTodoForm.reset();
    addTodoForm.hidden = true;
    toggleAddTodoButton.setAttribute("aria-expanded", "false");
    todosStatus.textContent = `Задача добавлена. Всего задач: ${todos.length}`;
  } catch (error) {
    console.error("Не удалось добавить задачу DummyJSON:", error);
    todosStatus.textContent = "Не удалось добавить задачу.";
  } finally {
    todosBusy = false;
    updateTodoControls();
    renderTodos();
  }
}

async function updateTodo(todo, completed) {
  if (todosBusy) return;

  if (todo.isLocal) {
    todo.completed = completed;
    todosStatus.textContent = "Статус локальной задачи обновлен.";
    renderTodos();
    return;
  }

  todosBusy = true;
  todosStatus.textContent = "Обновление статуса...";
  updateTodoControls();
  renderTodos();

  try {
    const response = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed })
    });
    const updatedTodo = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${updatedTodo.message || "Unknown error"}`);
    }

    todo.completed = typeof updatedTodo.completed === "boolean"
      ? updatedTodo.completed
      : completed;
    todosStatus.textContent = "Статус задачи обновлен.";
  } catch (error) {
    console.error("Не удалось обновить задачу DummyJSON:", error);
    todosStatus.textContent = "Не удалось обновить статус задачи.";
  } finally {
    todosBusy = false;
    updateTodoControls();
    renderTodos();
  }
}

async function saveTodoText(todo, textInput) {
  const newText = textInput.value.trim();
  if (!newText) {
    todosStatus.textContent = "Введите текст задачи";
    textInput.focus();
    return;
  }
  if (todosBusy) return;

  if (newText === todo.todo) {
    editingTodo = null;
    renderTodos();
    return;
  }

  todosBusy = true;
  todosStatus.textContent = "Сохранение текста задачи...";
  updateTodoControls();

  try {
    const response = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: newText })
    });
    const updatedTodo = await response.json().catch(() => ({}));
    if (!response.ok) {
      const localTodoNotFound = todo.isLocal &&
        response.status === 404 &&
        updatedTodo.message?.includes("not found");

      if (!localTodoNotFound) {
        throw new Error(`HTTP ${response.status}: ${updatedTodo.message || "Unknown error"}`);
      }
    }

    todo.todo = typeof updatedTodo.todo === "string" ? updatedTodo.todo : newText;
    editingTodo = null;
    todosStatus.textContent = todo.isLocal && !response.ok
      ? "Текст локальной задачи обновлен."
      : "Текст задачи обновлен.";
  } catch (error) {
    console.error("Не удалось обновить текст задачи DummyJSON:", error);
    todosStatus.textContent = "Не удалось сохранить текст задачи.";
  } finally {
    todosBusy = false;
    updateTodoControls();
    renderTodos();
  }
}

async function deleteTodo(todo) {
  if (todosBusy || !window.confirm("Удалить эту задачу?")) return;

  if (todo.isLocal) {
    todos = todos.filter(item => item.id !== todo.id);
    todosStatus.textContent = `Локальная задача удалена. Осталось задач: ${todos.length}`;
    renderTodos();
    return;
  }

  todosBusy = true;
  todosStatus.textContent = "Удаление задачи...";
  updateTodoControls();
  renderTodos();

  try {
    const response = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
      method: "DELETE"
    });
    const deletedTodo = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${deletedTodo.message || "Unknown error"}`);
    }

    todos = todos.filter(item => item.id !== todo.id);
    todosStatus.textContent = `Задача удалена. Осталось задач: ${todos.length}`;
  } catch (error) {
    console.error("Не удалось удалить задачу DummyJSON:", error);
    todosStatus.textContent = "Не удалось удалить задачу. Попробуйте еще раз.";
  } finally {
    todosBusy = false;
    updateTodoControls();
    renderTodos();
  }
}

todoFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeTodoFilter = button.dataset.filter;
    updateTodoFilters();
    renderTodos();
  });
});

toggleAddTodoButton.addEventListener("click", () => {
  addTodoForm.hidden = !addTodoForm.hidden;
  toggleAddTodoButton.setAttribute("aria-expanded", String(!addTodoForm.hidden));
  if (!addTodoForm.hidden) newTodoInput.focus();
});

addTodoForm.addEventListener("submit", createTodo);
reloadTodosButton.addEventListener("click", loadTodos);


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
