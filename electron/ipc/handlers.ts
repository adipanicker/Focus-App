import { ipcMain, IpcMain } from "electron";
import { IPC } from "../../shared/types";
import { getMainWindow } from "../windows/mainWindow";
import { getPipWindow } from "../windows/pipWindow";
import { timerService } from "../services/TimerService";

export function registerIpcHandlers() {
  ipcMain.on(IPC.SHOW_PIP, () => {
    getMainWindow()?.hide();
    getPipWindow()?.show();
  });

  ipcMain.on(IPC.SHOW_MAIN, () => {
    getPipWindow()?.hide();
    const main = getMainWindow();
    main?.show();
    main?.focus();
  });

  ipcMain.on(IPC.TIMER_START, (_event, durationSeconds?: number) => {
    timerService.start(durationSeconds);
  });

  ipcMain.on(IPC.TIMER_PAUSE, () => timerService.pause());
  ipcMain.on(IPC.TIMER_RESUME, () => timerService.resume());
  ipcMain.on(IPC.TIMER_STOP, () => timerService.stop());

  ipcMain.handle(IPC.TIMER_GET_STATE, () => timerService.getState());
}
