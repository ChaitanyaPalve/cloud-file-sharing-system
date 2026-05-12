import {
  registerUser,
  loginUser,
  logoutUser,
  saveFileRecord,
  auth
} from "./firebase.js";

const BACKEND_URL = "https://cloud-file-sharing-system-1.onrender.com";

window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await registerUser(email, password);
    alert("Registered Successfully");
  } catch (error) {
    alert(error.message);
  }
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await loginUser(email, password);
    alert("Login Successful");
  } catch (error) {
    alert(error.message);
  }
};

window.logout = async function () {
  try {
    await logoutUser();
    alert("Logged Out");
  } catch (error) {
    alert(error.message);
  }
};

window.uploadFile = async function () {
  const fileInput = document.getElementById("fileInput");
  const result = document.getElementById("result");
  const fileTable = document.getElementById("fileTable");

  if (!auth.currentUser) {
    result.innerHTML = "Please login first.";
    return;
  }

  if (!fileInput.files.length) {
    result.innerHTML = "Please select a file.";
    return;
  }

  const file = fileInput.files[0];
  result.innerHTML = "Uploading file...";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Upload failed");
    }

    await saveFileRecord({
      filename: file.name,
      cid: data.cid,
      ipfs_url: data.ipfs_url,
      owner_email: auth.currentUser.email
    });

    result.innerHTML = `
      File uploaded successfully!<br><br>
      CID: ${data.cid}<br><br>
      <a href="${data.ipfs_url}" target="_blank">Open IPFS File</a>
    `;

    fileTable.innerHTML += `
      <tr>
        <td>${file.name}</td>
        <td>${data.cid}</td>
        <td>Saved in Firebase + IPFS</td>
      </tr>
    `;
  } catch (error) {
    result.innerHTML = error.message;
  }
};