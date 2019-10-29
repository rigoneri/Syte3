var request = require('request'),
    moment = require('moment'),
    async = require('async'),
    cache = require('memory-cache');

var SPOTIFY_API_URL = 'https://api.spotify.com/v1/';

var lastUpdatedUser;

exports.user = function(cb) {
    var needUpdate = true;
    if (lastUpdatedUser) {
        var minutes = moment().diff(lastUpdatedUser, 'minutes');
        if (minutes < process.env.SPOTIFY_UPDATE_FREQ_MINUTES * 10) {
            needUpdate = false;
        }
    }

    var cachedUser = cache.get('lastfm-user');
    if (!needUpdate && cachedUser) {
        cb(null, cachedUser);
        return;
    }

    validToken(function() {
        request(
            {
                url: SPOTIFY_API_URL + 'me',
                headers: {
                    Authorization: 'Bearer ' + cache.get('spotify-at'),
                },
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);
                    var user = {
                        id: body.id,
                        name: body.display_name,
                        username: body.display_name,
                    };

                    if (body.external_urls) {
                        user.url = body.external_urls.spotify;
                    }

                    if (body.images) {
                        user.picture = body.images[0].url;
                    }

                    cache.put('lastfm-user', user);
                    lastUpdatedUser = new Date();
                    cb(null, user);
                } else {
                    console.log(error, body);
                    cb(error, null);
                }
            }
        );
    });
};

var lastUpdatedTracks;

exports.recentActivity = function(cb) {
    var needUpdate = true;
    if (lastUpdatedTracks) {
        var minutes = moment().diff(lastUpdatedTracks, 'minutes');
        if (minutes < process.env.SPOTIFY_UPDATE_FREQ_MINUTES) {
            needUpdate = false;
        }
    }

    var cachedActivity = cache.get('lastfm-activity');
    if (!needUpdate && cachedActivity.length) {
        cb(null, cachedActivity);
        return;
    }

    validToken(function() {
        request(
            {
                url: SPOTIFY_API_URL + 'me/player/recently-played?limit=50',
                headers: {
                    Authorization: 'Bearer ' + cache.get('spotify-at'),
                },
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);

                    const results = [];
                    for (var i = 0; i < body.items.length; i++) {
                        var item = body.items[i];
                        var track = {
                            title: item.track.name,
                            url: item.track.external_urls ? item.track.external_urls.spotify : null,
                            id: item.track.id,
                            day: item.played_at.substring(0, 10),
                            date: item.played_at,
                        };

                        if (item.track.artists) {
                            track.artist = item.track.artists[0].name;
                        }

                        if (item.track.album) {
                            if (item.track.album.images.length > 2) {
                                track.image = item.track.album.images[2].url;
                            } else if (item.track.album.images.length > 1) {
                                track.image = item.track.album.images[1].url;
                            } else {
                                track.image = item.track.album.images[0].url;
                            }
                        }

                        if (item.track.preview_url) {
                            track.preview_url = item.track.preview_url;
                        }

                        results.push(track);
                    }

                    if (results) {
                        cache.put('lastfm-activity', results);
                        lastUpdatedTracks = new Date();
                    }

                    cb(null, results);
                } else {
                    console.log(error, body);
                    cb(error, null);
                }
            }
        );
    });
};

var lastUpdatedTop;

exports.topActivity = function(cb) {
    var needUpdate = true;
    if (lastUpdatedTop) {
        var minutes = moment().diff(lastUpdatedTop, 'minutes');
        if (minutes < process.env.SPOTIFY_TOP_UPDATE_FREQ_MINUTES) {
            needUpdate = false;
        }
    }

    var cachedActivity = cache.get('lastfm-top');
    if (!needUpdate && cachedActivity) {
        cb(null, cachedActivity);
        return;
    }
    validToken(function() {
        async.series([_fetchTopArtists, _fetchTopTracks], function(err, results) {
            if (!err && results[0] && results[1]) {
                var topActivity = {
                    artists: results[0],
                    tracks: results[1],
                };
                lastUpdatedTop = new Date();
                cache.put('lastfm-top', topActivity);
                cb(err, topActivity);
            } else {
                cb(err, results);
            }
        });
    });
};

