async function login() {
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  const res = await fetch("https://siri-dental-clinic.onrender.com/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "admin.html";
  } else {
    error.textContent = "Invalid admin password";
  }
}

