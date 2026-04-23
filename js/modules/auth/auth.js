import { login } from "../../core/api.js";

// =========================
// LOGIN
// =========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    try {
      const res = await login(username, password);

      localStorage.setItem("isLogin", "true");
      localStorage.setItem("token", res.token);
      localStorage.setItem("username", res.user.username);
      localStorage.setItem("role", res.user.role);

      window.location.href = "dashboard.html";

    } catch (err) {
      if (errorMsg) {
        errorMsg.textContent = "Username atau password salah";
      }
    }
  });
}