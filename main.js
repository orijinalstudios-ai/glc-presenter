const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs'); // NEW: The File System reader

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

// NEW: The Database Reader
ipcMain.handle('load-database', async () => {
    // 1. Find the exact path to database.json
    const dataPath = path.join(__dirname, 'database.json');
    
    // 2. Read the raw text from the file
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    
    // 3. Convert it into a JavaScript object and send it back
    return JSON.parse(rawData);
});

// NEW: The Media Folder Scanner
ipcMain.handle('get-media-files', () => {
    // 1. Tell the computer exactly where the 'media' folder is
    const mediaFolder = path.join(__dirname, 'media');
    
    // 2. Check if the folder actually exists first
    if (!fs.existsSync(mediaFolder)) {
        return []; // If no folder, return an empty list
    }
    
    // 3. Read the folder and return the list of file names inside it
    const files = fs.readdirSync(mediaFolder);
    return files;
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