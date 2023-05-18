const form = document.querySelector("form");
const errorElement = document.getElementById("login-error");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const username = formData.get("Username");
  const password = formData.get("Password");
  
  ipcRenderer.send('send-login-info', [username, password]);
});

ipcRenderer.on('incorrect-login', (event) => {
    errorElement.style.display = "block";
});

ipcRenderer.on('correct-login', (event) => {
    errorElement.style.display = "none";
});