const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const filter = document.getElementById("filter");

document.addEventListener("DOMContentLoaded", loadTasks);
form.addEventListener("submit", addNewTask);
filter.addEventListener("change", applyFilter);

document.getElementById("clear-all").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar todas as tarefas?")) {
      localStorage.removeItem("tasks");
      document.getElementById("todo-list").innerHTML = "";
    }
  });  

function addNewTask(event) {
  event.preventDefault();
  const taskText = input.value.trim();
  if (taskText === "") return;
  const taskObj = { text: taskText, done: false };
  addTaskToDOM(taskObj);
  saveTask(taskObj);
  input.value = "";
}

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.classList.toggle("done", task.done);
  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <div>
      <button class="check">✓</button>
      <button class="delete">X</button>
    </div>
  `;

  // Eventos
  li.querySelector(".check").addEventListener("click", () => {
    li.classList.toggle("done");
    toggleDone(task.text);
  });

  li.querySelector(".delete").addEventListener("click", () => {
    li.remove();
    deleteTask(task.text);
  });

  list.appendChild(li);
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTaskToDOM(task));
}

function deleteTask(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleDone(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task => {
    if (task.text === text) {
      task.done = !task.done;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function applyFilter() {
  const value = filter.value;
  const items = list.querySelectorAll("li");

  items.forEach(item => {
    const isDone = item.classList.contains("done");

    if (value === "all") {
      item.style.display = "flex";
    } else if (value === "done" && isDone) {
      item.style.display = "flex";
    } else if (value === "pending" && !isDone) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