function _fetchTopArtists(cb) {
    request(
        {
            url: SPOTIFY_API_URL + 'me/top/artists?limit=5&time_range=medium_term',
            headers: {
                Authorization: 'Bearer ' + cache.get('spotify-at'),
            },
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                var topArtists = [];
                for (var i = 0; i < body.items.length; i++) {
                    var item = body.items[i];
                    var artist = {
                        name: item.name,
                        count: 0,
                        url: item.external_urls.spotify,
                        id: item.id,
                        genres: item.genres,
                    };

                    if (item.images) {
                        if (item.images.length > 1) {
                            artist.image = item.images[1].url;
                        } else {
                            artist.image = item.images[0].url;
                        }
                    }

                    topArtists.push(artist);
                }

                cb(null, topArtists);
            } else {
                cb(error, null);
            }
        }
    );
}

function _fetchTopTracks(cb) {
    request(
        {
            url: SPOTIFY_API_URL + 'me/top/tracks?limit=10&time_range=medium_term',
            headers: {
                Authorization: 'Bearer ' + cache.get('spotify-at'),
            },
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);

                var topTracks = [];
                for (var i = 0; i < body.items.length; i++) {
                    var item = body.items[i];
                    var track = {
                        id: item.id,
                        name: item.name,
                        count: 0,
                        url: item.external_urls.spotify,
                    };

                    if (item.artists) {
                        track.artist = item.artists[0].name;
                    }

                    if (item.album) {
                        if (item.album.images.length > 1) {
                            track.image = item.album.images[1].url;
                        } else {
                            track.image = item.album.images[0].url;
                        }
                    }

                    if (item.preview_url) {
                        track.preview_url = item.preview_url;
                    }

                    topTracks.push(track);
                }

                cb(null, topTracks);
            } else {
                cb(error, null);
            }
        }
    );
}

var SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token',
    SPOTIFY_AUTH_REDIRECT_URL = 'http://localhost:4000/api/spotify/auth';

exports.getToken = function(code, cb) {
    request(
        {
            url: SPOTIFY_TOKEN_URL,
            method: 'POST',
            form: {
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: SPOTIFY_AUTH_REDIRECT_URL,
                scope: 'user-top-read user-read-recently-played',
                code: code,
            },
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                console.log(body);
                //TODO! handle refresh token!!!
                if (body.access_token) {
                    cache.put('spotify-at', body.access_token);
                    cache.put('spotify-rt', body.refresh_token);
                    cache.put('spotify-expires', moment());
                    cb({ access_token: body.access_token });
                } else {
                    cb(body);
                }
            } else {
                cb(body);
            }
        }
    );
};

function validToken(cb) {
    var token = cache.get('spotify-at');
    console.log('SPOTIFY TOKEN', token);
    var tokenExpires = cache.get('spotify-expires');
    console.log('TOKEN', tokenExpires);

    var needsUpdate = true;
    if (tokenExpires) {
        var seconds = moment().diff(tokenExpires, 'seconds');
        console.log('seconds', seconds);
        if (seconds < 3600) {
            needsUpdate = false;
        }
    }

    if (!needsUpdate) {
        cb();
        return;
    }

    if (!cache.get('spotify-rt')) {
        cb();
        return;
    }

    request(
        {
            url: SPOTIFY_TOKEN_URL,
            method: 'POST',
            form: {
                grant_type: 'refresh_token',
                refresh_token: cache.get('spotify-rt'),
            },
            headers: {
                Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
            },
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                console.log('REFRESH TOKEN', body);
                //TODO! handle refresh token!!!
                if (body.access_token) {
                    cache.put('spotify-at', body.access_token);
                    if (body.refresh_token) {
                        cache.put('spotify-rt', body.refresh_token);
                    }
                    cache.put('spotify-expires', moment());
                    cb();
                } else {
                    cb();
                }
            } else {
                console.log('REFRESH TOKEN ERROR', body);
                cb();
            }
        }
    );
}
