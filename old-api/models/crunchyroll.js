var request = require('request'),
    moment = require('moment'),
    db = require('../db'),
    dates = require('../utils/dates'),
    cache = require('memory-cache'),
    jsdom = require('jsdom'),
    crypto = require('crypto');

var CRUNCHYROLL_HISTORY_URL = 'https://www.crunchyroll.com/home/history';
var CRUNCHYROLL_USER_URL = 'https://www.crunchyroll.com/user/';

var lastUpdated;

exports.monthActivity = function(page, cb) {
    if (process.env.CRUNCHYROLL_INTEGRATION_DISABLED == 'true') {
        cb(null, []);
        return;
    }

    dates.monthRange(page, function(start, end) {
        var cacheKey = 'crunchyroll-' + moment(start).format('YYYY-MM-DD');
        if (page == 0) {
            //if it's the first month check if data needs to be updated
            exports.update(function(updated) {
                var cachedData = cache.get(cacheKey);
                if (!updated && cachedData) {
                    console.log('Crunchyroll page', page, 'used cache:', cachedData.length);
                    cb(null, cachedData);
                } else {
                    db.collection('crunchyrolldb')
                        .find({
                            date: { $gte: start, $lte: end },
                        })
                        .sort({ date: -1 })
                        .toArray(function(err, posts) {
                            console.log('Crunchyroll page', page, 'used db:', posts.length);
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
                console.log('Crunchyroll page', page, 'used cache:', cachedData.length);
                cb(null, cachedData);
            } else {
                db.collection('crunchyrolldb')
                    .find({
                        date: { $gte: start, $lte: end },
                    })
                    .sort({ date: -1 })
                    .toArray(function(err, posts) {
                        console.log('Crunchyroll page', page, 'used db:', posts.length);
                        if (!err && posts.length) {
                            cache.put(cacheKey, posts);
                        }
                        cb(err, posts);
                    });
            }
        }
    });
};

exports.recentActivity = function(cb) {
    if (process.env.CRUNCHYROLL_INTEGRATION_DISABLED == 'true') {
        cb(null, []);
        return;
    }

    dates.lastYearRange(function(start, end) {
        var cacheKey = 'crunchyroll-year-' + moment(start).format('YYYY-MM-DD');

        var cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log('Crunchyroll recent activity, used cache:', cachedData.length);
            cb(null, cachedData);
        } else {
            db.collection('crunchyrolldb')
                .find({
                    date: { $gte: start, $lte: end },
                })
                .sort({ date: -1 })
                .toArray(function(err, posts) {
                    console.log('Crunchyroll recent activity, used db:', posts.length);
                    if (!err && posts.length) {
                        cache.put(cacheKey, posts);
                    }
                    cb(err, posts);
                });
        }
    });
};

exports.update = function(cb) {
    db.lastUpdatedDate(lastUpdated, 'crunchyroll', function(date) {
        var needUpdate = true;
        if (date) {
            var minutes = moment().diff(date, 'minutes');
            if (minutes < process.env.CRUNCHYROLL_UPDATE_FREQ_MINUTES) {
                console.log('Crunchyroll next update in', process.env.CRUNCHYROLL_UPDATE_FREQ_MINUTES - minutes, 'minutes');
                needUpdate = false;
            }
        }

        if (needUpdate) {
            exports.fetch(function(err, posts) {
                console.log('Crunchyroll needed update and fetched:', posts.length);
                if (!err) {
                    db.setLastUpdatedDate('crunchyroll', function(err) {
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
    if (process.env.CRUNCHYROLL_INTEGRATION_DISABLED == 'true') {
        cb(null, []);
        return;
    }

    exports.fetch(function(err, posts) {
        console.log('Crunchyroll needed update and fetched:', posts.length);
        if (!err) {
            db.setLastUpdatedDate('crunchyroll', function(err) {
                if (!err) {
                    lastUpdated = new Date();
                }
                cb(false);
            });
        } else {
            cb(false);
        }
    });
};

exports.fetch = function(cb) {
    var j = request.jar();
    var cookie = request.cookie('session_id=' + process.env.CRUNCHYROLL_SESSION_ID);
    var url = CRUNCHYROLL_HISTORY_URL;
    j.setCookie(cookie, url);

    request({ url: url, jar: j }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var dom = new jsdom.JSDOM(body);
            var doc = dom.window.document;

            var history = [];
            if (doc.querySelector('#main_content ul')) {
                var listItems = doc.querySelector('#main_content ul').children;
                for (var li = 0; li < listItems.length; li++) {
                    var listItem = listItems[li];
                    var url = listItem.querySelector('a').getAttribute('href');
                    var image = listItem.querySelector('a .landscape').getAttribute('src');
                    var title = listItem.querySelector('a .series-title').textContent.trim();
                    var description = listItem.querySelector('a .short-desc').textContent.trim();

                    var progress = listItem.querySelector('a .episode-progress');
                    if (progress) {
                        progress = progress
                            .getAttribute('style')
                            .replace('width: ', '')
                            .replace('%', '');

                        if (progress.length) {
                            progress = parseFloat(progress);
                            if (progress < 50) {
                                continue;
                            }
                        }
                    }

                    history.push({
                        id: crypto
                            .createHash('sha1')
                            .update(description)
                            .digest('hex'),
                        url: url,
                        picture: image,
                        title: title,
                        description: description,
                        type: 'crunchyroll',
                        date: new Date().toISOString(),
                        lastUpdated: new Date().toISOString(),
                    });
                }
                _save_history(history);
            }
            cb(null, history);
        } else {
            cb(error, []);
        }
    });
};

function _save_history(history) {
    var bulk = db.collection('crunchyrolldb').initializeUnorderedBulkOp();
    for (var i = 0; i < history.length; i++) {
        var post = history[i];
        console.log('save post', post);
        bulk.find({ id: post.id })
            .upsert()
            .updateOne({
                $set: { lastUpdated: new Date().toISOString() },
                $setOnInsert: post,
            });
    }
    bulk.execute(function(err, result) {
        console.log(result);
    });
}

var lastUpdatedUser;

exports.user = function(cb) {
    var needUpdate = true;
    if (lastUpdatedUser) {
        var minutes = moment().diff(lastUpdatedUser, 'minutes');
        if (minutes < process.env.CRUNCHYROLL_UPDATE_FREQ_MINUTES) {
            needUpdate = false;
        }
    }

    var cachedUser = cache.get('crunchyroll-user');
    if (!needUpdate && cachedUser) {
        cb(null, cachedUser);
        return;
    }

    var j = request.jar();
    var cookie = request.cookie('session_id=' + process.env.CRUNCHYROLL_SESSION_ID);
    var url = CRUNCHYROLL_USER_URL + process.env.CRUNCHYROLL_USERNAME;
    j.setCookie(cookie, url);

    request({ url: url, jar: j }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var dom = new jsdom.JSDOM(body);
            var doc = dom.window.document;

            var crunchyrollUser = {
                username: process.env.CRUNCHYROLL_USERNAME,
            };

            var image = doc.querySelector('#library_mug');
            if (image) {
                crunchyrollUser.picture = image.getAttribute('src');
            }

            cache.put('crunchyroll-user', crunchyrollUser);
            lastUpdatedUser = new Date();
            cb(null, crunchyrollUser);
        } else {
            cb(error, []);
        }
    });
};
