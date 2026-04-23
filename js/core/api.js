// =========================
// API LAYER (DUMMY → READY FOR REAL API)
// =========================

// Simulasi delay (biar nanti feel async)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =========================
// AUTH API
// =========================
export async function login(username, password) {
  await delay(300);

  const users = [
    { username: "admin", password: "123", role: "Admin Pusat" },
    { username: "cabang", password: "123", role: "Pengurus Cabang" },
    { username: "atlet", password: "123", role: "Atlet" }
  ];

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    throw new Error("INVALID_CREDENTIAL");
  }

  // nanti ini diganti token dari backend
  return {
    token: "dummy-token-123",
    user: {
      username: user.username,
      role: user.role
    }
  };
}


// =========================
// GET PROFILE
// =========================
export async function getProfile() {
  await delay(200);

  return {
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role")
  };
}