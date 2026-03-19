const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let projectorWindow; // Keep track of the projector window

function createWindows() {
  // 1. Create the Control Window
  const controlWindow = new BrowserWindow({
    width: 600, height: 400,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  controlWindow.loadFile('control.html');

  // 2. Create the Projector Window
  projectorWindow = new BrowserWindow({
    width: 1024, height: 768,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  projectorWindow.loadFile('projector.html');
}

app.whenReady().then(createWindows);

// 3. The Radio Tower: Listen for messages from Control, send to Projector
ipcMain.on('update-lyric', (event, lyric) => {
    if (projectorWindow) {
        projectorWindow.webContents.send('new-lyric', lyric);
    }
});

// NEW: Listen for media changes and send to Projector
ipcMain.on('update-media', (event, mediaPath) => {
    if (projectorWindow) {
        projectorWindow.webContents.send('new-media', mediaPath);
    }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});