import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
})

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdataFile: (callback) => ipcRenderer.on('update_file', callback),
  onFinishTranslate: (callback) => ipcRenderer.on('finish_translate', callback)
})
