import { BrowserWindow, app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow = null;
export function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 650,
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: "#0a0a0a", // matches bg-neutral-950
            symbolColor: "#a3a3a3", // neutral-400, icon color
            height: 40, // matches our h-10 bar
        },
        icon: path.join(__dirname, "../../build/icon.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });
    const devUrl = process.env.VITE_DEV_SERVER_URL;
    if (devUrl) {
        mainWindow.loadURL(`${devUrl}index.html`);
        mainWindow.webContents.openDevTools({ mode: "detach" });
    }
    else {
        mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    }
    mainWindow.on("close", (event) => {
        if (app.isQuitting)
            return;
        event.preventDefault();
        mainWindow?.hide();
    });
    return mainWindow;
}
export function getMainWindow() {
    return mainWindow;
}
