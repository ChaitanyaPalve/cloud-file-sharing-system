async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const result = document.getElementById("result");
  const fileTable = document.getElementById("fileTable");

  if (!fileInput.files.length) {
    result.innerHTML = "Please select a file first.";
    return;
  }

  const file = fileInput.files[0];

  result.innerHTML = "Uploading file...";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.cid) {
      result.innerHTML = `
        File uploaded successfully!<br>
        CID: ${data.cid}
      `;

      fileTable.innerHTML += `
        <tr>
          <td>${file.name}</td>
          <td>${data.cid}</td>
          <td>Stored on IPFS</td>
        </tr>
      `;
    } else {
      result.innerHTML = "Upload failed. CID not received.";
    }

  } catch (error) {
    result.innerHTML = "Backend not connected yet. This frontend is ready.";
  }
}