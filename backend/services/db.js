
const { Client } = require('pg');

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


function init() {
    // db.prepare(`CREATE TABLE IF NOT EXISTS settings (
    //     key TEXT PRIMARY KEY,
    //     value TEXT
    // )`).run();
    db.connect();
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
    db.end();
}

function getSetting(key) {
    db.connect();
    // const row = db.prepare(`SELECT value FROM settings WHERE key = ?`).get(key);
    // return row ? row.value : null;
    const row = db.query(`SELECT value FROM settings WHERE key = $1`, [key]);
    db.end();
    return row ? row.value : null;
}

function setSetting(key, value) {
    db.connect();
    // db.prepare(`UPDATE settings SET value = ? WHERE key = ?`).run(value, key);
    db.query(`UPDATE settings SET value = $1 WHERE key = $2`, [value, key]);
    db.end();
}


function addReport(report) {
    db.connect();
//   db.prepare(`INSERT OR IGNORE INTO reports (id, date, description) VALUES (?, ?, ?)`).run(report.id, report.date, report.description);
    db.query(`INSERT INTO reports (id, date, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [report.id, report.date, report.description]);
    db.end();
}

function getReports() {
    db.connect();
    // const data = db.prepare(`SELECT * FROM reports ORDER BY date DESC`).all();
    // return data;
    const data = db.query(`SELECT * FROM reports ORDER BY date DESC`);
    db.end();
    return data;
}


function getIdList() {
    var id_list = [];
    db.connect();
    // const data = db.prepare(`SELECT id FROM reports ORDER BY date DESC`).all();
    const data = db.query(`SELECT id FROM reports ORDER BY date DESC`);
    db.end();
    for (var i = 0; i < data.length; i++) {
        id_list.push(parseInt(data[i].id));
    }
    
    return id_list;
}

function clear() {
    db.connect();
    // db.prepare(`DELETE FROM reports`).run();
    // db.prepare(`DELETE FROM settings`).run();
    db.query(`DELETE FROM reports`);
    db.query(`DELETE FROM settings`);
    db.end();
}

function query(sql, params) {
    db.connect();
//   return dñb.prepare(sql).all(params).run();
    var query = db.query(sql, params);
    db.end();
    return query;

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
