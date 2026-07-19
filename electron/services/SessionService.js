import { db } from "./db";
class SessionService {
    logSession(input) {
        const stmt = db.prepare(`
      INSERT INTO sessions (
        activity_id, type, planned_duration_seconds, duration_seconds,
        started_at, ended_at, completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(input.activityId, input.type, input.plannedDurationSeconds, input.durationSeconds, input.startedAt, input.endedAt, input.completed ? 1 : 0);
        return db
            .prepare("SELECT * FROM sessions WHERE id = ?")
            .get(result.lastInsertRowid);
    }
}
export const sessionService = new SessionService();
