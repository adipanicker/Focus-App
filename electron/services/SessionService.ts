import { db } from "./db";
import type { Session } from "../../shared/types";

interface LogSessionInput {
  activityId: number | null;
  type: "focus" | "break";
  plannedDurationSeconds: number;
  durationSeconds: number;
  startedAt: number;
  endedAt: number;
  completed: boolean;
}

class SessionService {
  logSession(input: LogSessionInput): Session {
    const stmt = db.prepare(`
      INSERT INTO sessions (
        activity_id, type, planned_duration_seconds, duration_seconds,
        started_at, ended_at, completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      input.activityId,
      input.type,
      input.plannedDurationSeconds,
      input.durationSeconds,
      input.startedAt,
      input.endedAt,
      input.completed ? 1 : 0,
    );

    return db
      .prepare("SELECT * FROM sessions WHERE id = ?")
      .get(result.lastInsertRowid) as Session;
  }
}

export const sessionService = new SessionService();
