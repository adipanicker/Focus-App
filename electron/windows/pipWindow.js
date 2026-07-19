import { BrowserWindow, screen } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let pipWindow = null;
export function createPipWindow() {
    pipWindow = new BrowserWindow({
        width: 220,
        height: 120,
        minWidth: 120,
        minHeight: 90,
        maxWidth: 360,
        maxHeight: 200,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        resizable: true,
        skipTaskbar: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });
    const devUrl = process.env.VITE_DEV_SERVER_URL;
    if (devUrl) {
        pipWindow.loadURL(`${devUrl}pip.html`);
    }
    else {
        pipWindow.loadFile(path.join(__dirname, "../dist/pip.html"));
    }
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    pipWindow.setPosition(screenWidth - 240, screenHeight - 140);
    return pipWindow;
}
export function getPipWindow() {
    return pipWindow;
}
