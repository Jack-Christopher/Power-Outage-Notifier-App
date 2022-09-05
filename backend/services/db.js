
const { Client } = require('pg');

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log('DATABASE_URL: ', process.env.DATABASE_URL);
db.connect();


function init() {
    db.query(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )`, (err, res) => {
        if (err) {
            console.log('Error creating table: ', err);
        } else {
            console.log('Table created');
        }
    });

    db.query(`INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`, ['last_update', '2000-01-01'], (err, res) => {
        if (err) {
            console.log('Error inserting into table: ', err);
        } else {
            console.log('Inserted into table');
        }
    });

    db.query(`CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY,
        date TEXT,
        description TEXT
    )`, (err, res) => {
        if (err) {
            console.log('Error creating table: ', err);
        } else {
            console.log('Table created');
        }
    });
}

function getSetting(key) {
    const row = db.query(`SELECT value FROM settings WHERE key = $1`, [key], (err, res) => {
        if (err) {
            console.log('Error getting setting: ', err);
        } else {
            console.log('Got setting');
        }
    });
    return row ? row.value : null;
}

function setSetting(key, value) {
    db.query(`UPDATE settings SET value = $1 WHERE key = $2`, [value, key], (err, res) => {
        if (err) {
            console.log('Error setting setting: ', err);
        } else {
            console.log('Set setting');
        }
    });
}


function addReport(report) {
    db.query(`INSERT INTO reports (id, date, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, 
        [report.id, report.date, report.description], (err, res) => {
            if (err) {
                console.log('Error inserting into table: ', err);
            } else {
                console.log('Inserted into table');
            }
        }
    );
}

function getReports() {
    const data = db.query(`SELECT * FROM reports ORDER BY date DESC`, (err, res) => {
        if (err) {
            console.log('Error getting reports: ', err);
        } else {
            console.log('Got reports');
        }
    });
    return data;
}


function getIdList() {
    var id_list = [];
    const data = db.query(`SELECT id FROM reports ORDER BY date DESC`, (err, res) => {
        if (err) {
            console.log('Error getting reports: ', err);
        } else {
            console.log('Got reports');
        }
    });
    for (var i = 0; i < data.length; i++) {
        id_list.push(parseInt(data[i].id));
    }
    
    return id_list;
}

function clear() {
    db.query(`DELETE FROM reports`, (err, res) => {
        if (err) {
            console.log('Error clearing table: ', err);
        } else {
            console.log('Cleared table');
        }
    });
    db.query(`DELETE FROM settings`, (err, res) => {
        if (err) {
            console.log('Error clearing table: ', err);
        } else {
            console.log('Cleared table');
        }
    });
}

function query(sql, params) {
    var query = db.query(sql, params, (err, res) => {
        if (err) {
            console.log('Error querying: ', err);
        } else {
            console.log('Queried');
        }
    });
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
