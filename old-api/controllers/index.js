var express = require('express'),
    router = express.Router();

router.use('/api/stream', require('./stream'));

if (process.env.TWITTER_INTEGRATION_DISABLED != 'true') {
    router.use('/api/twitter', require('./twitter'));
}

if (process.env.INSTAGRAM_INTEGRATION_DISABLED != 'true') {
    router.use('/api/instagram', require('./instagram'));
}

if (process.env.FOURSQUARE_INTEGRATION_DISABLED != 'true') {
    router.use('/api/foursquare', require('./foursquare'));
}

if (process.env.DRIBBBLE_INTEGRATION_DISABLED != 'true') {
    router.use('/api/dribbble', require('./dribbble'));
}

if (process.env.TUMBLR_INTEGRATION_DISABLED != 'true') {
    router.use('/api/tumblr', require('./tumblr'));
    router.get('/api/post/:postId', function(req, res) {
        res.redirect('/api/#/post/' + req.params.postId);
    });
}

if (process.env.GITHUB_INTEGRATION_DISABLED != 'true') {
    router.use('/api/github', require('./github'));
}

if (process.env.LASTFM_INTEGRATION_DISABLED != 'true') {
    router.use('/api/lastfm', require('./lastfm'));
}

if (process.env.SPOTIFY_INTEGRATION_DISABLED != 'true') {
    router.use('/api/spotify', require('./spotify'));
}

if (process.env.YOUTUBE_INTEGRATION_DISABLED != 'true') {
    router.use('/api/youtube', require('./youtube'));
}

module.exports = router;
