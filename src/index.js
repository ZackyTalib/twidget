const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

const Store = require('electron-store');
Store.initRenderer();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 540,
    height: 590,
    minHeight: 560,
    minWidth: 400,
    icon: path.join(__dirname, '/assets/Icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false
  });

  const loadingWindow = new BrowserWindow({
    width: 540,
    height: 590,
    minHeight: 560,
    minWidth: 400,
    icon: path.join(__dirname, '/assets/Icon.ico'),
    frame: false,
    alwaysOnTop: true
  });

  // and load the index.html of the app.
  loadingWindow.loadFile(path.join(__dirname, 'loading.html'));
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.on('stopLoad', (event, arg) => {
    loadingWindow.destroy();
    mainWindow.show();
  })

  // Open the DevTools.
  mainWindow.setMenu(null);

  globalShortcut.register("CmdOrCtrl+F12", () => {
    mainWindow.isFocused() && mainWindow.webContents.toggleDevTools();
  });

  globalShortcut.register("CmdOrCtrl+F11", () => {
    mainWindow.isFocused() && console.log(mainWindow.getSize());
  });

  globalShortcut.register("CmdOrCtrl+F10", () => {
    mainWindow.isFocused() && mainWindow.reload();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.