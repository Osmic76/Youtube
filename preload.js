const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("dialog:openDirectory"),
  parseTakeoutData: (folderPath) =>
    ipcRenderer.invoke("takeout:parse", folderPath),
});
