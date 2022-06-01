const { Notification } = require("electron");
const path = require("path");

function generateNotification(args, win, event) {

  const notification = new Notification({
    ...args,
    icon: path.join(__dirname, "../assets/Epiron_notification.png"),
    silent: true,
    tranparent: true,
  });

  notification.show();
  notification.on("click", () => {
    win.maximize();
    win.moveTop();
    win.show();
    event.sender.send("focusNewMessage", args);
  });
}

module.exports = {
  generateNotification,
};
