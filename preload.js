const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getDirectories: (dirPath) => ipcRenderer.invoke('get:directories', dirPath),
});
