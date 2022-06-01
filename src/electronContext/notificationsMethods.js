const { generateNotification } = require("../utils/NotificationsUtils");
const dialog = require("electron").dialog;
let intervalChat = null;

function notificationsListeners(ipcMain, win, windowState) {
  ipcMain.on("notificationChat", (event, { originalTitle, ...args }) => {
    if (!windowState.getFocus()) {
      //win.hide();
      //win.show();
      generateNotification(args, win, event);
    } else {
      intervalChat = setInterval(() => {
        win.title === originalTitle
          ? (win.title = "Nuevos mensajes")
          : (win.title = originalTitle);
      }, 1000);
    }
  });

  ipcMain.on("clearNotificationInterval", (event, { originalTitle }) => {
    intervalChat && clearInterval(intervalChat);
    win.title = originalTitle;
  });
}

module.exports = {
  notificationsListeners,
};
