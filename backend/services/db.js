
const { Pool } = require('pg')

// using env variables
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})


function init() {
    // db.prepare(`CREATE TABLE IF NOT EXISTS settings (
    //     key TEXT PRIMARY KEY,
    //     value TEXT
    // )`).run();
    db.query(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )`);

    // insert default settings
    // db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`).run('last_update', '2000-01-01');
    db.query(`INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`, ['last_update', '2000-01-01']);

    // db.prepare(`CREATE TABLE IF NOT EXISTS reports (
    //     id INTEGER PRIMARY KEY,
    //     date TEXT,
    //     description TEXT
    // )`).run();
    db.query(`CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY,
        date TEXT,
        description TEXT
    )`);
}

function getSetting(key) {
    // const row = db.prepare(`SELECT value FROM settings WHERE key = ?`).get(key);
    // return row ? row.value : null;
    const row = db.query(`SELECT value FROM settings WHERE key = $1`, [key]);
    return row ? row.value : null;
}

function setSetting(key, value) {
    // db.prepare(`UPDATE settings SET value = ? WHERE key = ?`).run(value, key);
    db.query(`UPDATE settings SET value = $1 WHERE key = $2`, [value, key]);
}


function addReport(report) {
//   db.prepare(`INSERT OR IGNORE INTO reports (id, date, description) VALUES (?, ?, ?)`).run(report.id, report.date, report.description);
    db.query(`INSERT INTO reports (id, date, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [report.id, report.date, report.description]);
}

function getReports() {
    // const data = db.prepare(`SELECT * FROM reports ORDER BY date DESC`).all();
    // return data;
    const data = db.query(`SELECT * FROM reports ORDER BY date DESC`);
    return data;
}


function getIdList() {
    var id_list = [];
    // const data = db.prepare(`SELECT id FROM reports ORDER BY date DESC`).all();
    const data = db.query(`SELECT id FROM reports ORDER BY date DESC`);
    for (var i = 0; i < data.length; i++) {
        id_list.push(parseInt(data[i].id));
    }
    
    return id_list;
}

function clear() {
    // db.prepare(`DELETE FROM reports`).run();
    // db.prepare(`DELETE FROM settings`).run();
    db.query(`DELETE FROM reports`);
    db.query(`DELETE FROM settings`);
}

function query(sql, params) {
//   return db.prepare(sql).all(params).run();
    return db.query(sql, params);
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
