const db = require('../services/db');
const config = require('../config');

function getAll() {
    const data = db.getReports();

    return data;
}

function getLastUpdate() {
    const data = db.getSetting('last_update');

    return data;
}


module.exports = {
    getAll,
    getLastUpdate
}