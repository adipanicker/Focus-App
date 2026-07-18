import { app, BrowserWindow, Menu } from "electron";
import "./services/db";
import { createMainWindow, getMainWindow } from "./windows/mainWindow";
import { createPipWindow, getPipWindow } from "./windows/pipWindow";
import { createTray } from "./tray";
import { registerIpcHandlers } from "./ipc/handlers";
import { timerService } from "./services/TimerService";

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createMainWindow();
  createPipWindow();
  createTray();
  registerIpcHandlers();

  timerService.registerWindow(getMainWindow);
  timerService.registerWindow(getPipWindow);
});

app.on("before-quit", () => {
  (app as any).isQuitting = true;
});

app.on("window-all-closed", () => {
  //main window "closing just hides it"
  if (process.platform === "darwin") return;
});

app.on("activate", () => {
  getMainWindow()?.show();
});
