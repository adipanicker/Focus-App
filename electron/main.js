import { app, Menu } from "electron";
import "./services/db";
import { createMainWindow, getMainWindow } from "./windows/mainWindow";
import { createPipWindow, getPipWindow } from "./windows/pipWindow";
import { createTray } from "./tray";
import { registerIpcHandlers } from "./ipc/handlers";
import { timerService } from "./services/TimerService";
// Allow only one instance of Focus
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    // Another instance is already running
    app.quit();
}
else {
    // User tried to launch Focus again
    app.on("second-instance", () => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.show();
            mainWindow.focus();
        }
    });
    app.whenReady().then(() => {
        Menu.setApplicationMenu(null);
        createMainWindow();
        createPipWindow();
        createTray();
        registerIpcHandlers();
        timerService.registerWindow(getMainWindow);
        timerService.registerWindow(getPipWindow);
    });
}
app.on("before-quit", () => {
    app.isQuitting = true;
});
app.on("window-all-closed", () => {
    // Keep Focus running in the system tray
    if (process.platform === "darwin")
        return;
});
app.on("activate", () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
    }
});
