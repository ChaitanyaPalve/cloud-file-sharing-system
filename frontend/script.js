const API_URL = "https://cloud-file-sharing-system-1.onrender.com";

function showMessage(text, type) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.className = type;
}

async function registerUser() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!name || !email || !password) {
    showMessage("Please fill all register fields.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage(data.message || "Registration successful!", "success");
    } else {
      showMessage(data.detail || "Registration failed.", "error");
    }
  } catch (err) {
    showMessage("Backend connection failed. Check Render backend URL.", "error");
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    showMessage("Please fill login email and password.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage(data.message || "Login successful!", "success");
    } else {
      showMessage(data.detail || "Login failed.", "error");
    }
  } catch (err) {
    showMessage("Backend connection failed. Check Render backend URL.", "error");
  }
}

async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    showMessage("Please select a file first.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      showMessage(data.message || "File uploaded successfully!", "success");
    } else {
      showMessage(data.detail || "Upload failed.", "error");
    }
  } catch (err) {
    showMessage("Upload failed. Check backend URL or upload route.", "error");
  }
}
