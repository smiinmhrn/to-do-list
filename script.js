const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    const span = li.querySelector(".text");
    tasks.push({
      text: span.textContent,
      done: span.classList.contains("done"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(text, done = false) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;
  span.classList.add("text");
  if (done) span.classList.add("done");

  const delBtn = document.createElement("button");
  delBtn.textContent = "حذف";
  delBtn.classList.add("delete-btn");

  span.addEventListener("click", () => {
    span.classList.toggle("done");
    saveTasks();
  });

  delBtn.addEventListener("mousedown", (e) => {
    if (delBtn.textContent === "ثبت") {
      li.dataset.savingByButton = "true";
    }
  });

  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (delBtn.textContent === "حذف") {
      li.remove();
      saveTasks();
      return;
    }

    if (delBtn.textContent === "ثبت") {
      const input = li.querySelector("input");
      if (input) {
        span.textContent = input.value.trim() || "کار بدون عنوان";
        li.replaceChild(span, input);
        li.classList.remove("editing");
        delBtn.textContent = "حذف";
        li.dataset.savingByButton = "false";
        saveTasks();
      }
    }
  });

  span.addEventListener("dblclick", () => {
    const input = document.createElement("input");
    input.value = span.textContent;
    li.classList.add("editing");
    li.replaceChild(input, span);
    input.focus();
    delBtn.textContent = "ثبت";
    li.dataset.editing = "true";
    li.dataset.savingByButton = "false";

    input.addEventListener("blur", () => {
      if (li.dataset.savingByButton === "true") {
        li.dataset.savingByButton = "false";
        return;
      }
      span.textContent = input.value.trim() || "کار بدون عنوان";
      li.replaceChild(span, input);
      li.classList.remove("editing");
      delBtn.textContent = "حذف";
      li.dataset.editing = "false";
      saveTasks();
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") input.blur();
    });
  });

  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);
  saveTasks();
}

addBtn.addEventListener("click", () => {
  if (taskInput.value.trim()) {
    addTask(taskInput.value.trim());
    taskInput.value = "";
  }
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBtn.click();
});

window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  saved.forEach((t) => addTask(t.text, t.done));
});
