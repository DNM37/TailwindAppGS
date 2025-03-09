const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Disable nodeIntegration for security
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // Preload script to expose safe APIs
    },
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

// Handle request to get directories in a specific path
ipcMain.handle('get:directories', (_, dirPath) => {
  try {
    const fullPath = path.resolve(app.getAppPath(), dirPath);
    const items = fs.readdirSync(fullPath);
    const directories = items
      .map(item => ({
        name: item,
        path: path.join(dirPath, item),
        isDirectory: fs.statSync(path.join(fullPath, item)).isDirectory(),
      }))
      .filter(item => item.isDirectory)
      .map(item => ({ name: item.name, path: item.path }));
    return directories;
  } catch (error) {
    console.error('Error reading directories:', error);
    return [];
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
