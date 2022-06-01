"use strict";

const path = require("path");
const { app, screen, BrowserWindow, ipcMain, Menu } = require("electron");
const {autoUpdater} = require("electron-updater");

const {
  notificationsListeners,
} = require("./electronContext/notificationsMethods");
const WindowState = require("./utils/WindowState");
const windowListeners = require("./electronContext/windowListeners");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}

let winUpdater;

function sendStatusToWindow(text) {
  log.info(text);
  winUpdater.webContents.send('message', text);
}
function createDefaultWindow() {
  winUpdater = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  winUpdater.webContents.openDevTools();
  winUpdater.on('closed', () => {
    winUpdater = null;
  });
  winUpdater.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return winUpdater;
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

app.on("ready", () => {

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();

  autoUpdater.checkForUpdatesAndNotify();

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const windowState = new WindowState(true);

  const config = {
    width,
    height,
    movable: false,
    minimizable: true,
    maximizable: false,
    resizable: false,
    //frame: false,
    autoHideMenuBar: true,
    show: false,
    title: "Epiron-Desktop",
    icon: path.join(__dirname, "/assets/Epiron_favicon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  };

  if (process.platform === "win32") {
    app.setAppUserModelId("Epiron-Desktop");
  }

  let win = new BrowserWindow(config);

  //win.loadFile('./renderer/index.html')
  win.loadURL("http://34.231.134.38/login");
  win.maximize();

  win.on("ready-to-show", () => {
    win.on("focus", () => {
      windowState.setFocus(true);
    });

    win.on("blur", () => {
      windowState.setFocus(false);
    });

    win.on("close", (e) => {
      e.preventDefault();
      win.webContents.send("logout");
    });

    notificationsListeners(ipcMain, win, windowState);
    windowListeners(ipcMain, win, app);
  });
});
