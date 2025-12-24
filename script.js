let todos = [];
let currentFilter = "all";

const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const toggleAll = document.getElementById("toggle-all");
const clearCompletedBtn = document.getElementById("clear-completed");
const filters = document.querySelectorAll(".filters a");

// ADD TODO
function addTodo(title) {
  todos.push({
    id: Date.now(),
    title,
    completed: false,
  });
}

// TOGGLE TODO
function toggleTodo(id) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
}

// DELETE TODO
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
}

// TOGGLE ALL
function toggleAllTodos(checked) {
  todos = todos.map((t) => ({ ...t, completed: checked }));
}

// CLEAR COMPLETED
function clearCompletedTodos() {
  todos = todos.filter((t) => !t.completed);
}

// FILTER
function getVisibleTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.completed);
  if (currentFilter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

// RENDER
function render() {
  list.innerHTML = "";

  getVisibleTodos().forEach((todo) => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "toggle";
    checkbox.checked = todo.completed;

    checkbox.addEventListener("change", () => {
      toggleTodo(todo.id);
      render();
    });

    const label = document.createElement("label");
    label.textContent = todo.title;

    // EDIT
    label.addEventListener("dblclick", () => {
      const edit = document.createElement("input");
      edit.value = todo.title;
      edit.className = "new-todo";

      li.replaceChild(edit, label);
      edit.focus();

      function saveEdit() {
        const value = edit.value.trim();

        if (value === "") {
          deleteTodo(todo.id);
        } else {
          todo.title = value;
        }
        render();
      }

      // Save on blur
      edit.addEventListener("blur", saveEdit);

      // Save on Enter
      edit.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          saveEdit();
        }
      });
    });

    const destroy = document.createElement("button");
    destroy.className = "destroy";
    destroy.textContent = "×";
    destroy.onclick = () => {
      deleteTodo(todo.id);
      render();
    };

    li.append(checkbox, label, destroy);
    list.appendChild(li);
  });

  itemsLeft.textContent = todos.filter((t) => !t.completed).length;
  toggleAll.checked = todos.length > 0 && todos.every((t) => t.completed);
}

// EVENTS
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value.trim()) {
    addTodo(input.value.trim());
    input.value = "";
    render();
  }
});

toggleAll.addEventListener("change", (e) => {
  toggleAllTodos(e.target.checked);
  render();
});

clearCompletedBtn.addEventListener("click", () => {
  clearCompletedTodos();
  render();
});

filters.forEach((f) => {
  f.addEventListener("click", (e) => {
    e.preventDefault();
    filters.forEach((x) => x.classList.remove("selected"));
    f.classList.add("selected");
    currentFilter = f.dataset.filter;
    render();
  });
});
