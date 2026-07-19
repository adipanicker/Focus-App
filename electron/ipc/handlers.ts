import { ipcMain, app } from "electron";
import { IPC } from "../../shared/types";
import { getMainWindow } from "../windows/mainWindow";
import { getPipWindow } from "../windows/pipWindow";
import { timerService } from "../services/TimerService";
import { statsService } from "../services/StatsService";
import { db } from "../services/db";

export function registerIpcHandlers() {
  // console.log("=== WHAT IS IPC? ===", IPC);

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

  ipcMain.on(
    IPC.TIMER_START,
    (
      _event,
      payload: {
        durationSeconds: number;
        activityId: number | null;
        type?: "focus" | "break";
      },
    ) => {
      timerService.start(
        payload.durationSeconds,
        payload.activityId,
        payload.type ?? "focus",
      );
    },
  );

  ipcMain.on(IPC.TIMER_PAUSE, () => timerService.pause());
  ipcMain.on(IPC.TIMER_RESUME, () => timerService.resume());
  ipcMain.on(IPC.TIMER_STOP, () => timerService.stop());

  ipcMain.handle(IPC.TIMER_GET_STATE, () => timerService.getState());

  //Activities
  ipcMain.handle(IPC.ACTIVITIES_GET_ALL, () => {
    return db.prepare("SELECT * FROM activities ORDER BY id").all();
  });

  ipcMain.handle(
    IPC.ACTIVITIES_ADD,
    (_event, payload: { name: string; color: string }) => {
      const result = db
        .prepare(
          "INSERT INTO activities (name, color, created_at) VALUES (?, ?, ?)",
        )
        .run(payload.name, payload.color, Date.now());
      return db
        .prepare("SELECT * FROM activities WHERE id = ?")
        .get(result.lastInsertRowid);
    },
  );

  ipcMain.handle(
    IPC.ACTIVITIES_UPDATE,
    (_event, payload: { id: number; name: string; color: string }) => {
      db.prepare("UPDATE activities SET name = ?, color = ? WHERE id = ?").run(
        payload.name,
        payload.color,
        payload.id,
      );
      return db
        .prepare("SELECT * FROM activities WHERE id = ?")
        .get(payload.id);
    },
  );

  ipcMain.handle(IPC.ACTIVITIES_DELETE, (_event, id: number) => {
    db.prepare("DELETE FROM activities WHERE id = ?").run(id);
    return true;
  });

  // Timer presets
  ipcMain.handle(IPC.PRESETS_GET_ALL, () => {
    return db.prepare("SELECT * FROM timer_presets ORDER BY minutes").all();
  });

  ipcMain.handle(IPC.PRESETS_ADD, (_event, payload: { minutes: number }) => {
    const result = db
      .prepare("INSERT INTO timer_presets (minutes, created_at) VALUES (?, ?)")
      .run(payload.minutes, Date.now());
    return db
      .prepare("SELECT * FROM timer_presets WHERE id = ?")
      .get(result.lastInsertRowid);
  });

  ipcMain.handle(
    IPC.PRESETS_UPDATE,
    (_event, payload: { id: number; minutes: number }) => {
      db.prepare("UPDATE timer_presets SET minutes = ? WHERE id = ?").run(
        payload.minutes,
        payload.id,
      );
      return db
        .prepare("SELECT * FROM timer_presets WHERE id = ?")
        .get(payload.id);
    },
  );

  ipcMain.handle(IPC.PRESETS_DELETE, (_event, id: number) => {
    db.prepare("DELETE FROM timer_presets WHERE id = ?").run(id);
    return true;
  });

  // Settings
  ipcMain.handle(IPC.SETTINGS_GET, () => {
    return db.prepare("SELECT * FROM settings WHERE id = 1").get();
  });

  ipcMain.handle(
    IPC.SETTINGS_UPDATE,
    (_event, payload: Record<string, unknown>) => {
      const fields = Object.keys(payload);
      if (fields.length === 0)
        return db.prepare("SELECT * FROM settings WHERE id = 1").get();

      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = fields.map((f) => payload[f]);
      db.prepare(`UPDATE settings SET ${setClause} WHERE id = 1`).run(
        ...values,
      );

      if ("launch_on_startup" in payload) {
        app.setLoginItemSettings({
          openAtLogin: !!payload.launch_on_startup,
        });
      }

      return db.prepare("SELECT * FROM settings WHERE id = 1").get();
    },
  );

  //Stats Summary
  ipcMain.handle(IPC.STATS_GET_SUMMARY, () => statsService.getSummary());
}
