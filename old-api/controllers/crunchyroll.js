var express = require('express'),
    router = express.Router(),
    request = require('request'),
    Crunchyroll = require('../models/crunchyroll');

router.get('/', function(req, res) {
    Crunchyroll.monthActivity(0, function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

router.get('/setup', function(req, res) {
    if (process.env.SETUP_ENABLED != 'true') {
        res.status(404).send('Not found');
        return;
    }

    Crunchyroll.setup(function(error, data) {
        res.status(200).send(error ? 'Setup failed see logs' : 'Setup done!');
    });
});

router.get('/recent', function(req, res) {
    Crunchyroll.recentActivity(function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

router.get('/user', function(req, res) {
    Crunchyroll.user(function(error, data) {
        res.status(200).json(data);
    });
});

router.get('/:page', function(req, res) {
    var page = parseInt(req.params.page);
    if (!page) page = 0;

    Crunchyroll.monthActivity(page, function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

module.exports = router;
