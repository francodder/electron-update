module.exports = function (ipcMain, win, app) {
  ipcMain.on("closeWindow", (e) => {
    e.preventDefault();
    win.destroy();
    app.quit();
  });

  ipcMain.on("exit", (e) => {
    e.preventDefault();
    win.destroy();
    app.quit();
  });
};
