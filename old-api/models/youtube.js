var request = require('request'),
    moment = require('moment'),
    db = require('../db'),
    dates = require('../utils/dates'),
    cache = require('memory-cache');

var YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/';
var lastUpdated;

exports.monthActivity = function(page, cb) {
    if (process.env.YOUTUBE_INTEGRATION_DISABLED == 'true') {
        cb(null, []);
        return;
    }

    dates.monthRange(page, function(start, end) {
        var cacheKey = 'youtube-' + moment(start).format('YYYY-MM-DD');
        if (page == 0) {
            //if it's the first month check if data needs to be updated
            exports.update(function(updated) {
                var cachedData = cache.get(cacheKey);
                if (!updated && cachedData) {
                    console.log('Youtube page', page, 'used cache:', cachedData.length);
                    cb(null, cachedData);
                } else {
                    db.collection('youtubedb')
                        .find({
                            date: { $gte: start, $lte: end },
                        })
                        .sort({ date: -1 })
                        .toArray(function(err, posts) {
                            console.log('Youtube page', page, 'used db:', posts.length);
                            if (!err && posts.length) {
                                cache.put(cacheKey, posts);
                            }
                            cb(err, posts);
                        });
                }
            });
        } else {
            var cachedData = cache.get(cacheKey);
            if (cachedData) {
                console.log('Youtube page', page, 'used cache:', cachedData.length);
                cb(null, cachedData);
            } else {
                db.collection('youtubedb')
                    .find({
                        date: { $gte: start, $lte: end },
                    })
                    .sort({ date: -1 })
                    .toArray(function(err, posts) {
                        console.log('Youtube page', page, 'used db:', posts.length);
                        if (!err && posts.length) {
                            cache.put(cacheKey, posts);
                        }
                        cb(err, posts);
                    });
            }
        }
    });
};

var lastUpdatedRecentActivity;
var allPosts = [];
var allLikes = [];
var limit = 10;

exports.recentActivity = function(page, cb) {
    var needUpdate = true;
    if (lastUpdatedRecentActivity) {
        var minutes = moment().diff(lastUpdatedRecentActivity, 'minutes');
        if (minutes < process.env.YOUTUBE_UPDATE_FREQ_MINUTES) {
            needUpdate = false;
        }
    } else {
        allLikes = cache.get('youtube-likes') || [];
    }

    var query = {};
    if (needUpdate && page == 0) {
        allPosts = [];
        allLikes = cache.get('youtube-likes') || [];
    } else {
        var start = page * limit;
        var end = start + limit;

        if (allPosts.slice(start, end).length) {
            cb(null, {
                uploads: allPosts.slice(start, end),
                likes: allLikes.slice(start, end).length ? allLikes.slice(start, end) : [],
            });
            return;
        }

        if (allPosts.length > 0) {
            var lastPost = allPosts[allPosts.length - 1];
            query = { date: { $lt: lastPost.date } };
        }
    }

    db.collection('youtubedb')
        .find(query)
        .limit(limit)
        .sort({ date: -1 })
        .toArray(function(err, posts) {
            if (!err && posts.length) {
                allPosts = allPosts.concat(posts);
                lastUpdatedRecentActivity = new Date();
                cb(null, {
                    uploads: posts,
                    likes: allLikes.slice(page * limit, page * limit + limit),
                });
            } else {
                cb(err, {});
            }
        });
};

exports.update = function(cb) {
    db.lastUpdatedDate(lastUpdated, 'youtube', function(date) {
        var needUpdate = true;
        if (date) {
            var minutes = moment().diff(date, 'minutes');
            if (minutes < process.env.YOUTUBE_UPDATE_FREQ_MINUTES) {
                console.log('Youtube next update in', process.env.YOUTUBE_UPDATE_FREQ_MINUTES - minutes, 'minutes');
                needUpdate = false;
            }
        }

        if (needUpdate) {
            exports.fetch(3, null, function(err, posts) {
                console.log('Youtube needed update and fetched:', posts.length);
                if (!err && posts && posts.length > 0) {
                    var bulk = db.collection('youtubedb').initializeUnorderedBulkOp();
                    for (var i = 0; i < posts.length; i++) {
                        var post = posts[i];
                        bulk.find({ id: post.id })
                            .upsert()
                            .updateOne(post);
                    }
                    bulk.execute(function(err, result) {
                        if (err) {
                            console.log('Youtube Bulk Error', err);
                        }
                        db.setLastUpdatedDate('youtube', function(err) {
                            if (!err) {
                                lastUpdated = new Date();
                                cb(true);
                            } else {
                                cb(false);
                            }
                        });
                    });
                } else if (!err) {
                    db.setLastUpdatedDate('youtube', function(err) {
                        if (!err) {
                            lastUpdated = new Date();
                        }
                        cb(false);
                    });
                } else {
                    cb(false);
                }
            });
        } else {
            cb(false);
        }
    });
};

