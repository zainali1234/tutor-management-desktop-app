const { contextBridge, ipcRenderer} = require('electron')
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
  remove: (channel,func) => ipcRenderer.removeListener(channel,func),
  removeAll: (channel,func) => ipcRenderer.removeAllListeners(channel)
});



contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast(),
});