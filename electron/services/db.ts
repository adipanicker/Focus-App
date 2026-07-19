import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";

const dbPath = path.join(app.getPath("userData"), "focus.db");

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS timer_presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    minutes INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('focus', 'break')),
    planned_duration_seconds INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    started_at INTEGER NOT NULL,
    ended_at INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  accent_color TEXT NOT NULL DEFAULT '#378ADD',
  dark_mode INTEGER NOT NULL DEFAULT 1,
  notifications_enabled INTEGER NOT NULL DEFAULT 1,
  launch_on_startup INTEGER NOT NULL DEFAULT 0,
  last_activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
  last_duration_minutes INTEGER NOT NULL DEFAULT 25
);
`);

// Seed defaults on first run only
const activityCount = db
  .prepare("SELECT COUNT(*) as count FROM activities")
  .get() as { count: number };
if (activityCount.count === 0) {
  const insertActivity = db.prepare(
    "INSERT INTO activities (name, color, created_at) VALUES (?, ?, ?)",
  );
  const now = Date.now();
  insertActivity.run("Coding", "#378ADD", now);
  insertActivity.run("Studying", "#EF9F27", now);
  insertActivity.run("Reading", "#2FB380", now);
}

const presetCount = db
  .prepare("SELECT COUNT(*) as count FROM timer_presets")
  .get() as { count: number };
if (presetCount.count === 0) {
  const insertPreset = db.prepare(
    "INSERT INTO timer_presets (minutes, created_at) VALUES (?, ?)",
  );
  const now = Date.now();
  insertPreset.run(25, now);
  insertPreset.run(50, now);
  insertPreset.run(90, now);
}

const settingsExists = db.prepare("SELECT id FROM settings WHERE id = 1").get();
if (!settingsExists) {
  db.prepare("INSERT INTO settings (id) VALUES (1)").run();
}
