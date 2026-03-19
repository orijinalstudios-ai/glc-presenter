const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Channel 1: Lyrics
    sendLyric: (lyric) => ipcRenderer.send('update-lyric', lyric),
    onLyricUpdate: (callback) => ipcRenderer.on('new-lyric', (event, lyric) => callback(lyric)),
    
    // Channel 2: Media (NEW)
    sendMedia: (mediaPath) => ipcRenderer.send('update-media', mediaPath),
    onMediaUpdate: (callback) => ipcRenderer.on('new-media', (event, mediaPath) => callback(mediaPath))
});