const { contextBridge, ipcRenderer } = require("electron"); // ✅ All necessary elements are imported correctly

// Exposing an API to the renderer process through contextBridge
contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("exit-app"), // Sending a message to the main process to close the app
});

window.addEventListener("DOMContentLoaded", () => {
  // Adding an event listener for the screenshot button
  document.getElementById("screenShot").addEventListener("click", () => {
    ipcRenderer.send("ch1", "screenShot"); // Sending a message to the main process to take a screenshot
  });
});

// Listening for the 'ch2' event and receiving the screenshot as a buffer
ipcRenderer.on("ch2", (event, buffer) => {
  // Converting Buffer to Blob
  const blob = new Blob([buffer], { type: "image/png" });

  // Creating a temporary URL for the image using URL.createObjectURL
  const imgURL = URL.createObjectURL(blob);

  // Setting the temporary URL to the src of the image element
  const imgElement = document.getElementById("screenImg");
  imgElement.src = imgURL;
});