exports.setup = function(cb) {
    if (process.env.YOUTUBE_INTEGRATION_DISABLED == 'true') {
        cb(null, []);
        return;
    }

    //Gets most of the users youtube posts (up to 150?!) and saves to the db...
    var nextToken = null;
    var count = 0;

    function _fetchAndSave(fetchCallback) {
        exports.fetch(50, nextToken, function(err, posts, nextPageToken) {
            console.log('Youtube setup, page:', count, 'received:', posts.length);
            if (!err && posts && posts.length > 0) {
                var bulk = db.collection('youtubedb').initializeUnorderedBulkOp();
                for (var i = 0; i < posts.length; i++) {
                    var post = posts[i];
                    bulk.find({ id: post.id })
                        .upsert()
                        .updateOne(post);
                }
                bulk.execute(function(err, result) {
                    if (nextPageToken) {
                        nextToken = nextPageToken;
                        count++;
                        if (count > 5) {
                            fetchCallback();
                        } else {
                            _fetchAndSave(fetchCallback);
                        }
                    } else {
                        fetchCallback();
                    }
                });
            } else {
                fetchCallback();
            }
        });
    }

    _fetchAndSave(function() {
        db.setLastUpdatedDate('youtube', function(err) {
            if (!err) {
                lastUpdated = new Date();
            }
            exports.monthActivity(0, cb);
        });
    });
};

exports.fetch = function(count, nextToken, cb) {
    var url =
        YOUTUBE_API_URL +
        'playlistItems?access_token=' +
        process.env.YOUTUBE_ACCESS_TOKEN +
        '&part=snippet,status&maxResults=' +
        count +
        '&playlistId=' +
        process.env.YOUTUBE_PLAYLIST_ID;

    if (nextToken) {
        url += '&pageToken=' + nextToken;
    }

    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            var nextPageToken = body.nextPageToken || null;
            var posts = [];

            for (var i = 0; i < body.items.length; i++) {
                var status = body.items[i].status;
                if (status.privacyStatus == 'public') {
                    var post = body.items[i].snippet;
                    if (post.publishedAt && post.resourceId) {
                        var createdDate = moment(post.publishedAt);
                        var cleanedPost = {
                            id: post.resourceId.videoId,
                            date: createdDate.toISOString(),
                            type: 'youtube',
                            title: post.title,
                            description: linkifyText(post.description),
                        };

                        if (post.thumbnails.medium) {
                            cleanedPost.image = post.thumbnails.medium.url;
                        } else if (post.thumbnails.high) {
                            cleanedPost.image = post.thumbnails.high.url;
                        } else if (post.thumbnails.default) {
                            cleanedPost.image = post.thumbnails.high.default;
                        }

                        posts.push(cleanedPost);
                    }
                }
            }

            cb(null, posts, nextPageToken);
        } else if (response.statusCode == 401) {
            exports.refreshToken(function(success) {
                if (success) {
                    exports.fetch(count, nextToken, cb);
                } else {
                    cb(error, []);
                }
            });
        } else {
            cb(error, []);
        }
    });

    function linkifyText(text) {
        text = text.replace(/(https?:\/\/\S+)/gi, function(s) {
            return '<a href="' + s + '" target="_blank">' + s + '</a>';
        });

        text = text.replace(/\n/g, '<br>');

        return text;
    }
};

var lastUpdatedUser;

exports.user = function(cb) {
    var needUpdate = true;
    if (lastUpdatedUser) {
        var minutes = moment().diff(lastUpdatedUser, 'minutes');
        if (minutes < process.env.YOUTUBE_UPDATE_FREQ_MINUTES) {
            needUpdate = false;
        }
    }

    var cachedUser = cache.get('youtube-user');
    if (!needUpdate && cachedUser) {
        cb(null, cachedUser);
        return;
    }

    var url = YOUTUBE_API_URL + 'channels?access_token=' + process.env.YOUTUBE_ACCESS_TOKEN + '&part=brandingSettings,statistics,snippet&mine=true';

    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            if (body.items) {
                body = body.items[0];
                var youtubeUser = {
                    id: body.id,
                    name: body.snippet.title,
                    url: 'https://www.youtube.com/channel/' + body.id,
                };

                if (body.snippet.thumbnails && body.snippet.thumbnails.medium) {
                    youtubeUser.picture = body.snippet.thumbnails.medium.url;
                }

                if (body.statistics) {
                    youtubeUser.subscribers = body.statistics.subscriberCount;
                }

                if (body.brandingSettings && body.brandingSettings.image) {
                    youtubeUser.banner = body.brandingSettings.image.bannerTabletLowImageUrl;
                }

                cache.put('youtube-user', youtubeUser);
                lastUpdatedUser = new Date();
                cb(null, youtubeUser);
            } else {
                cb(null, response);
            }
        } else if (response.statusCode == 401) {
            exports.refreshToken(function(success) {
                if (success) {
                    exports.user(cb);
                } else {
                    cb(error, []);
                }
            });
        } else {
            cb(error, response);
        }
    });
};

