import { app, BrowserWindow, nativeImage } from "electron";
import { ipcMainHandle, ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath, getUIPath, getAssetsPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import path from "path";

// To remove the menu bar
// Menu.setApplicationMenu(null);

app.on("ready", () => {
  // Set the dock icon
  if (process.platform === "darwin" && app.dock) {
    const iconImage = nativeImage.createFromPath(
      path.join(getAssetsPath(), "icon.png"),
    );
    app.dock.setIcon(iconImage);
  }

  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    height: 400,
    fullscreenable: true,
    frame: false,
    icon: path.join(getAssetsPath(), "icon.png"),
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });

  ipcMainOn("sendFrameWindowAction", (action) => {
    switch (action) {
      case "MINIMIZE":
        mainWindow.minimize();
        break;
      case "MAXIMIZE":
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
        break;
      case "CLOSE":
        mainWindow.close();
        break;
    }
  });

  createTray(mainWindow);
  createMenu(mainWindow);

  handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }

    e.preventDefault();
    mainWindow.hide();

    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}
