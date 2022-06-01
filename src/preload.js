window.require = require;
window.ipcRenderer = require("electron").ipcRenderer;

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  generateNotification: (params) => {
    ipcRenderer.send("notificationChat", params);
  },
  clearNotificationInterval: (params) => {
    ipcRenderer.send("clearNotificationInterval", params);
  },
  closeWindow: () => {
    ipcRenderer.send("closeWindow");
  },
  exit: () => {
    ipcRenderer.send("exit");
  },
});

ipcRenderer.on("logout", () => {
  const evt = new CustomEvent("logout");
  window.dispatchEvent(evt);
});

ipcRenderer.on("focusNewMessage", (e, args) => {
  const evt = new CustomEvent("focusNewMessage", args);
  window.dispatchEvent(evt);
});
