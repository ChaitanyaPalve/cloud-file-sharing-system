import {
  registerUser,
  loginUser,
  logoutUser,
  saveFileRecord,
  auth
} from "./firebase.js";

window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await registerUser(email, password);
  alert("Registered successfully");
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await loginUser(email, password);
  alert("Logged in successfully");
};

window.logout = async function () {
  await logoutUser();
  alert("Logged out");
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
    result.innerHTML = "Please select a file first.";
    return;
  }

  const file = fileInput.files[0];
  result.innerHTML = "Uploading file...";

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://127.0.0.1:8000/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  await saveFileRecord({
    filename: file.name,
    cid: data.cid,
    ipfs_url: data.ipfs_url,
    owner_email: auth.currentUser.email
  });

  result.innerHTML = `
    File uploaded successfully!<br>
    CID: ${data.cid}<br>
    <a href="${data.ipfs_url}" target="_blank">Open IPFS File</a>
  `;

  fileTable.innerHTML += `
    <tr>
      <td>${file.name}</td>
      <td>${data.cid}</td>
      <td>Saved in Firebase + IPFS</td>
    </tr>
  `;
};
