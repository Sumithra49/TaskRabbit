const users = {};
const secret = "masai";
function createToken(username) {
  return btoa(JSON.stringify({ username, exp: Date.now() + 6000 }));
}
function validateToken(token) {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}
document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (users[username]) {
      alert("Username already exists");
      return;
    }
    users[username] = password;
    alert("Registration Successful");
  });
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    if (!users[username] || users[username] !== password) {
      alert("Invalid credentials");
      return;
    }
    const token = createToken(username);
    localStorage.setItem("token", token);
    alert("Login Successful");
  });
document
  .getElementById("accessProtected")
  .addEventListener("click", function () {
    const token = localStorage.getItem("token");
    if (!token || !validateToken(token)) {
      alert("You are not authenticated");
      return;
    }
    document.getElementById("protectedMessage").innerText = "Access Granted";
  });

//upload images
document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceed 5 MB");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Image uploaded successfully");
      })
      .catch((error) => console.error("Error:", error));
    alert("Upload failed");
  });

//tasklist
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  document
    .getElementById("taskForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      addTask();
    });
});
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.innerHTML = `<span>${task.text}</span>
        <button onclick='editTask(${index})'>Edit</button>
        <button onclick='deleteTask(${index})'>Delete</button>`;
    taskList.appendChild(taskDiv);
  });
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const newTask = { text: taskInput.value };
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  loadTasks();
}
function editTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete")) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}
