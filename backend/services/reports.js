const db = require('../services/db');
const config = require('../config');

function getAll() {
    const data = db.getReports();

    return data;
}

module.exports = {
    getAll
}