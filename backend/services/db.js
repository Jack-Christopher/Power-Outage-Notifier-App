const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('database.db'));


function init() {
    db.prepare(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )`).run();

    db.prepare(`CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY,
        date TEXT,
        description TEXT
    )`).run();
}

function getSetting(key) {
    const row = db.prepare(`SELECT value FROM settings WHERE key = ?`).get(key);
    return row ? row.value : null;
}

function setSetting(key, value) {
    db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`).run(key, value);
}


function addReport(report) {
  db.prepare(`INSERT INTO reports (id, date, description) VALUES (?, ?, ?)`).run(report.id, report.date, report.description);
}

function getReports() {
    const data = db.prepare(`SELECT * FROM reports ORDER BY date DESC`).all();

    return data;
}


function query(sql, params) {
  return db.prepare(sql).all(params).run();
}


module.exports = {
    init,
    query,
    getSetting,
    setSetting,
    addReport,
    getReports
};
