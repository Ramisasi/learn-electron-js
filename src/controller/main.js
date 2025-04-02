import {
  app,
  BrowserWindow,
  Menu,
  Tray,
  desktopCapturer,
  ipcMain,
} from "electron/main";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mainMenu from "../class/mainMenu.js";
import { Notification } from "electron";
import { log } from "console";

// this is for home screen menu
const contextMenu = Menu.buildFromTemplate([
  { label: "Item1" },
  { role: "editMenu" },
]);

// this is for getting the directory name
const getDir = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return __dirname;
};

// this is for the tray menu
const trayMenu = () => {
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1" },
    { role: "editMenu" },
    { role: "quit" },
  ]);
  return contextMenu;
};

// this is for creating the tray icon
const createTray = () => {
  const __dirname = getDir();
  const contextMenu = trayMenu();
  const tray = new Tray(join(__dirname, "../access/5.ico"));

  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
};

// this is for creating the main window
const createWindow = () => {
  createTray();
  const __dirname = getDir();
  new mainMenu();

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // show: false,
    // frame: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"), // preload file loading
      contextIsolation: true, // context isolation for security
      enableRemoteModule: false, // disable remote module for more security
      nodeIntegration: false, // prevent direct access to Node.js APIs
    },
  });

  // co0nst secondWin = new BrowserWindow({
  //   width: 400,
  //   height: 300,
  //   parent: win,
  // });

  win.webContents.on("context-menu", (e) => {
    e.preventDefault();
    contextMenu.popup({
      window: win,
    });
  });

  win.loadFile(join(__dirname, "../view/index.html"));
  // secondWin.loadFile("../view/second.html");
  // win.webContents.openDevTools();
  // win.once("ready-to-show", () => {
  //   win.show();
  // });
};

// when the app is ready, create the window
app.whenReady().then(() => {
  createWindow();

  // re-create the window when the app is activated (macOS specific behavior)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// close the app when all windows are closed (except for macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// this is for making a screenshot
ipcMain.on("ch1", (event, arg) => {
  if (arg === "screenShot") {
    desktopCapturer
      .getSources({
        types: ["screen"],
        thumbnailSize: { width: 1920, height: 1820 },
      })
      .then((sources) => {
        event.sender.send("ch2", sources[0].thumbnail.toPNG());
        showElectronNotification();
      });
  }
});

// this is to show a success notification
function showElectronNotification() {
  const __dirname = getDir();
  const notification = new Notification({
    title: "لقطة الشاشة",
    body: "تم التقات لقطة الشاشة بنجاح!",
    // icon: path.join(__dirname, "assets", "../access/5.ico"),
  });

  notification.show();
}
