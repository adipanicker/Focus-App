import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | null = null;

export function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;

  if (devUrl) {
    mainWindow.loadURL(`${devUrl}index.html`);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
  }

  //hide instead of destroy - PiP keeps running, tray "Quit" is the real exit
  mainWindow.on("close", (event) => {
    if ((app as any).isQuitting) return;
    event.preventDefault();
    mainWindow?.hide();
  });

  return mainWindow;
}

export function getMainWindow() {
  return mainWindow;
}
