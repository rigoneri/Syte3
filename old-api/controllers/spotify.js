var express = require('express'),
    router = express.Router(),
    Spotify = require('../models/spotify');

var SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';

router.get('/top', function(req, res) {
    Spotify.topActivity(function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

router.get('/user', function(req, res) {
    Spotify.user(function(error, data) {
        res.status(200).json(data);
    });
});

router.get('/activity', function(req, res) {
    Spotify.recentActivity(function(error, data) {
        if (!error) {
            res.status(200).json(data);
        }
    });
});

router.get('/auth', function(req, res) {
    if (process.env.SPOTIFY_OAUTH_ENABLED != 'true') {
        res.status(404).send('Not found');
        return;
    }

    var code = req.query.code;
    if (code) {
        Spotify.getToken(code, function(response) {
            res.status(200).json(response);
        });
    } else {
        var url =
            SPOTIFY_AUTH_URL +
            '?client_id=' +
            process.env.SPOTIFY_CLIENT_ID +
            '&redirect_uri=' +
            process.env.SPOTIFY_AUTH_REDIRECT_URL +
            '&response_type=code&scope=user-top-read user-read-recently-played';
        res.redirect(url);
    }
});

module.exports = router;