var lastUpdatedLikes;

exports.likes = function(cb) {
    var needUpdate = true;
    if (lastUpdatedLikes) {
        var minutes = moment().diff(lastUpdatedLikes, 'minutes');
        if (minutes < process.env.YOUTUBE_UPDATE_FREQ_MINUTES) {
            needUpdate = false;
        }
    }

    var cachedLikes = cache.get('youtube-likes');
    if (!needUpdate && cachedLikes) {
        cb(null, cachedLikes);
        return;
    }

    var url = YOUTUBE_API_URL + 'videos?access_token=' + process.env.YOUTUBE_ACCESS_TOKEN + '&part=snippet&mine=true&myRating=like&maxResults=50';

    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);

            var likedPosts = [];

            body.items.forEach(item => {
                if (item.kind == 'youtube#video') {
                    var post = {
                        id: item.id,
                        date: item.snippet.publishedAt,
                        title: item.snippet.title,
                        channel: item.snippet.channelTitle,
                        type: 'youtube',
                    };

                    if (item.snippet.thumbnails.medium) {
                        post.image = item.snippet.thumbnails.medium.url;
                    } else if (item.snippet.thumbnails.high) {
                        post.image = item.snippet.thumbnails.high.url;
                    } else if (item.snippet.thumbnails.default) {
                        post.image = item.snippet.thumbnails.high.default;
                    }

                    likedPosts.push(post);
                }
            });

            if (likedPosts.length) {
                cache.put('youtube-likes', likedPosts);
                lastUpdatedLikes = new Date();
            }
            cb(null, likedPosts);
        } else if (response.statusCode == 401) {
            exports.refreshToken(function(success) {
                if (success) {
                    exports.likes(cb);
                } else {
                    cb(error, []);
                }
            });
        } else {
            cb(error, response);
        }
    });
};

var YOUTUBE_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token',
    YOUTUBE_AUTH_REDIRECT_URL = 'http://localhost:4000/api/youtube/auth';

exports.getToken = function(code, cb) {
    request(
        {
            url: YOUTUBE_TOKEN_URL,
            method: 'POST',
            form: {
                code: code,
                grant_type: 'authorization_code',
                client_id: process.env.YOUTUBE_CLIENT_ID,
                client_secret: process.env.YOUTUBE_CLIENT_SECRET,
                redirect_uri: YOUTUBE_AUTH_REDIRECT_URL,
            },
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                if (body.access_token) {
                    var url = YOUTUBE_API_URL + 'channels?access_token=' + body.access_token + '&part=contentDetails&mine=true';

                    request(url, function(error, response, channelsBody) {
                        if (!error && response.statusCode == 200) {
                            channelsBody = JSON.parse(channelsBody);
                            var playlistID = channelsBody.items[0].contentDetails.relatedPlaylists.uploads;
                            body.playlist_id = playlistID;
                            cb(body);

                            process.env.YOUTUBE_ACCESS_TOKEN = body.access_token;
                            process.env.YOUTUBE_PLAYLIST_ID = playlistID;
                            process.env.YOUTUBE_REFRESH_TOKEN = body.refresh_token;
                        } else {
                            cb(JSON.parse(channelsBody));
                        }
                    });
                }
            } else {
                cb(JSON.parse(body));
            }
        }
    );
};

exports.refreshToken = function(cb) {
    request(
        {
            url: YOUTUBE_TOKEN_URL,
            method: 'POST',
            form: {
                grant_type: 'refresh_token',
                client_id: process.env.YOUTUBE_CLIENT_ID,
                client_secret: process.env.YOUTUBE_CLIENT_SECRET,
                refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
            },
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                if (body.access_token) {
                    process.env.YOUTUBE_ACCESS_TOKEN = body.access_token;
                    cb(true);
                } else {
                    cb(false);
                }
            } else {
                cb(false);
            }
        }
    );
};
