const express = require('express');
const router = express.Router();
const reports = require('../services/reports');
const seeker = require('../services/seeker');

// GET reports listing
router.get('/all', function(req, res, next) {
    try {
        res.json(reports.getAll(req.query.page));
    } catch(err) {
        console.error(`Error while getting reports: `, err.message);
        next(err);
    }
});

// GET reports from seeker
router.get('/seeker', function(req, res, next) {
    try {
        seeker.scraper().then((data) => {
            res.json(data);
        });
    } catch(err) {
        console.error(`Error while getting reports: `, err.message);
        next(err);
    }
});

module.exports = router;
