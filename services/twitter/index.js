const Twitter = require('twitter-lite')
const AWS = require('aws-sdk')
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const parse = require('date-fns/parse')
const { getSettings, getUserInfo, storeUserInfo, storeItems } = require('syte-common')

const fetchUserTimeline = async (settings, sinceId) => {
    console.log('Fetching user timeline')
    const client = new Twitter({
        consumer_key: settings.consumerKey,
        consumer_secret: settings.consumerSecret,
        access_token_key: settings.tokenKey,
        access_token_secret: settings.tokenSecret,
    })

    const request = {
        screen_name: settings.username,
        include_rts: true,
        exclude_replies: true,
        count: 100,
    }

    //since_id shouldn't be included in the request if it's null
    if (sinceId) {
        request.since_id = parseInt(sinceId)
    }

    let userInfo
    let userPictures = []
    let tweets = []

    const response = await client.get('statuses/user_timeline', request)
    delete response._headers
    console.log('Number of tweets:', response.length)

    response.forEach((tweet) => {
        const parsedTweet = parseTweet(tweet)
        tweets.push(parsedTweet)

        if (!userInfo && !sinceId) {
            userInfo = parseUserInfo(tweet)
        }

        if (!parsedTweet.retweeted && parsedTweet.pictures) {
            userPictures.push(...parsedTweet.pictures)
        }
    })

    if (userInfo) {
        userInfo.pictures = userPictures
    }

    return { userInfo, tweets }
}

const parseTweet = (tweet) => {
    const createdDate = parse(tweet.created_at, 'EEE MMM dd HH:mm:ss xx yyyy', new Date())
    const post = {
        id: tweet.id_str,
        date: createdDate.toISOString(),
        timestamp: createdDate.getTime(),
        type: 'twitter',
        text: linkifyText(tweet.text),
        retweeted: false,
    }

    // parsing pictures and videos
    if (tweet.extended_entities && tweet.extended_entities.media) {
        let pictures = []
        tweet.extended_entities.media.forEach((media) => {
            let cleanedMedia = {
                id: media.id_str,
                url: media.media_url_https,
                tweetID: post.id,
                date: post.date,
            }

            if (media.sizes && media.sizes.small) {
                cleanedMedia.width = media.sizes.small.w
                cleanedMedia.height = media.sizes.small.h
            }

            pictures.push(cleanedMedia)

            if (media.video_info && media.video_info.variants) {
                media.video_info.variants.forEach((videoInfo) => {
                    if (videoInfo.content_type && videoInfo.content_type == 'video/mp4') {
                        post.video = videoInfo.url
                    }
                })
            }
        })
        post.pictures = pictures
    }

    if (tweet.retweeted_status && tweet.retweeted_status.user) {
        const retweet = tweet.retweeted_status
        const user = retweet.user
        post.retweeted = true
        post.url = 'https://www.twitter.com/' + user.screen_name + '/status/' + retweet.id_str
        post.favorites = retweet.favorite_count
        post.retweets = retweet.retweet_count
        post.user = {
            username: user.screen_name,
            name: user.name,
            picture: user.profile_image_url_https,
            id: user.id_str,
        }
        post.originalText = linkifyText(retweet.text)
    } else {
        post.url = 'https://www.twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str
        post.favorites = tweet.favorite_count
        post.retweets = tweet.retweet_count
        post.user = {
            username: tweet.user.screen_name,
            name: tweet.user.name,
            picture: tweet.user.profile_image_url_https,
            id: tweet.user.id_str,
        }
    }

    return post
}

const parseUserInfo = ({ user }) => {
    return {
        id: user.id_str,
        type: 'user',
        name: user.name,
        username: user.screen_name,
        description: linkifyText(user.description),
        location: user.location && user.location.length ? user.location : null,
        url: user.url,
        followers: user.followers_count,
        following: user.friends_count,
        statuses: user.statuses_count,
        picture: user.profile_image_url_https
            ? user.profile_image_url_https.replace(/_normal/gi, '')
            : user.profile_image_url_http,
        banner: user.profile_banner_url ? user.profile_banner_url + '/mobile_retina' : null,
    }
}

const storeUser = async (userInfo) => {
    if (!userInfo) {
        return
    }

    let existing = await getUserInfo(AWS, AWS_REGION, 'twitter')
    if (existing.pictures) {
        userInfo.pictures = [...existing.pictures, ...userInfo.pictures]
    }

    await storeUserInfo(AWS, AWS_REGION, 'twitter', userInfo)
}

// gets the id of the most recent tweet saved
const getSinceId = async () => {
    const dynamodb = new AWS.DynamoDB({ region: AWS_REGION })
    const data = await dynamodb
        .query({
            TableName: 'timeline',
            KeyConditionExpression: '#T = :T',
            ExpressionAttributeNames: {
                '#T': 'type',
            },
            ExpressionAttributeValues: {
                ':T': {
                    S: 'twitter',
                },
            },
            ScanIndexForward: false,
            Limit: 1,
        })
        .promise()

    if (data.Items && data.Items.length) {
        const item = dynamoToJS(data.Items[0])
        return item.details.id
    }

    return null
}

const dynamoToJS = (data) => {
    return AWS.DynamoDB.Converter.unmarshall(data)
}

const linkifyText = (text) => {
    text = text.replace(/(https?:\/\/\S+)/gi, function (s) {
        return '<a href="' + s + '" target="_blank" rel="noopener noreferrer">' + s + '</a>'
    })

    text = text.replace(/(^|)@(\w+)/gi, function (s) {
        return '<a href="https://twitter.com/' + s + '" target="_blank" rel="noopener noreferrer">' + s + '</a>'
    })

    text = text.replace(/(^|)#(\w+)/gi, function (s) {
        return (
            '<a href="https://twitter.com/search?q=' +
            s.replace(/#/, '%23') +
            '" target="_blank" rel="noopener noreferrer">' +
            s +
            '</a>'
        )
    })

    text = text.replace(/\n/g, '<br>')

    return text
}

exports.handler = async () => {
    const type = 'twitter'
    const settings = await getSettings(AWS, AWS_REGION, type)
    const sinceId = await getSinceId()
    const { userInfo, tweets } = await fetchUserTimeline(settings, sinceId)
    await storeUser(userInfo)
    await storeItems(AWS, AWS_REGION, type, tweets)
    console.log('Done!!')
}
