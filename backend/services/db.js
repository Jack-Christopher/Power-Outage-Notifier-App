const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('database.db'));


function init() {
    db.prepare(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )`).run();

    // insert default settings
    db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`).run('last_update', '2000-01-01');

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
    db.prepare(`UPDATE settings SET value = ? WHERE key = ?`).run(value, key);
}


function addReport(report) {
  db.prepare(`INSERT INTO reports (id, date, description) VALUES (?, ?, ?)`).run(report.id, report.date, report.description);
}

function getReports() {
    const data = db.prepare(`SELECT * FROM reports ORDER BY date DESC`).all();

    return data;
}


function getIdList() {
    var id_list = [];
    const data = db.prepare(`SELECT id FROM reports ORDER BY date DESC`).all();
    for (var i = 0; i < data.length; i++) {
        id_list.push(parseInt(data[i].id));
    }
    
    return id_list;
}

function clear() {
    db.prepare(`DELETE FROM reports`).run();
    db.prepare(`DELETE FROM settings`).run();
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
    getReports,
    getIdList,
    clear
};
