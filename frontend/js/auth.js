const API_URL = "http://localhost:3000/api";

//Register
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", register);
}
async function register(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const message = document.getElementById("message");

  if (password !== confirmPassword) {
    message.innerText = "Passwords do not match.";
    return;
  }

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const data = await response.json();

  message.innerText = data.message;

  if (response.ok) {
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  }
}
//login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", login);
}
async function login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const message = document.getElementById("message");

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "index.html";
  } else {
    message.innerText = data.message;
  }
}
